import { Certificate } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface ICertificateRepository extends IBaseRepository<Certificate> {}