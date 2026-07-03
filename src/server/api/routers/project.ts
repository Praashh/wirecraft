import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { assistantReply, buildProject } from "~/lib/engine/engine";
import type { BoardId, BuildResult } from "~/lib/engine/types";

const boardSchema = z.enum(["arduino-uno", "esp32", "pico"]);

const GUEST_PROJECT_LIMIT = 3;

const ownerWhere = (ctx: { session: { user: { id: string } } | null; guestId: string | null }) => {
  if (ctx.session?.user) return { userId: ctx.session.user.id };
  if (ctx.guestId) return { guestId: ctx.guestId };
  return null;
};

export const projectRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(3).max(2000),
        board: boardSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user && ctx.guestId) {
        const count = await ctx.db.project.count({ where: { guestId: ctx.guestId } });
        if (count >= GUEST_PROJECT_LIMIT) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Guest users can create up to ${GUEST_PROJECT_LIMIT} projects. Sign up for unlimited builds.`,
          });
        }
      }

      const result = await buildProject(input.prompt, input.board as BoardId | undefined);
      const reply = await assistantReply(input.prompt, result);
      const owner = ownerWhere(ctx);
      const project = await ctx.db.project.create({
        data: {
          name: result.name,
          board: result.board,
          prompt: input.prompt,
          data: JSON.stringify(result),
          ...(owner ?? {}),
          messages: {
            create: [
              { role: "user", content: input.prompt },
              { role: "assistant", content: reply },
            ],
          },
        },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
      return { project, result };
    }),

  iterate: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        message: z.string().min(1).max(2000),
        board: boardSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.project.findUnique({
        where: { id: input.projectId },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

      const combined = `${existing.prompt}\n${input.message}`;
      const result = await buildProject(combined, (input.board ?? existing.board) as BoardId);
      const reply = await assistantReply(input.message, result);

      const project = await ctx.db.project.update({
        where: { id: existing.id },
        data: {
          name: result.name,
          board: result.board,
          prompt: combined,
          data: JSON.stringify(result),
          messages: {
            create: [
              { role: "user", content: input.message },
              { role: "assistant", content: reply },
            ],
          },
        },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
      return { project, result };
    }),

  get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const project = await ctx.db.project.findUnique({
      where: { id: input.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!project) throw new TRPCError({ code: "NOT_FOUND" });
    return { project, result: JSON.parse(project.data) as BuildResult };
  }),

  list: publicProcedure.query(async ({ ctx }) => {
    const owner = ownerWhere(ctx);
    if (!owner) return [];
    return ctx.db.project.findMany({
      where: owner,
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, board: true, updatedAt: true },
      take: 30,
    });
  }),

  rename: publicProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1).max(80) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.update({ where: { id: input.id }, data: { name: input.name } });
    }),

  remove: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const owner = ownerWhere(ctx);
    if (!owner) throw new TRPCError({ code: "FORBIDDEN" });
    await ctx.db.project.deleteMany({ where: { id: input.id, ...owner } });
    return { ok: true };
  }),
});
