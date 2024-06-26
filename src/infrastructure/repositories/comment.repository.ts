import { Prisma, Comment } from "@prisma/client";
import { injectable } from "inversify";
import { ICommentRepository } from "../../application/interfaces/IRepositories/i-comment.repository";
import prisma from "../../domain/db";
import { BaseRepository } from "./Base/base.repository";

@injectable()
export class CommentRepository extends BaseRepository<Comment> implements ICommentRepository {
  constructor() {
    super("Comment");
  }

  findFirst(args: Prisma.CommentFindFirstArgs): Promise<Comment | null> {
    return prisma.comment.findFirst(args);
  };
}