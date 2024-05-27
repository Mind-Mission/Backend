import {Request} from "express";
import { ExtendedUser } from "../../application/interfaces/extended/user.extend";

export interface ExtendedRequest extends Request {
  user?: ExtendedUser
}