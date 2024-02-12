import { Prisma, Note } from "@prisma/client"
import {inject, injectable } from "inversify"
import { INoteService } from "../interfaces/IServices/INoteService"
import { IStudentService } from "../interfaces/IServices/IStudentService"
import { INoteRepository } from "../interfaces/IRepositories/INoteRepository"
import { UpsertNote } from "../inputs/noteInput"
import { TransactionType } from "../types/TransactionType"
import APIError from "../../presentation/errorHandlers/APIError"
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode"

@injectable()
export class NoteService implements INoteService {
	constructor(@inject('INoteRepository') private noteRepository: INoteRepository, @inject('IStudentService') private studentService: IStudentService) {}

  private async getStudentId(userId: number): Promise<number> {
    const student = await this.studentService.findUnique({
      where: {
        userId
      },
      select: {
        id: true
      }
    });
    if(!student) {
      throw new APIError('This student does not exist', HttpStatusCode.BadRequest);
    }
    return student.id;
  }

	count(args: Prisma.NoteCountArgs): Promise<number> {
		return this.noteRepository.count(args);
	};

	findMany(args: Prisma.NoteFindManyArgs): Promise<Note[]> {
		return this.noteRepository.findMany(args);
	};

	findUnique(args: Prisma.NoteFindUniqueArgs): Promise<Note | null> {
		return this.noteRepository.findUnique(args);
	};

	async upsert(args: {data: UpsertNote, select?: Prisma.NoteSelect, include?: Prisma.NoteInclude}, transaction?: TransactionType): Promise<Note> {
    const {time, content, lessonId, userId} = args.data;
    const studentId = await this.getStudentId(userId);
    return this.noteRepository.upsert({
      where: {
        time_lessonId_studentId: {
          studentId,
          lessonId,
          time
        }
      },
      update: {
        content
      },
      create: {
        content,
        time,
        lesson: {
          connect: {
            id: lessonId
          }
        },
        student: {
          connect: {
            id: studentId
          }
        }
      },
      select: args.select,
      include: args.include,
    }, transaction);
  };

	delete(id: number, transaction?: TransactionType): Promise<Note> {
		return this.noteRepository.delete(id, transaction);
	};
}