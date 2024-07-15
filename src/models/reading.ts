import { Double, InsertOneResult, ObjectId } from "mongodb";

import { db } from "../database.js";

import { WeatherReadingObject } from "../../types/readings.js";

/**
 * Creates a new weather reading model object
 *
 * @param {WeatherReadingObject} reading - The weather reading object
 * @returns {Object} - The reading model object
 */
export function Reading(reading: WeatherReadingObject): WeatherReadingObject {
  const {
    _id,
    device_name,
    precipitation,
    atmospheric_pressure,
    date_time,
    humidity,
    latitude,
    longitude,
    max_wind_speed,
    solar_radiation,
    temp_celsius,
    vapor_pressure,
    wind_direction,
  } = reading;

  const toDouble = (value: number | Double): Double => {
    if (value instanceof Double) {
      return value;
    } else {
      return new Double(value);
    }
  };
  return {
    _id,
    device_name,
    precipitation: toDouble(precipitation),
    atmospheric_pressure: toDouble(atmospheric_pressure),
    date_time: new Date(date_time),
    humidity: toDouble(humidity),
    latitude: toDouble(latitude),
    longitude: toDouble(longitude),
    max_wind_speed: toDouble(max_wind_speed),
    solar_radiation: toDouble(solar_radiation),
    temp_celsius: toDouble(temp_celsius),
    vapor_pressure: toDouble(vapor_pressure),
    wind_direction: toDouble(wind_direction),
  };
}

/**
 * Get all weather readings
 *
 * @export
 * @async
 * @returns {Promise<Object[]>} - A promise for the array of all reading objects
 */
export const getAll = async (): Promise<object[]> => {
  return db.collection("readings").find().toArray();
};

/**
 * Get a specific weather reading by its ObjectId
 * @export
 * @async
 * @param {ObjectId} id - mongoDb ObjectId of the reading to get
 * @returns {Promise<Reading[]>} - A promise for the matching reading
 */
export const getById = async (id: string) => {
  // find the first matching reading by id
  let reading = await db
    .collection("readings")
    .findOne({ _id: new ObjectId(id) });

  // check if a reading was found and handle the result
  if (reading) {
    return reading;
  } else {
    return Promise.reject(`reading not found with id: ${id}`);
  }
};

/**
 * Get paginated readings
 * @export
 * @async
 * @param {Number} page - the page number (1 indexed)
 * @param {Number} size - the number of documents or records per page
 * @returns {Promise<Object[]>} - A promise for the array of readings on the specified Page
 */
export const getByPage = async (
  page: number,
  size: number
): Promise<object[]> => {
  // Calculate the page offset
  const offset = (page - 1) * size;

  return db.collection("readings").find().skip(offset).limit(size).toArray();
};

/**
 * Get max precipitation reading in last five months for sensor
 *
 * @export
 * @async
 * @param {String} device_name - the name of the weather sensor
 * @returns {Promise<Object[]>} - A promise for the array of readings for a weather station
 */
export const getMaxPrecipitationInLastFiveMonths = async (
  device_name: string
): Promise<object[]> => {
  const current_date = new Date();

  // Calculate the date from five months ago
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(current_date.getMonth() - 5);

  const result = await db
    .collection("readings")
    .find(
      {
        device_name: device_name,
        // find all precipitation values that are not equal to null
        precipitation: { $ne: null },
        date_time: { $gte: fiveMonthsAgo, $lte: current_date },
      },
      {
        // display only these fields in the response
        projection: {
          device_name: 1,
          precipitation: 1,
          date_time: 1,
          _id: 0,
        },
      }
    )
    // sort precipitation values in descending order
    .sort({ precipitation: -1 })
    // grab the first one
    .limit(1)
    // convert it to an array
    .toArray();

  return result;
};

/**
 * Get max temperature readings for each station between two dates
 *
 * @export
 * @async
 * @param {String} start_date
 * @param {String} end_date
 * @returns {Promise<Object[]>} - A promise for the array of readings for each station
 */
