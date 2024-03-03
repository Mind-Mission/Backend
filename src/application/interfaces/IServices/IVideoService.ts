import { Prisma, Video } from "@prisma/client";
import { CreateVideo, UpdateVideo } from "../../inputs/videoInput";
import { TransactionType } from "../../types/TransactionType";

export interface IVideoService {
  count(args: Prisma.VideoCountArgs): Promise<number>;
  findMany(args: Prisma.VideoFindManyArgs): Promise<Video[]>;
  findUnique(args: Prisma.VideoFindUniqueArgs): Promise<Video | null>
  create(args: {data: CreateVideo, select?: Prisma.VideoSelect, include?: Prisma.VideoInclude}, transaction?: TransactionType): Promise<Video>;
  update(args: {data: UpdateVideo, select?: Prisma.VideoSelect, include?: Prisma.VideoInclude}, transaction?: TransactionType): Promise<Video>;
  delete(id: number, transaction?: TransactionType): Promise<Video>;
}