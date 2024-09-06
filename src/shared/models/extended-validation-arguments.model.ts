import { ValidationArguments } from "class-validator";
import { REQUEST_CONTEXT } from "../interceptors/inject-user.interceptor";

export interface ExtendedValidationArguments extends ValidationArguments {
    object: {
      [REQUEST_CONTEXT]: {
        user: any; // IUser is my interface for User class
        dataId: any;
      };
    };
  }