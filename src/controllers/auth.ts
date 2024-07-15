import bcrypt from "bcryptjs";
import { v4 as uuid4 } from "uuid";
import * as Users from "../models/user.js";
import { UserObject, type LoginRequestBody } from "../../types/users.js";
import { Request, Response } from "express";

/**
 * Controller for: POST /auth/login
 *
 * @export
 * @async
 * @param {Request} req The Request Object
 * @param {Response} res The Response Object
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    // access request body
    let loginData = req.body as LoginRequestBody | null;

    if (!loginData) {
      return res.status(400).json({
        status: 400,
        message: "Invalid request body",
      });
    }

    const user: UserObject | null = await Users.getByEmail(loginData.email);

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid credentials",
      });
    }

    // Check passwords match
    const passwordMatch = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        status: 401,
        message: "Invalid password",
      });
    }

    const authentication_key = uuid4().toString();

    // Update user record with new API key and last_login timestamp
    user.authentication_key = authentication_key;
    user.last_login = new Date();
    await Users.update(user);

    return res.status(200).json({
      status: 200,
      message: "User logged in",
      authenticationKey: authentication_key,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Login failed",
    });
  }
};

/**
 * Controller for: POST /auth/logout
 * @export
 * @async
 * @param {Request} req The Request Object
 * @param {Response} res The Response Object
 */
export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authenticationKey: string = req.body.authentication_key;

  try {
    const user: UserObject | null = await Users.getByAuthenticationKey(
      authenticationKey
    );

    if (user) {
      user.authentication_key = null;
      await Users.update(user);

      res.status(200).json({
        status: 200,
        message: "User has been logged out.",
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "User was not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to logout user.",
    });
  }
};

/**
 * Controller for: POST /auth/register
 * @export
 * @async
 * @param {Request} req The Request Object
 * @param {Response} res The Response Object
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Get the user data out of the request
  const userData: UserObject = req.body;

  try {
    const userAlreadyExists = await Users.getByEmail(userData.email);

    if (userAlreadyExists) {
      res.status(409).json({
        status: 409,
        message:
          "The provided email address is already associated with another account.",
      });
      return;
    }

    // hash the password
    const hashedPassword = (userData.password = bcrypt.hashSync(
      userData.password
    ));

    // Updates the creation_date field with the date timestamp
    const creationDate = new Date();

    // Convert the user data into an User model object
    const newUser: UserObject = {
      email: userData.email,
      password: hashedPassword,
      role: "student",
      creation_date: creationDate,
    };

    const result = await Users.create(newUser);

    if (result) {
      res.status(200).json({
        status: 200,
        message: "Registration successful.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Registration failed.",
    });
  }
};
