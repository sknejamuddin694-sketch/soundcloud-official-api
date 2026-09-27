import { Router, type IRouter } from "express";
import {
  ResolveSoundCloudTrackBody,
  type SoundCloudDownloadResponse,
  type SoundCloudResolveResponse,
  type SoundCloudTrack,
} from "@workspace/api-zod";

const router: IRouter = Router();

const SOUNDCLOUD_API_BASE = "https://api-mobi.soundcloud.com";
const SOUNDCLOUD_HOSTS = new Set([
  "soundcloud.com",
  "www.soundcloud.com",
  "m.soundcloud.com",
]);
const DOWNLOAD_HOST_SUFFIXES = [".sndcdn.com", ".soundcloud.com"];
const REQUEST_TIMEOUT_MS = 10_000;

type SoundCloudApiTrack = {
  id?: unknown;
  urn?: unknown;
  title?: unknown;
  permalink_url?: unknown;
  user?: { username?: unknown };
  downloadable?: unknown;
  download_url?: unknown;
};

type ApiError = {
  error: string;
  message: string;
};

function errorResponse(
  res: Parameters<Parameters<IRouter["post"]>[1]>[1],
  status: number,
  error: string,
  message: string,
) {
  const body: ApiError = { error, message };
  return res.status(status).json(body);
}

function parseSoundCloudUrl(value: unknown): URL | null {
  if (typeof value !== "string" || value.length > 2_048) return null;

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" || !SOUNDCLOUD_HOSTS.has(parsed.hostname)) {
    return null;
  }

  if (parsed.pathname === "/" || parsed.pathname.length < 3) return null;
  parsed.hash = "";
  return parsed;
}

function isSafeDownloadUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;

  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" &&
      DOWNLOAD_HOST_SUFFIXES.some(
        (suffix) =>
          parsed.hostname === suffix.slice(1) ||
          parsed.hostname.endsWith(suffix),
      )
    );
  } catch {
    return false;
  }
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function toTrack(value: SoundCloudApiTrack): SoundCloudTrack {
  return {
    id: typeof value.id === "number" ? value.id : null,
    urn: asNullableString(value.urn),
    title: asNullableString(value.title),
    permalinkUrl: asNullableString(value.permalink_url),
    userName: asNullableString(value.user?.username),
    downloadable: value.downloadable === true,
  };
}

function getClientId(): string | null {
  const value = process.env["SOUNDCLOUD_CLIENT_ID"]?.trim();
  return value ? value : null;
}

async function resolveTrack(url: URL): Promise<SoundCloudApiTrack> {
  const clientId = getClientId();
  if (!clientId) {
    throw new Error("SOUNDCLOUD_CLIENT_ID is not configured");
  }

  const endpoint = new URL("/resolve", SOUNDCLOUD_API_BASE);
  endpoint.searchParams.set("url", url.toString());
  endpoint.searchParams.set("client_id", clientId);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`SoundCloud API returned ${response.status}`);
    }

    return (await response.json()) as SoundCloudApiTrack;
  } finally {
    clearTimeout(timeout);
  }
}

function isMissingCredential(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message === "SOUNDCLOUD_CLIENT_ID is not configured"
  );
}

async function getDownloadableTrack(
  url: URL,
): Promise<{ track: SoundCloudTrack; downloadUrl: string }> {
  const source = await resolveTrack(url);
  const track = toTrack(source);

  if (!track.downloadable || !isSafeDownloadUrl(source.download_url)) {
    throw new Error("TRACK_NOT_DOWNLOADABLE");
  }

  return { track, downloadUrl: source.download_url };
}

router.post("/soundcloud/resolve", async (req, res) => {
  const parsedBody = ResolveSoundCloudTrackBody.safeParse(req.body);
  if (!parsedBody.success) {
    return errorResponse(
      res,
      400,
      "invalid_soundcloud_url",
      "Provide a valid HTTPS SoundCloud track URL.",
    );
  }

  const url = parseSoundCloudUrl(parsedBody.data.url);
  if (!url) {
    return errorResponse(
      res,
      400,
      "invalid_soundcloud_url",
      "Only HTTPS URLs from soundcloud.com are supported.",
    );
  }

  try {
    const source = await resolveTrack(url);
    const body: SoundCloudResolveResponse = {
      track: toTrack(source),
      downloadable: source.downloadable === true,
    };
    return res.json(body);
  } catch (error) {
    if (isMissingCredential(error)) {
      return errorResponse(
        res,
        503,
        "soundcloud_credentials_missing",
        "Configure SOUNDCLOUD_CLIENT_ID to enable official SoundCloud resolution.",
      );
    }

    req.log.warn({ err: error }, "SoundCloud resolve request failed");
    return errorResponse(
      res,
      502,
      "soundcloud_unavailable",
      "SoundCloud could not be reached or returned an invalid response.",
    );
  }
});

router.get("/soundcloud/download-link", async (req, res) => {
  const url = parseSoundCloudUrl(req.query.url);
  if (!url) {
    return errorResponse(
      res,
      400,
      "invalid_soundcloud_url",
      "Provide a valid HTTPS SoundCloud track URL in the url query parameter.",
    );
  }

  try {
    const body: SoundCloudDownloadResponse = await getDownloadableTrack(url);
    return res.json(body);
  } catch (error) {
    if (isMissingCredential(error)) {
      return errorResponse(
        res,
        503,
        "soundcloud_credentials_missing",
        "Configure SOUNDCLOUD_CLIENT_ID to enable official SoundCloud downloads.",
      );
    }

    if (error instanceof Error && error.message === "TRACK_NOT_DOWNLOADABLE") {
      return errorResponse(
        res,
        403,
        "track_not_downloadable",
        "SoundCloud does not mark this track as officially downloadable.",
      );
    }

    req.log.warn({ err: error }, "SoundCloud download-link request failed");
    return errorResponse(
      res,
      502,
      "soundcloud_unavailable",
      "SoundCloud could not be reached or returned an invalid response.",
    );
  }
});

export default router;