import { Prisma, Comment } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface ICommentRepository extends IBaseRepository<Comment> {
  findFirst(args: Prisma.CommentFindFirstArgs): Promise<Comment | null>;
}