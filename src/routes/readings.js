"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const readings_js_1 = require("../controllers/readings.js");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const readingsRouter = (0, express_1.Router)();
/**
 * @openapi
 * /readings:
 *  get:
 *    summary: "Get all weather readings"
 *    tags: [Readings]
 *    security:
 *      - ApiKey: []
 *    responses:
 *      200:
 *        description: "Response object with readings array"
 *        content:
 *          application/json:
 *            schema:
 *              type: 'object'
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: "Successfully retrieved all weather readings"
 *                readings:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/WeatherReading"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      404:
 *        $ref: "#/components/responses/404_NotFound"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
readingsRouter.get("/", (0, auth_js_1.default)(["student, teacher"]), readings_js_1.getAllReadings);
/**
 * @openapi
 * /readings/{id}:
 *  get:
 *    summary: "Get weather reading by ID"
 *    tags: [Readings]
 *    security:
 *      - ApiKey: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Reading ID
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Responses object with a weather reading
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
 *                  example: "Successfully retrieved weather reading by ID"
 *                reading:
 *                  $ref: "#/components/schemas/WeatherReading"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      404:
 *        $ref: "#/components/responses/404_NotFound"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 *
 */
readingsRouter.get("/:id", (0, auth_js_1.default)(["student", "teacher"]), readings_js_1.getReadingsById);
/**
 * @openapi
 * /readings/page/{page}:
 *  get:
 *    summary: Get weather readings by page
 *    tags: [Readings]
 *    security:
 *      - ApiKey: []
 *    parameters:
 *      - name: page
 *        in: path
 *        description: Page number
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Response object with readings array
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
 *                  example: Successfully retrieved paginated readings
 *                readings:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/WeatherReading"
 *      400:
 *        $ref: "#/components/responses/400_InvalidRequest"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
readingsRouter.get("/page/:page", (0, auth_js_1.default)(["student", "teacher"]), readings_js_1.getReadingsByPage);
/**
 * @openapi
 * /readings/maxPrecipitation/{deviceName}:
 *  get:
 *    summary: Get max precipitation reading from station in the last five months
 *    tags: [Readings]
 *    security:
 *      - ApiKey: []
 *    parameters:
 *      - name: deviceName
 *        in: path
 *        description: Device name
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Response object with reading object
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
 *                  example: Successfully retrieved max precipitation reading from station
 *                reading:
 *                  type: object
 *                  properties:
 *                    device_name:
 *                      type: string
 *                      example: "Woodford_Sensor"
 *                    precipitation:
 *                      type: number
 *                      example: "0.086"
 *                    reading_date:
 *                      type: string
 *                      format: date-time
 *                      example: "2023-12-06T15:04:10.000+00:00"
 *      400:
 *        $ref: "#components/responses/400_InvalidRequest"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      404:
 *        $ref: "#/components/responses/404_NotFound"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 *
 */
readingsRouter.get("/maxPrecipitation/:deviceName", (0, auth_js_1.default)(["student", "teacher"]), readings_js_1.getMaxPrecipitationReadingInLastFiveMonths);
/**
 * @openapi
 * /readings/maxTemperature/{startDate}/{endDate}:
 *  get:
 *    summary: Get max temperature for each station between given dates
 *    tags: [Readings]
 *    security:
 *      - ApiKey: []
 *    parameters:
 *      - name: startDate
 *        in: path
 *        description: Start date
 *        required: true
 *        schema:
 *          type: string
 *      - name: endDate
 *        in: path
 *        description: End date
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Response object with reading object
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
 *                  example: Max temperatures between dates retrieved successfully.
 *                readings:
 *                  type: array
 *                  items:
 *                    properties:
 *                      device_name:
 *                        type: string
 *                        example: "Woodford_Sensor"
 *                      max_temperature:
 *                        type: number
 *                        example: 19.98
 *                      date_time:
 *                        type: string
 *                        example: "2023-12-06T15:04:10.000+00:00"
 *      400:
 *        $ref: "#components/responses/400_InvalidRequest"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      404:
 *        $ref: "#/components/responses/404_NotFound"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 *
 */
