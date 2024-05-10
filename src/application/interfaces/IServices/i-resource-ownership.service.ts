import { ExtendedUser } from "../extended/user.extend";

export interface IResourceOwnershipService<T> {
  isResourceBelongsToCurrentUser(user: ExtendedUser, ...resourceIds: number[]): Promise<boolean>;
}