import { Prisma, Comment } from "@prisma/client";
import { CreateComment, UpdateComment } from "../../inputs/commentInput";
import { TransactionType } from "../../types/TransactionType";

export interface ICommentService {
  count(args: Prisma.CommentCountArgs): Promise<number>;
  findMany(args: Prisma.CommentFindManyArgs): Promise<Comment[]>;
  findUnique(args: Prisma.CommentFindUniqueArgs): Promise<Comment | null>
  create(args: {data: CreateComment, select?: Prisma.CommentSelect, include?: Prisma.CommentInclude}, transaction?: TransactionType): Promise<Comment>;
  update(args: {data: UpdateComment, select?: Prisma.CommentSelect, include?: Prisma.CommentInclude}, transaction?: TransactionType): Promise<Comment>;
  delete(id: number, transaction?: TransactionType): Promise<Comment>;
}