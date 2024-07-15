import { Double, ObjectId } from "mongodb";

export type WeatherReadingObject = {
  _id?: ObjectId | undefined;
  device_name: string;
  precipitation: Double | number;
  atmospheric_pressure: Double | number;
  date_time: Date | number;
  humidity: Double | number;
  latitude: Double | number;
  longitude: Double | number;
  max_wind_speed: Double | number;
  solar_radiation: Double | number;
  temp_celsius: Double | number;
  vapor_pressure: Double | number;
  wind_direction: Double | number;
};
