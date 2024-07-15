import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

// setup ENV file values in process
dotenv.config();

// Access the MongoDB connection URL from the ENV file
const connectionString = process.env.MDB_URL as string;

// Create a new MongoDB connection client with the URL from the ENV file
const client = new MongoClient(connectionString);

// Select the database to use and export for use by models
export const db = client.db("weather-data-api");
