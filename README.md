# Climate Data RESTful API

The **Climate Data RESTful API** project is developed for an educational institution aiming to analyse raw climate data collected across Queensland using a distributed Internet of Things (IoT) sensor network. This API provides a robust interface to interact with MongoDB, managing weather data and user authentication securely.

## Project Overview

This project involves designing and implementing a MongoDB-based RESTful API to handle a large dataset of climate data observations. The API supports CRUD operations for weather data and user management functionalities, including authentication and authorisation. It ensures scalability by leveraging MongoDB's partitioning capabilities to distribute workload efficiently across multiple hardware instances, such as Raspberry Pi 4 devices.

## Technologies Used

### Backend

- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.

- [Express](https://www.npmjs.com/package/express): A fast and minimalist web framework for Node.js, used for handling routing, middleware, and HTTP request/response management.

- [MongoDB](https://mongodb.com/): A NoSQL document-oriented database management program.

- [Mongoose](https://www.npmjs.com/package/mongoose): MongoDB object modeling for Node.js, simplifying interactions with MongoDB.

- [bcryptjs](https://www.npmjs.com/package/bcryptjs): A library for secure password hashing.

### Documentation

- [SwaggerUI](https://swagger.io/tools/swagger-ui/): A tool for API documentation, facilitating client-side integration

## Getting Started

To get started with the **Climate Data RESTful API**, follow the steps outlined below:

1. Clone the repository or download a ZIP file to your local machine.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your database (there is a sample DB in `weather_data_collections` that contains changelog, readings and user collections) and
   configure the connection in the `src/database.ts`

4. Compile TypeScript:

   ```bash
   npm run build
   ```

5. Start the server

   ```bash
   npm run start
   ```
