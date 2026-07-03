import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const partRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ q: z.string().optional(), category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const parts = await ctx.db.part.findMany({ orderBy: { name: "asc" } });
      const q = input?.q?.toLowerCase();
      return parts.filter(
        (p) =>
          (!q || p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)) &&
          (!input?.category || p.category === input.category),
      );
    }),
  categories: publicProcedure.query(async ({ ctx }) => {
    const parts = await ctx.db.part.findMany({ select: { category: true } });
    return [...new Set(parts.map((p) => p.category))].sort();
  }),
  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const part = await ctx.db.part.findUnique({ where: { slug: input.slug } });
    if (!part) throw new TRPCError({ code: "NOT_FOUND" });
    return part;
  }),
});
