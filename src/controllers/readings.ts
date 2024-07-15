import { Request, Response } from "express";
import * as Readings from "../models/reading.js";
import { WeatherReadingObject } from "../../types/readings.js";
import { Double } from "mongodb";

/**
 * Controller for: GET /readings
 * @export
 * @async
 * @param {Request} req - Request
 * @param {Response} res - Response
 */
export const getAllReadings = async (req: Request, res: Response) => {
  const readings = await Readings.getAll();

  if (!readings) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve weather readings",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all weather readings",
      readings,
    });
  }
};

/**
 * Controller for: GET /readings/:id
 * @export
 * @async
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @returns {Promise<void>}
 */
export const getReadingsById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const readingID = req.params.id;

  Readings.getById(readingID)
    .then((reading) => {
      if (!reading) {
        res.status(404).json({
          status: 404,
          message: "Weather reading could not be found",
        });
      } else {
        res.status(200).json({
          status: 200,
          message: "Successfully retrieved weather reading by ID",
          reading,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve weather reading by ID",
      });
    });
};

/**
 * Controller for GET /readings/page/:page
 * @export
 * @async
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @returns {Promise<void>} - A promise for the array of readings on the specified page
 *
 */
export const getReadingsByPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const pageSize = 5;
  const page = parseInt(req.params.page);

  try {
    if (page >= 1) {
      const readings = await Readings.getByPage(page, pageSize);
      res.status(200).json({
        status: 200,
        message: `Successfully retrieved paginated readings`,
        readings,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Bad request: Invalid parameter used",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve paginated readings",
    });
  }
};

/**
 * Controller for: GET /readings/maxPrecipitation/:deviceName
 *
 * @export
 * @async
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @returns {Promise<void>} - A promise for the array of readings
 */

export const getMaxPrecipitationReadingInLastFiveMonths = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { deviceName } = req.params;

  const readings = await Readings.getMaxPrecipitationInLastFiveMonths(
    deviceName
  );

  const allowedDeviceNames = [
    "Woodford_Sensor",
    "Noosa_Sensor",
    "Yandina_Sensor",
  ];
  if (!allowedDeviceNames.includes(deviceName)) {
    res.status(400).json({
      status: 400,
      message: `Invalid device name. Allowed values are: ${allowedDeviceNames.map(
        (device) => device
      )}`,
    });
  }

  if (!readings) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve max precipitation in the last five months",
    });
  } else {
    res.status(200).json({
      status: 200,
      message:
        "Successfully retrieved the max precipitation in the last five months",
      readings,
    });
  }
};

/**
 * Controller for: GET /readings/maxTemperature/:startDate/:endDate
 * @export
 * @async
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @returns {Promise<void>} - A promise for the reading object
 */

export const getMaxTemperatureReadingBetweenDates = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { startDate, endDate } = req.params;

  const maxTemperatures = await Readings.getMaxTemperatureBetweenDates(
    startDate,
    endDate
  );

  if (maxTemperatures.length === 0) {
    res.status(404).json({
      status: 404,
      message: "No max temperatures found for the specified date range.",
    });
  }

  res.status(200).json({
    status: 200,
    message: "Max temperatures between dates retrieved successfully.",
    maxTemperatures,
  });
};

/**
 * Controller for: GET /readings/specificReadings/:deviceName/:dateTime
 * @export
 * @async
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @returns {Promise<Object[]>} - A promise for the array of readings
 */
export const getReadingsRecordedBySpecificStationBetweenDates = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { deviceName, dateTime } = req.params;

  const readings = await Readings.getReadingsBetweenDates(deviceName, dateTime);

  if (!readings) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve readings for the specified station",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved the readings for the specified station",
      readings,
    });
  }
};

/**
 * Controller for: POST /readings
 * @export
 * @async
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @returns {Promise<Object>} - A promise for the reading object
 */
export const createReading = async (
  req: Request,
  res: Response
): Promise<void> => {
  // 1. Get the reading data from the request body
  const readingData: WeatherReadingObject = req.body;
  // 2. Construct a reading model objects
  const reading: WeatherReadingObject = {
    device_name: readingData.device_name,
    precipitation: readingData.precipitation,
    atmospheric_pressure: readingData.atmospheric_pressure,
    date_time: new Date(),
    humidity: readingData.humidity,
    latitude: readingData.latitude,
    longitude: readingData.longitude,
    max_wind_speed: readingData.max_wind_speed,
    solar_radiation: readingData.solar_radiation,
    temp_celsius: readingData.temp_celsius,
    vapor_pressure: readingData.vapor_pressure,
    wind_direction: readingData.wind_direction,
  };

  // 3. Run the create reading model function
  Readings.create(reading)
    .then((reading) => {
      if (!reading) {
        res.status(404).json({
          status: 404,
          message: "Weather reading could not be created",
        });
      } else {
        res.status(200).json({
          status: 200,
          message: "Successfully created weather reading.",
          reading,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to create weather reading",
      });
    });
};

/**
 * Controller for: POST /readings/createManyReadings
 *
 * @export
 * @async
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @returns {Promise<void>} - A promise for the array of readings
 */
export const createManyReadings = async (
  req: Request,
  res: Response
): Promise<void> => {
  const readingsData: WeatherReadingObject[] = req.body;

  const readings = readingsData.map((readingData) => ({
    device_name: readingData.device_name,
    precipitation: readingData.precipitation,
    atmospheric_pressure: readingData.atmospheric_pressure,
    date_time: new Date(),
    humidity: readingData.humidity,
    latitude: readingData.latitude,
    longitude: readingData.longitude,
    max_wind_speed: readingData.max_wind_speed,
    solar_radiation: readingData.solar_radiation,
    temp_celsius: readingData.temp_celsius,
    vapor_pressure: readingData.vapor_pressure,
    wind_direction: readingData.wind_direction,
  }));

  try {
    const createdReadings = await Readings.createMany(readings);

    if (!createdReadings) {
      res.status(404).json({
        status: 404,
        message: "Weather readings could not be created",
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Successfully created weather readings.",
      readings: createdReadings.ops,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to create weather readings",
    });
  }
};

/**
 * Controller for PATCH /readings/:id
 *
 * @export
 * @async
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @returns {Promise<void>} - The result of the update operation
 */
export const updatePrecipitationReadingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const readingId = req.params.id;
  const newPrecipitation: Double = req.body.precipitation;

  try {
    const result = await Readings.updatePrecipitationById(
      readingId,
      newPrecipitation
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({
        status: 200,
        message: `Successfully updated precipitation value`,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "No reading found with the specified ID.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to update precipitation value.",
    });
  }
};

/**
 * Controller for: DELETE /readings/:id
 *
 * @export
 * @async
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @returns {Promise<void>} - The result of the delete operation
 */
export const deleteReadingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const readingId = req.params.id;

  try {
    const readingToDelete = await Readings.getById(readingId);
    // Handle error if user ID provided doesn't exist
    if (!readingToDelete) {
      res.status(404).json({
        status: 404,
        message: "Weather reading was not found with that ID",
      });
    }

    const deletionResult = await Readings.deleteById(readingId);

    if (deletionResult.deletedCount > 0) {
      res.status(200).json({
        status: 200,
        message: "Successfully archived and removed the weather reading",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to delete the weather reading",
    });
  }
};
