import { Router, type IRouter } from "express";
import healthRouter from "./health";
import soundCloudRouter from "./soundcloud";

const router: IRouter = Router();

router.use(healthRouter);
router.use(soundCloudRouter);

export default router;
