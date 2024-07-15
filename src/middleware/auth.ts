import { NextFunction, Request, Response } from "express";
import * as user from "../models/user.js";

import { type AllowedRoles } from "../../types/users.js";

export default function auth(allowed_roles: AllowedRoles) {
  return function (req: Request, res: Response, next: NextFunction) {
    const authenticationKey = req.get("X-AUTH-KEY");
    if (authenticationKey) {
      user
        .getByAuthenticationKey(authenticationKey)
        .then((user) => {
          if (user && allowed_roles.includes(user.role)) {
            console.log("User role is allowed. Proceeding to next middleware.");
            next();
          } else {
            console.log("Access forbidden for user role:", user?.role);
            res.status(403).json({
              status: 403,
              message: "Access forbidden",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching user by authentication key:", error);
          res.status(401).json({
            status: 401,
            message: "Authentication key invalid",
          });
        });
    } else {
      res.status(401).json({
        status: 401,
        message: "Authentication key missing",
      });
    }
  };
}
