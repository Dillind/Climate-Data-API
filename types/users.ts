import { ObjectId } from "mongodb";

export type Role = "student" | "teacher" | "sensor";

export type AllowedRoles = Array<"student" | "teacher" | "sensor">;


export type UserObject = {
  _id?: ObjectId | undefined;
  email: string;
  password: string;
  role: Role;
  authentication_key?: string | null;
  creation_date?: string | Date;
  last_login?: string | Date;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};
