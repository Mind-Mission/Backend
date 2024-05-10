import { Prisma, Video } from "@prisma/client";
import { injectable } from "inversify";
import { IVideoRepository } from "../../application/interfaces/IRepositories/i-video-repository";
import { BaseRepository } from "./Base/base.repository";
import prisma from "../../domain/db";

@injectable()
export class VideoRepository extends BaseRepository<Video> implements IVideoRepository {
  constructor() {
    super("Video");
  }
  findFirst(args: Prisma.VideoFindFirstArgs): Promise<Video | null> {
    return prisma.video.findFirst(args);
  }
}