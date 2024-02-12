import { Video } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface IVideoRepository extends IBaseRepository<Video> {
}