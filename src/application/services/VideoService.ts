import { LessonType, Prisma, Video } from "@prisma/client";
import {inject, injectable } from "inversify";
import { IVideoService } from "../interfaces/IServices/IVideoService";
import { ICourseService } from "../interfaces/IServices/ICourseService";
import { ILessonService } from "../interfaces/IServices/ILessonService";
import { IVideoRepository } from "../interfaces/IRepositories/IVideoRepository";
import { CreateVideo, UpdateVideo } from "../inputs/videoInput";
import { TransactionType } from "../types/TransactionType";
import { Transaction } from "../../infrastructure/services/Transaction";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

@injectable()
export class VideoService implements IVideoService {
	constructor(@inject('IVideoRepository') private videoRepository: IVideoRepository, @inject('ICourseService') private courseService: ICourseService, @inject('ILessonService') private lessonService: ILessonService) {}

	private async isLessonAvailable(lessonId: number): Promise<boolean> {
		try {
			const lesson = await this.lessonService.findUnique({
				where: {
					id: lessonId
				},
				select: {
					lessonType: true
				}
			});
	
			if(lesson && lesson.lessonType === 'UNDEFINED') {
				return true
			}
			return false; 
		}catch(error) {
			console.log(error);
			throw error;
		}
	};

	private async updateLessonInfo(lessonId: number, time: number, lessonType?: LessonType, transaction?: TransactionType) {
		await this.lessonService.update({
			data: {
				id: lessonId,
				time,
				lessonType,
			},
			select: {
				id: true
			}
		}, transaction)
	};

	count(args: Prisma.VideoCountArgs): Promise<number> {
		return this.videoRepository.count(args);
	};

	findMany(args: Prisma.VideoFindManyArgs): Promise<Video[]> {
		return this.videoRepository.findMany(args);
	};

	findUnique(args: Prisma.VideoFindUniqueArgs): Promise<Video | null> {
		return this.videoRepository.findUnique(args);
	};

	async create(args: {data: CreateVideo, select?: Prisma.VideoSelect, include?: Prisma.VideoInclude}, transaction?: TransactionType): Promise<Video> {
		const {title, description, url, time, lessonId} = args.data;
		if(!await this.isLessonAvailable(lessonId)) {
			throw new APIError('This lesson is not available', HttpStatusCode.BadRequest);
		}
		return Transaction.transact<Video>(async (prismaTransaction) => {
			await this.updateLessonInfo(lessonId, time, 'VIDEO', prismaTransaction);
			return await this.videoRepository.create({
				data: {
					title,
					description,
					url,
					time,
					lesson: {
						connect: {
							id: lessonId
						},
					}
				},
				select: args.select,
				include: args.include
			}, prismaTransaction);
		}, transaction);
	}

	async update(args: {data: UpdateVideo, select?: Prisma.VideoSelect, include?: Prisma.VideoInclude}, transaction?: TransactionType): Promise<Video> {
		const {id, title, description, url, time} = args.data;
		return Transaction.transact<Video>(async (prismaTransaction) => {
			const updateVideo = await this.videoRepository.update({
				where: {
					id
				},
				data: {
					title: title || undefined,
					description: description || undefined,
					url: url || undefined,
					time,
				},
				select: args.select ? {
					...args.select,
					lessonId: true
				} : undefined,
				include: args.include
			}, prismaTransaction);
			if(time) {
				await this.updateLessonInfo(updateVideo.lessonId, time, undefined, prismaTransaction);
			}
			args.select && !args.select.lessonId && Reflect.deleteProperty(updateVideo, 'lessonId');
			return updateVideo;
		}, transaction);
	}

	delete(id: number, transaction?: TransactionType): Promise<Video> {
		return Transaction.transact<Video>(async (prismaTransaction) => {
			const deletedVideo = await this.videoRepository.delete(id);
			await this.updateLessonInfo(deletedVideo.lessonId, 0, 'UNDEFINED', prismaTransaction);
			return deletedVideo;
		}, transaction);
	};
}