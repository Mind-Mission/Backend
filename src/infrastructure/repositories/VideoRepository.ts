import { Video } from "@prisma/client";
import { injectable } from "inversify";
import { IVideoRepository } from "../../application/interfaces/IRepositories/IVideoRepository";
import { BaseRepository } from "./Base/BaseRepository";

@injectable()
export class VideoRepository extends BaseRepository<Video> implements IVideoRepository {
  constructor() {
    super("Video");
  }
}