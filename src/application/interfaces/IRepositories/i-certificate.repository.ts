import { Certificate } from "@prisma/client";
import { IBaseRepository } from "./Base/i-base.repository";

export interface ICertificateRepository extends IBaseRepository<Certificate> {}