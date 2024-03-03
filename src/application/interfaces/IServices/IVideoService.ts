import { Prisma, Section, Video } from "@prisma/client";
import { CreateVideo, UpdateVideo } from "../../inputs/videoInput";
import { TransactionType } from "../../types/TransactionType";
import { IResourceOwnership } from "./IResourceOwnership";
import { ExtendedUser } from "../../types/ExtendedUser";

export interface IVideoService extends IResourceOwnership<Section> {
  count(args: Prisma.VideoCountArgs): Promise<number>;
  findMany(args: Prisma.VideoFindManyArgs): Promise<Video[]>;
  findUnique(args: Prisma.VideoFindUniqueArgs): Promise<Video | null>
  create(args: {data: CreateVideo, select?: Prisma.VideoSelect, include?: Prisma.VideoInclude}, transaction?: TransactionType): Promise<Video>;
  update(args: {data: UpdateVideo, select?: Prisma.VideoSelect, include?: Prisma.VideoInclude}, transaction?: TransactionType): Promise<Video>;
  delete(args: {id: number, user: ExtendedUser}, transaction?: TransactionType): Promise<Video>;
}