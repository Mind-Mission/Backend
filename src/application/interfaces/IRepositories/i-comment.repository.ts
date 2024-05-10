import { Prisma, Comment } from "@prisma/client";
import { IBaseRepository } from "./Base/i-base.repository";

export interface ICommentRepository extends IBaseRepository<Comment> {
  findFirst(args: Prisma.CommentFindFirstArgs): Promise<Comment | null>;
}