import { ExtendedInstructor } from "../../types/ExtendedInstructor";
import { IFindBaseRepository } from "./Base/i-find-base.repository";
import { IUpdateBaseRepository } from "./Base/i-update-base.repository";

export interface IInstructorRepository extends IFindBaseRepository<ExtendedInstructor>, IUpdateBaseRepository<ExtendedInstructor> {
}