readingsRouter.get("/maxTemperature/:startDate/:endDate", (0, auth_js_1.default)(["student", "teacher"]), readings_js_1.getMaxTemperatureReadingBetweenDates);
/**
 * @openapi
 * /readings/specificReadings/{deviceName}/{dateTime}:
 *  get:
 *    summary: Get temperature, atmospheric pressure, solar radiation and precipitation recorded by a specific station at a given date and time
 *    tags: [Readings]
 *    security:
 *      - ApiKey: []
 *    parameters:
 *      - name: deviceName
 *        in: path
 *        description: Name of the weather station
 *        required: true
 *        schema:
 *          type: string
 *      - name: dateTime
 *        in: path
 *        description: Date time of the reading
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Response object with reading object
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
 *                  example: Successfully retrieved the readings for station at a given date and time
 *                reading:
 *                  type: object
 *                  properties:
 *                    device_name:
 *                      type: string
 *                      example: "Woodford_Sensor"
 *                    precipitation:
 *                      type: number
 *                      format: double
 *                      example: 0.086
 *                    atmospheric_pressure:
 *                      type: number
 *                      format: double
 *                      example: 128.01
 *                    solar_radiation:
 *                      type: number
 *                      format: double
 *                      example: 531.86
 *                    temp_celsius:
 *                      type: number
 *                      format: double
 *                      example: 23.85
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      404:
 *        $ref: "#/components/responses/404_NotFound"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 *
 */
readingsRouter.get("/specificReadings/:deviceName/:dateTime", (0, auth_js_1.default)(["student", "teacher"]), readings_js_1.getReadingsRecordedBySpecificStationBetweenDates);
/**
 * @openapi
 * /readings:
 *  post:
 *    summary: Add new weather reading
 *    tags: [Readings]
 *    security:
 *      - ApiKey: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/NewWeatherReading"
 *    responses:
 *      200:
 *        description: Create new weather reading
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
 *                  example: Successfully created weather reading
 *                reading:
 *                  $ref: "#/components/schemas/WeatherReading"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      404:
 *        $ref: "#/components/responses/404_NotFound"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
readingsRouter.post("/", (0, auth_js_1.default)(["sensor", "teacher"]), readings_js_1.createReading);
/**
/**
 * @openapi
 * /readings/createManyReadings:
 *  post:
 *    summary: Add a batch of new weather readings
 *    tags: [Readings]
 *    security:
 *      - ApiKey: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: "#/components/schemas/NewWeatherReading"
 *    responses:
 *      200:
 *        description: Create new weather readings
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
 *                  example: Successfully created the weather readings
 *                readings:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/NewWeatherReading"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      404:
 *        $ref: "#/components/responses/404_NotFound"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
readingsRouter.post("/createManyReadings", (0, auth_js_1.default)(["sensor", "teacher"]), readings_js_1.createManyReadings);
/**
 * @openapi
 * /readings/updatePrecipitation/{id}:
 *  patch:
 *    summary: Update precipitation reading
 *    tags: [Readings]
 *    security:
 *      - ApiKey: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the reading to update
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              precipitation:
 *                type: number
 *                format: double
 *                example: 0.086
 *    responses:
 *      200:
 *        description: Response object with a weather reading's updated precipitation value
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
 *                  example: Successfully updated precipitation value
 *                reading:
 *                    $ref: "#/components/schemas/WeatherReading"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      404:
 *        $ref: "#/components/responses/404_NotFound"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 *
 */
readingsRouter.patch("/updatePrecipitation/:id", (0, auth_js_1.default)(["teacher"]), readings_js_1.updatePrecipitationReadingById);
/**
 * @openapi
 * /readings/{id}:
 *  delete:
 *    summary: Deletes a weather reading
 *    tags: [Readings]
 *    security:
 *      - ApiKey: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Weather reading ID
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Reading successfully deleted
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
 *                  example: "The weather reading has been archived and removed successfully"
 *      401:
 *        $ref: "#components/responses/401_Unauthorised"
 *      403:
 *        $ref: "#components/responses/403_ForbiddenRequest"
 *      404:
 *        $ref: "#/components/responses/404_NotFound"
 *      500:
 *        $ref: "#/components/responses/500_DatabaseError"
 */
readingsRouter.delete("/:id", (0, auth_js_1.default)(["teacher"]), readings_js_1.deleteReadingById);
exports.default = readingsRouter;