export const getMaxTemperatureBetweenDates = async (
  start_date: string,
  end_date: string
): Promise<object[]> => {
  const result = await db
    .collection("readings")
    .aggregate([
      {
        $match: {
          date_time: {
            $gte: new Date(start_date),
            $lte: new Date(end_date),
          },
        },
      },
      {
        $group: {
          _id: "$device_name",
          max_temperature: { $max: "$temp_celsius" },
          date_time: { $first: "$date_time" },
        },
      },
      {
        $project: {
          _id: 0,
          device_name: "$_id",
          date_time: 1,
          max_temperature: 1,
        },
      },
    ])
    .toArray();

  return result;
};

/**
 * Get the temperature, atmospheric pressure, solar radiation and precipitation
 * for a weather station by a specified date and time
 *
 * @export
 * @async
 * @param {String} device_name - the name of the weather station device
 * @param {String} date_time - the date and time
 * @returns {Promise<Object[]>} - A promise for the array of readings for a weather station by a specified date and time
 */
export const getReadingsBetweenDates = async (
  device_name: string,
  date_time?: string
): Promise<Object[]> => {
  let query: {
    device_name: string;
    temp_celsius: { $ne: null };
    atmospheric_pressure: { $ne: null };
    solar_radiation: { $ne: null };
    precipitation: { $ne: null };
    date_time?: { $lte: Date };
  } = {
    device_name: device_name,
    temp_celsius: { $ne: null },
    atmospheric_pressure: { $ne: null },
    solar_radiation: { $ne: null },
    precipitation: { $ne: null },
  };

  if (date_time) {
    query.date_time = {
      // Find the readings on or before the specified date and time
      $lte: new Date(date_time),
    };
  }

  const result = await db
    .collection("readings")
    .find(query, {
      projection: {
        device_name: 1,
        date_time: 1,
        temp_celsius: 1,
        atmospheric_pressure: 1,
        solar_radiation: 1,
        precipitation: 1,
        _id: 0,
      },
    })
    .sort({ date_time: -1 })
    .limit(1)
    .toArray();

  return result;
};

/**
 * Insert the provided weather reading into the database
 *
 * @export
 * @async
 * @param {Object[]} reading - the reading to insert
 * @returns {Promise<InsertOneResult>} - The result of the insert operation
 */
export const create = async (
  reading: WeatherReadingObject
): Promise<InsertOneResult> => {
  // clear the _id from reading to ensure that the new reading does not have an
  // existing _id from the database, as we want a new _id to be created and added to the reading object
  delete reading._id;

  return db.collection("readings").insertOne(reading);
};

/**
 * Insert the readings into the database
 *
 * @export
 * @async
 * @param {Object[]} readings - the array of readings to insert
 * @returns {Promise<InsertManyResult>} - The result of the insert operation
 */
export const createMany = async (readings: WeatherReadingObject[]) => {
  // clear the _id from readings to ensure the new readings do not have existing _ids from the database,
  // because we want the new _ids to be created and added to the reading objects.
  for (const reading of readings) {
    delete reading._id;
  }

  // Insert the reading doc and add the new _id to the reading
  return db.collection("readings").insertMany(readings);
};

/**
 * Update a weather reading's precipitation value
 * @export
 * @async
 * @param {ObjectId} id - the id of the reading to update
 * @param {Double | Number} precipitation - the object result
 * @returns {Promise<UpdateOneModel>} - The result of the update operation
 */
export const updatePrecipitationById = async (
  id: string | ObjectId,
  precipitation: Double
) => {
  const result = await db.collection("readings").updateOne(
    { _id: new ObjectId(id) },
    // sets the new precipitation value and overrides the old one.
    { $set: { precipitation: precipitation } }
  );

  if (result) {
    return result;
  } else {
    return Promise.reject(`reading not found with id: ${id}`);
  }
};

/**
 * Delete a specific weather reading by its ObjectId
 *
 * @export
 * @async
 * @param {ObjectId} id - mongoDb ObjectId of the reading to delete
 * @returns {Promise<DeleteOneModel>} - the result of the delete operation
 */
export const deleteById = async (id: string | ObjectId) => {
  return db.collection("readings").deleteOne({ _id: new ObjectId(id) });
};
