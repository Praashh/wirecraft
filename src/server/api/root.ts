import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { projectRouter } from "~/server/api/routers/project";
import { guideRouter } from "~/server/api/routers/guide";
import { partRouter } from "~/server/api/routers/part";
import { userRouter } from "~/server/api/routers/user";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  guide: guideRouter,
  part: partRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
