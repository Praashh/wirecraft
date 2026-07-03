import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(60),
        email: z.string().email(),
        password: z.string().min(8).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase();
      const existing = await ctx.db.user.findUnique({ where: { email } });
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "That email already has an account. Sign in instead." });
      }
      const password = await bcrypt.hash(input.password, 10);
      const user = await ctx.db.user.create({ data: { name: input.name, email, password } });
      if (ctx.guestId) {
        await ctx.db.project.updateMany({
          where: { guestId: ctx.guestId },
          data: { userId: user.id, guestId: null },
        });
      }
      return { ok: true };
    }),
});
