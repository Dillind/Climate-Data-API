import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.js";

const authRouter = Router();

/**
 * @openapi
 * /auth/login:
 *  post:
 *    summary: 'Attempt email and password based authentication'
 *    tags: [Authentication]
 *    requestBody:
 *      description: 'Attempt user login with email and password'
 *      content:
 *        application/json:
 *          schema:
 *            type: 'object'
 *            properties:
 *              email:
 *                type: 'string'
 *                example: 'dylan@email.com'
 *              password:
 *                type: 'string'
 *                example: 'abc123'
 *    responses:
 *      200:
 *        description: 'Login successful'
 *        content:
 *          application/json:
 *            schema:
 *              type: 'object'
 *              properties:
 *                status:
 *                  type: 'number'
 *                  example: 200
 *                message:
 *                  type: 'string'
 *                  example: "Successfully logged in"
 *                authenticationKey:
 *                  type: 'string'
 *                  example: ""
 *      401:
 *        description: 'Invalid credentials'
 *        content:
 *          application/json:
 *            schema:
 *              type: 'object'
 *              properties:
 *                status:
 *                  type: 'number'
 *                message:
 *                  type: 'string'
 *              example:
 *                status: 401
 *                message: "Invalid credentials"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
authRouter.post("/login", loginUser);

/**
 * @openapi
 * /auth/register:
 *  post:
 *    summary: Register a new user
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: 'test@test.com'
 *              password:
 *                type: string
 *                format: password
 *                example: abc123
 *    responses:
 *      200:
 *        description: User successfully registered
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: "User successfully registered"
 *                user:
 *                  $ref: "#/components/schemas/NewUser"
 *
 *      409:
 *        description: Email address already associated with another account.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 409
 *                message:
 *                  type: string
 *                  example: "Email account already associated with another account."
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
authRouter.post("/register", registerUser);

/**
 * @openapi
 * /auth/logout:
 *  post:
 *    summary: Logs out the current authentication key being used
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              authenticationKey:
 *                type: string
 *    responses:
 *      200:
 *        description: Authentication key successfully logged out
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: "Authentication key successfully logged out."
 *      404:
 *        description: 'Authentication key does not exist'
 *        content:
 *          application/json:
 *            schema:
 *              type: 'object'
 *              properties:
 *                status:
 *                  type: 'number'
 *                message:
 *                  type: 'string'
 *              example:
 *                status: 404
 *                message: "Authentication key does not exist"
 *      500:
 *        description: 'Database error'
 *        content:
 *          application/json:
 *            schema:
 *              type: 'object'
 *              properties:
 *                status:
 *                  type: 'number'
 *                message:
 *                  type: 'string'
 *              example:
 *                status: 500
 *                message: "Error processing request"
 */
authRouter.post("/logout", logoutUser);

export default authRouter;
