import { ExtendedInstructor } from "../../types/ExtendedInstructor";
import { IFindBaseRepository } from "./Base/IFindBaseRepository";
import { IUpdateBaseRepository } from "./Base/IUpdateBaseRepository";

export interface IInstructorRepository extends IFindBaseRepository<ExtendedInstructor>, IUpdateBaseRepository<ExtendedInstructor> {
}