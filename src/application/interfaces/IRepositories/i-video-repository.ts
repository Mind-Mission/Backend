import { Prisma, Video } from "@prisma/client";
import { IBaseRepository } from "./Base/i-base.repository";

export interface IVideoRepository extends IBaseRepository<Video> {
  findFirst(args: Prisma.VideoFindFirstArgs): Promise<Video | null>;
}