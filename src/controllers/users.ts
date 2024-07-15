import { Request, Response } from "express";
import { Role, UserObject } from "../../types/users.js";
import * as Users from "../models/user.js";
import bcrypt from "bcryptjs";
import { DeleteManyModel, InsertOneModel, ObjectId } from "mongodb";

/**
 * Controller for: GET /users
 *
 * @export
 * @async
 * @param {Response} res - Response
 * @param {Request} req - Request
 * @returns {Promise<void>} - A promise for the array of users
 *
 */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const users = await Users.getAll();

  if (!users) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve all users",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all users",
      users,
    });
  }
};

/**
 * Controller for: GET /users/:id
 * @export
 * @async
 * @param {Response} res - Response
 * @param {Request} req - Request
 * @returns {Promise<Object>} - A promise for the user object
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).json({
      status: 400,
      message: "Bad request: User ID parameter required",
    });
  }

  Users.getById(userId)
    .then((foundUser) => {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved user",
        user: foundUser,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve user",
        error,
      });
    });
};

/**
// Controller for: GET /users/key/:authenticationKey
 * 
 * @export
 * @async
 * @param {Response} res - Response
 * @param {Request} req - Request
 * @returns {Promise<Object>} - A promise for the user object
 */
export const getUserByAuthenticationKey = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authenticationKey = req.params.authenticationKey;
  Users.getByAuthenticationKey(authenticationKey)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved user by authentication key",
        user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve user by authentication key",
      });
    });
};

/**
// Controller for: POST /users
 * 
 * @export
 * @async
 * @param {Response} res - Response
 * @param {Request} req - Request
 * @returns {Promise<void>} - The result of the insert
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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
        message: "User created successfully.",
        result,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to create user.",
    });
  }
};

/**
 * Controller for: PUT /users/:id
 * @export
 * @async
 * @param {Response} res - Response
 * @param {Request} req - Request
 * @returns {Promise<void>} - The result of the update
 */
export const updateUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userData: UserObject = req.body;
  const userId = req.params.id;

  // hash the password if it isn't already hashed
  if (userData.password && !userData.password.startsWith("$2a")) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId;
  // Use the update model function to update this user in the DB
  Users.updateUser(objectId, userData)
    .then((user) => {
      if (user.matchedCount === 0) {
        res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Successfully updated the entire user",
        user,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to update the entire user",
      });
    });
};

/**
 * Controller for: PATCH /users/updateStudentRoles
 *
 * @param {Response} res - Response
 * @param {Request} req - Request
 * @returns {Promise<void>} - The result of the update
 */
export const updateUserRoleBetweenTwoCreationDates = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    start_date,
    end_date,
    new_role,
  }: { start_date: string; end_date: string; new_role: Role } = req.body;

  const updateResult = await Users.updateUserRole(
    start_date,
    end_date,
    new_role
  );

  if (updateResult.modifiedCount > 0) {
    res.status(200).json({
      status: 200,
      message: "Updated student roles successfully.",
      updateResult,
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "No users found within the specified date range",
    });
  }
};

/**
 * Controller for: DELETE /users/:id
 * @export
 * @async
 * @param {Response} res - Response
 * @param {Request} req - Request
 * @returns {Promise<void>} - The result of the deletion
 */
export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;

  try {
    // Fetch the user details
    const userToDelete: UserObject | null = await Users.getById(userId);

    if (!userToDelete) {
      res.status(404).json({
        status: 404,
        message: "No user found with that ID",
      });
      return;
    }

    // Archive the user in the changelog collection before deletion
    await Users.archiveUserInChangelog(userToDelete);

    // Delete the user from the users collection
    const deletionResult = await Users.deleteById(userId);

    if (deletionResult.deletedCount > 0) {
      res.status(200).json({
        status: 200,
        message: "The user has been removed successfully.",
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "User not found with that ID",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to delete the user",
    });
  }
};

/**
 * Controller for: DELETE /users/delete/students
 * @export
 * @async
 * @param {Response} res - Response
 * @param {Request} req - Request
 * @returns {Promise<void>} - The result of the deletion
 */
export const deleteStudentsBetweenTwoLastLoginDates = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { start_date, end_date }: { start_date: string; end_date: string } =
    req.body;

  const result = await Users.deleteStudents(start_date, end_date);

  if (result.deletedCount > 0) {
    res.status(200).json({
      status: 200,
      message: "The users have been removed successfully.",
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "Users with the student role not found between the given dates",
    });
  }
};
