import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { ICourseService } from "../../application/interfaces/IServices/i-course.service";
import { IRatingService } from "../../application/interfaces/IServices/i-rating.service";
import { IInstructorService } from "../../application/interfaces/IServices/i-instructor.service";
import { IEnrollmentService } from "../../application/interfaces/IServices/i-enrollment.service";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class StatisticsController {
	constructor(@inject('ICourseService') private courseService: ICourseService, @inject("IRatingService") private ratingService: IRatingService, @inject("IInstructorService") private instructorService: IInstructorService, @inject("IEnrollmentService") private enrollmentService: IEnrollmentService) {}

  private async getAvailableCoursesCount(): Promise<Number> {
    return this.courseService.count({
      where: {
        sections: {
          some: {
            isDraft: false,
            lessons: {
              some: {
                isDraft: false,
                isApproved: true
              }
            }
          }
        },
        isDraft: {
          equals: false
        },
      }
    });
  };

  private async getSuccessfulLearnsCount(): Promise<Number> {
    return this.enrollmentService.count({
      where: {
        progress: {
          equals: 100
        }
      }
    });
  };

  private async getRatingAvgForAllCourses(): Promise<number> {
    const aggregateResult = await this.ratingService.aggregate({
      _avg: {
        courseRate: true
      },
    });
    return aggregateResult._avg?.courseRate || 0;
  };

  private async getFiveStarInstructorsCount(): Promise<number> {
    return this.instructorService.count({
      where: {
        ratings: {
          every: {
            instructorRate: {
              gte: 4.5
            }
          }
        }
      },
    });
  };

  getMainStatistics = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    const promiseResult = await Promise.all([
      this.getAvailableCoursesCount(),
      this.getSuccessfulLearnsCount(),
      this.getFiveStarInstructorsCount(),
      this.getRatingAvgForAllCourses(),
    ]);
    const [availableCoursesCount, successfulLearnsCount, fiveStarInstructorsCount, ratingAvgForAllCourses] = promiseResult;
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All statistics are retrieved successfully', [
      {
        availableCoursesCount,
        successfulLearnsCount,
        fiveStarInstructorsCount,
        ratingAvgForAllCourses
      }
    ]));
	});
}