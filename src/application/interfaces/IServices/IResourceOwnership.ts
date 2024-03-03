import { ExtendedUser } from "../../types/ExtendedUser";

export interface IResourceOwnership<T> {
  isResourceBelongsToCurrentUser(resourceId: number, user: ExtendedUser): Promise<boolean>;
}