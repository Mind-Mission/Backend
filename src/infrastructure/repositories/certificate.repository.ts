import { Certificate } from "@prisma/client";
import { injectable } from "inversify";
import { BaseRepository } from "./Base/base.repository";
import { ICertificateRepository } from "../../application/interfaces/IRepositories/i-certificate.repository";

@injectable()
export class CertificateRepository extends BaseRepository<Certificate> implements ICertificateRepository{
  constructor() {
    super("Certificate");
  }
}