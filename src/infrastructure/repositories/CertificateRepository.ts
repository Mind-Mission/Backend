import { Certificate } from "@prisma/client";
import { injectable } from "inversify";
import { BaseRepository } from "./Base/BaseRepository";
import { ICertificateRepository } from "../../application/interfaces/IRepositories/ICertificateRepository";

@injectable()
export class CertificateRepository extends BaseRepository<Certificate> implements ICertificateRepository{
  constructor() {
    super("Certificate");
  }
}