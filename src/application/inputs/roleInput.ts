export type CreateRole = {
  name: string;
  description?: string;
  allowedModels: {
    modelName: string;
    permissions: string[];
  }[];
};

export type UpdateRole = {
  id: number;
  name?: string;
  description?: string;
  allowedModels?: {
    modelName: string;
    permissions: string[];
  }[];
}