import { Prisma, Comment } from "@prisma/client"
import { inject, injectable } from "inversify"
import { ICommentRepository } from "../interfaces/IRepositories/ICommentRepository"
import { ICommentService } from "../interfaces/IServices/ICommentService"
import { CreateComment, UpdateComment } from "../inputs/commentInput"
import { TransactionType } from "../types/TransactionType"

@injectable()
export class CommentService implements ICommentService {
	constructor(@inject('ICommentRepository') private commentRepository: ICommentRepository) {}

	count(args: Prisma.CommentCountArgs): Promise<number> {
		return this.commentRepository.count(args);
	};

	findMany(args: Prisma.CommentFindManyArgs): Promise<Comment[]> {
		return this.commentRepository.findMany(args);
	};

	findUnique(args: Prisma.CommentFindUniqueArgs): Promise<Comment | null> {
		return this.commentRepository.findUnique(args);
	};

  create(args: {data: CreateComment, select?: Prisma.CommentSelect, include?: Prisma.CommentInclude}, transaction?: TransactionType): Promise<Comment> {
		const {content, lessonId, parentId, userId} = args.data;	
		return this.commentRepository.create({
			data: {
				content,
				lesson: {
					connect: {
						id: lessonId,
					}
				},
				parent: parentId ? {
					connect: {
						id: parentId
					}
				} : undefined,
				user: {
					connect: {
						id: userId
					}
				}
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	update(args: {data: UpdateComment, select?: Prisma.CommentSelect, include?: Prisma.CommentInclude}, transaction?: TransactionType): Promise<Comment> {
		const {id, content} = args.data;
		return this.commentRepository.update({
			where: {
				id
			},
			data: {
				content: content || undefined
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<Comment> {
		return this.commentRepository.delete(id, transaction);
	};
}