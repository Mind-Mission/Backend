import {ExtendedUser} from "../../application/interfaces/extended/user.extend";

export abstract class UserMapper {
  static map(users: ExtendedUser[]) {
    return users.map(({password, passwordUpdatedTime, resetPasswordCode, ...rest}) => rest)
  };
}