export type CreateCertificateTemplate = {
  templateURL: string;
  isDefault?: boolean;
}

export type UpdateCertificateTemplate = {
  id: number;
  templateURL?: string;
  isDefault?: boolean;
}