import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { BuildResult } from "~/lib/engine/types";

export const guideRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.guide.findMany({
        where: input?.category ? { category: input.category } : undefined,
        select: { slug: true, title: true, category: true, summary: true, board: true },
        orderBy: { title: "asc" },
      });
    }),
  categories: publicProcedure.query(async ({ ctx }) => {
    const guides = await ctx.db.guide.findMany({ select: { category: true } });
    return [...new Set(guides.map((g) => g.category))].sort();
  }),
  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const guide = await ctx.db.guide.findUnique({ where: { slug: input.slug } });
    if (!guide) throw new TRPCError({ code: "NOT_FOUND" });
    return { guide, result: JSON.parse(guide.data) as BuildResult };
  }),
});
