import { privateProcedure, publicProcedure, router } from "./trpc";
import sharp from "sharp";
import { ObjectId } from "mongodb";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";

export const appRouter = router({
  saveFile: publicProcedure
    .input(z.object({ configId: z.string().optional(), url: z.string() }))
    .mutation(async ({ input: { configId, url } }) => {
      try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const imgMetaData = await sharp(buffer).metadata();
        const { width, height } = imgMetaData;
        if (!configId) {
          const configuration = await db.configuration.create({
            data: {
              id: new ObjectId().toString(),
              width: width || 500,
              height: height || 500,
              imgUrl: url,
            },
          });
          return { configId: configuration.id };
        } else {
          const updatedConfiguration = await db.configuration.update({
            where: {
              id: configId,
            },
            data: {
              croppedImageUrl: url,
            },
          });
          return { configId: updatedConfiguration.id };
        }
      } catch (e) {
        console.log(e);
      }
    }),
});

export type AppRouter = typeof appRouter;
