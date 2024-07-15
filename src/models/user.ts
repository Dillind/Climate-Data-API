import { InsertOneResult, ObjectId, UpdateResult, DeleteResult } from "mongodb";
import { db } from "../database.js";
import { Role, UserObject } from "../../types/users.js";

/**
 * Create a new user model object
 *
 * @param {UserObject} user - the user object
 * * @returns {Object} - The user model object
 */
export function User(user: UserObject): object {
  const {
    _id,
    email,
    password,
    role,
    authentication_key,
    creation_date,
    last_login,
  } = user;
  return {
    _id: new ObjectId(_id),
    email,
    password,
    role,
    authentication_key,
    creation_date,
    last_login,
  };
}

/**
 * Get all users
 *
 * @exportm
 * @async
 * @returns {Promise<UserObject[]>}
 */
export const getAll = async (): Promise<UserObject[]> => {
  const users = await db.collection("users").find().toArray();
  return users as unknown as UserObject[];
};

/**
 * Get a specific user by their ObjectId
 *
 * @export
 * @async
 * @param {string | ObjectId} id - mongoDB ObjectId of the user to get
 * @returns {Promise<UserObject | null>} - A promise for the matching user
 */
export const getById = async (
  id: string | ObjectId
): Promise<UserObject | null> => {
  try {
    // check to see if the id is an ObjectId
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    let user = await db.collection("users").findOne({ _id: objectId });

    return user as UserObject | null;
  } catch (error) {
    return Promise.reject(`user not found with id: ${id}`);
  }
};

/**
 * Get a specific user by their email address
 *
 * @export
 * @async
 * @param {ObjectId} email - email address of the user
 * @returns {Promise<UserObject | null>} - A promise for the matching user
 *
 */
export const getByEmail = async (email: string): Promise<UserObject | null> => {
  try {
    // attempt to find the first matching user by email
    let user = await db.collection("users").findOne({ email: email });
    return user as UserObject | null;
  } catch (error) {
    return Promise.reject(`user not found with email: ${email}`);
  }
};

/**
 * Get a specific user by their authentication key
 *
 * @export
 * @async
 * @param {ObjectId} key - authentication key
 * @returns {Promise<UserObject | null>} - A promise for the matching user
 *
 */
export const getByAuthenticationKey = async (
  key: string
): Promise<UserObject | null> => {
  // attempt to find the first matching user by authentication key
  let user = await db.collection("users").findOne({ authentication_key: key });

  return user as UserObject | null;
};

/**
 * Insert the provided user in the database
 *
 * @export
 * @async
 * @param {Object} user - the user to be inserted
 * @returns {Promise<InsertOneResult>} - the result of the insert operation
 *
 */
export const create = async (user: UserObject): Promise<InsertOneResult> => {
  // Clear _id from user to ensure the new user does not
  // have an existing _id from the database, as we want a new _id
  // to be created and added to the user object.
  delete user._id;

  // Insert the user document and implicitly add the new _id to user
  return db.collection("users").insertOne(user);
};

/**
 * Update the user in the database
 *
 * @export
 * @async
 * @param {UserObject | null} user - The user object to update
 * @returns {Promise<UpdateResult<Document>>} - The result of the update operation
 */
export const update = async (
  user: UserObject | null
): Promise<UpdateResult<Document>> => {
  if (!user) {
    throw new Error("USer object is null");
  }
  const userWithoutId = { ...user };
  delete userWithoutId._id;

  return db
    .collection("users")
    .replaceOne(
      { _id: new ObjectId(user._id) },
      userWithoutId
    ) as unknown as UpdateResult<Document>;
};

/**
 * Update the provided user in the database
 *
 * @export
 * @async
 * @param {Object} user - user to update
 * @param {Object} id - id of the user to update
 * @returns  {Promise<UpdateResult<Document>>} - the result of the update operation
 *
 */
export const updateUser = async (
  id: ObjectId,
  user: UserObject
): Promise<UpdateResult<Document>> => {
  // update the user by replacing the user by id

  // copy user and delete ID from it
  const userWithoutId = { ...user };
  delete userWithoutId._id;

  return db
    .collection("users")
    .replaceOne(
      { _id: new ObjectId(id) },
      userWithoutId
    ) as unknown as UpdateResult<Document>;
};

/**
 *
 * Update all users to a different role between two given dates
 * @param { String } start_date - the start date
 * @param { String } end_date - the end date
 * @param { Role } new_role - the new role to update to
 * @returns {Promise<UpdateManyModel>} - the result of the update many operation
 */
export const updateUserRole = async (
  start_date: string,
  end_date: string,
  new_role: Role
) => {
  return db.collection("users").updateMany(
    {
      role: { $in: ["student", "teacher", "sensor"] },
      creation_date: {
        $gte: new Date(start_date),
        $lte: new Date(end_date),
      },
    },
    { $set: { role: new_role } }
  );
};

/**
 * Delete a specific user by their id
 *
 * @export
 * @async
 * @param {ObjectId} id - mongoDB ObjectId of the user to delete
 * @returns {Promise<DeleteResult>} - The result of the delete operation
 *
 */
export const deleteById = async (id: string): Promise<DeleteResult> => {
  return db.collection("users").deleteOne({ _id: new ObjectId(id) });
};

/**
 * @export
 * @async
 * @param {String} start_date
 * @param {String} end_date
 * @returns {Promise<DeleteResult>} - The result of the delete operation
 */
export const deleteStudents = async (
  start_date: string,
  end_date: string
): Promise<DeleteResult> => {
  return db.collection("users").deleteMany({
    role: { $in: ["student", ""] },
    last_login: {
      $gte: new Date(start_date),
      $lte: new Date(end_date),
    },
  });
};

/**
 * @export
 * @async
 * @param {UserObject} user
 * @returns {Promise<InsertOneResult>}
 */
export const archiveUserInChangelog = async (
  user: UserObject
): Promise<InsertOneResult> => {
  const deletionEntry = {
    deleted_user_details: user,
    deletion_date_time: new Date(),
  };

  return db.collection("changelog").insertOne(deletionEntry);
};
