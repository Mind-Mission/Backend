export interface IFindBaseRepository<T> {
  count(args: any): Promise<number>;
  findMany(args: any): Promise<T[]>;
  findUnique(args: any): Promise<T | null>;
}