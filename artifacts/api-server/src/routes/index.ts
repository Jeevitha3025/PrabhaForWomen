import { Router, type IRouter } from "express";
import aiRouter from "./ai.js";
import healthRouter from "./health";
import mentorRouter from "./mentor";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/ai", aiRouter);
router.use("/mentor", mentorRouter);
export default router;
