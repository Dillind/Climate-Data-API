"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_js_1 = require("../controllers/users.js");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const userRouter = (0, express_1.Router)();
/**
 * @openapi
 * /users:
 *  get:
 *    summary: "Get all users"
 *    tags: [Users]
 *    security:
 *      - ApiKey: []
 *    responses:
 *      200:
 *        description: "Response object with users array"
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
 *                  example: "Successfully retrieved all users"
 *                users:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/User"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      404:
 *        $ref: "#/components/responses/404_NotFound"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
userRouter.get("/", (0, auth_js_1.default)(["teacher"]), users_js_1.getAllUsers);
/**
 * @openapi
 * /users/{id}:
 *  get:
 *      summary: 'Get user by ID'
 *      tags: [Users]
 *      security:
 *      - ApiKey: []
 *      parameters:
 *        - name: id
 *          in: 'path'
 *          description: 'User ID'
 *          required: true
 *          schema:
 *            type: 'string'
 *      responses:
 *          200:
 *            description: "Response object with users array"
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: integer
 *                      example: 200
 *                    message:
 *                      type: string
 *                      example: "Successfully retrieved user"
 *                    user:
 *                      $ref: "#/components/schemas/User"
 *          400:
 *            $ref: "#/components/responses/400_InvalidRequest"
 *          401:
 *            $ref: "#components/responses/401_Unauthorised"
 *          403:
 *            $ref: "#components/responses/403_ForbiddenRequest"
 *          500:
 *            $ref: "#/components/responses/500_DatabaseError"
 */
userRouter.get("/:id", (0, auth_js_1.default)(["teacher"]), users_js_1.getUserById);
/**
 * @openapi
 * /users/key/{authenticationKey}:
 *  get:
 *    summary: Get user by authentication key
 *    tags: [Users]
 *    security:
 *      - ApiKey: []
 *    parameters:
 *      - name: authenticationKey
 *        in: path
 *        description: User authentication key
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: "Response object with users array"
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
 *                  example: "Successfully retrieved user by authentication key"
 *                user:
 *                  $ref: "#/components/schemas/User"
 *      400:
 *        $ref: "#/components/responses/400_InvalidRequest"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
userRouter.get("/key/:authenticationKey", (0, auth_js_1.default)(["teacher"]), users_js_1.getUserByAuthenticationKey);
/**
 * @openapi
 * /users:
 *  post:
 *    summary: Create a new user
 *    tags: [Users]
 *    security:
 *      - ApiKey: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: 'object'
 *            properties:
 *              email:
 *                type: 'string'
 *                example: test@email.com
 *              password:
 *                type: 'string'
 *                example: abc123
 *              role:
 *                type: string
 *                enum:
 *                  - student
 *                  - sensor
 *                  - teacher
 *    responses:
 *      200:
 *        description: "Response object with users array"
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
 *                  example: "User create successfully"
 *                user:
 *                    $ref: "#/components/schemas/User"
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
 *      409:
 *        description: "Email address is already associated with another account."
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
 *                  example: "Email account is already associated with another account"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
userRouter.post("/", (0, auth_js_1.default)(["teacher"]), users_js_1.createUser);
/**
 * @openapi
 * /users/{id}:
 *  put:
 *    summary: Update a user
 *    tags: [Users]
 *    security:
 *      - ApiKey: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Id of the user to Update
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Update the user object
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: updatedUser@email.com
 *              password:
 *                type: string
 *                format: password
 *                example: abc123
 *              role:
 *                type: string
 *                enum:
 *                  - student
 *                  - sensor
 *                  - teacher
 *              authentication_key:
 *                type: string
 *                nullable: true
 *                example: null
 *              creation_date:
 *                type: string
 *                nullable: true
 *                example: null
 *              last_login:
 *                type: string
 *                format: date-time
 *                nullable: true
 *                example: null
 *    responses:
 *      200:
 *        description: "Response users object"
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
 *                  example: "User updated successfully"
 *                user:
 *                    $ref: "#/components/schemas/NewUser"
 *      400:
 *        $ref: "#/components/responses/400_InvalidRequest"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
userRouter.put("/:id", (0, auth_js_1.default)(["teacher"]), users_js_1.updateUserById);
/**
 * @openapi
 * /users/updateUserRoles:
 *  patch:
 *    summary: Update all users' roles between two creation dates
 *    tags: [Users]
 *    security:
 *      - ApiKey: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              start_date:
 *                type: string
 *                example: "2024-03-08T06:11:07.813+00:00"
 *              end_date:
 *                type: string
 *                example: "2024-03-12T04:11:07.813+00:00"
 *              new_role:
 *                type: string
 *                enum:
 *                  - student
 *                  - sensor
 *                  - teacher
 *    responses:
 *      200:
 *        description: "Response users object"
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
 *                  example: "Updated the users' roles successfully."
 *      400:
 *        $ref: "#/components/responses/400_InvalidRequest"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 *
 */
userRouter.patch("/updateUserRoles", (0, auth_js_1.default)(["teacher"]), users_js_1.updateUserRoleBetweenTwoCreationDates);
/**
 * @openapi
 * /users/{id}:
 *  delete:
 *      summary: Delete a user
 *      tags: [Users]
 *      security:
 *        - ApiKey: []
 *      parameters:
 *          - name: id
 *            in: 'path'
 *            description: 'User ID'
 *            required: true
 *            schema:
 *               type: 'string'
 *      responses:
 *          200:
 *              description: User was successfully deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 200
 *                              message:
 *                                  type: string
 *                                  example: "User successfully deleted"
 *          401:
 *            $ref: "#components/responses/401_Unauthorised"
 *          403:
 *            $ref: "#components/responses/403_ForbiddenRequest"
 *          404:
 *            $ref: "#components/responses/404_NotFound"
 *          500:
 *            $ref: "#/components/responses/500_DatabaseError"
 */
userRouter.delete("/:id", (0, auth_js_1.default)(["teacher"]), users_js_1.deleteUserById);
/**
 * @openapi
 * /users/delete/students:
 *  delete:
 *    summary: Delete students between two last login dates
 *    tags: [Users]
 *    security:
 *      - ApiKey: []
 *    requestBody:
 *      description: Delete the user objects
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              start_date:
 *                type: "string"
 *                example: "2024-03-11T03:12:28.560+00:00"
 *              end_date:
 *                type: "string"
 *                example: "2024-03-12T03:14:28.560+00:00"
 *    responses:
 *      200:
 *        description: Response users object
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
 *                  example: "Student user roles successfully deleted between the specified dates"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      404:
 *        $ref: "#components/responses/404_NotFound"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
userRouter.delete("/delete/students", (0, auth_js_1.default)(["teacher"]), users_js_1.deleteStudentsBetweenTwoLastLoginDates);
exports.default = userRouter;
