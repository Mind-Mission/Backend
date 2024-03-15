import { ExtendedUser } from "../../types/ExtendedUser";

export interface IResourceOwnership<T> {
  isResourceBelongsToCurrentUser(user: ExtendedUser, ...resourceIds: number[]): Promise<boolean>;
}