import { Request, Response, Router } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import * as OpenApiValidator from "express-openapi-validator";
import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";

const docs = Router();

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Weather Data API",
      description: "JSON REST API for weather station readings",
    },
    // host: "localhost:8080",
    // basePath: "",
    // schemes: ["http"],
    // consumes: ["application/json"],
    // produces: ["application/json"],
    // security: [{ AuthenticationKey: [] }],
    components: {
      securitySchemes: {
        ApiKey: {
          type: "apiKey",
          in: "header",
          name: "X-AUTH-KEY",
        },
      },
    },
  },
  apis: [
    "./src/routes/*.{js,yaml}",
    "./src/controllers/*/*.js",
    "./src/components.yaml",
    "./src/middleware/docs.js",
  ],
};

const specification = swaggerJSDoc(options);

// Setup SwaggerUI - this wwill server as an interactive webpage that documents
// our API based on the specification generated above

docs.get("/test", (req: Request, res: Response) => {
  res.json(specification);
});

/**
 * @openapi
 * /docs:
 *      get:
 *          summary: "View automatically generated API documentation"
 *          responses:
 *            '200':
 *              description: 'Swagger documentation page'
 */
docs.use("/docs", swaggerUi.serve, swaggerUi.setup(specification));

docs.get("/docs", swaggerUi.setup(specification));

// Setup OpenAPIValidator - This will automatically check that every route adheres to the documentation (i.e. will validate every request and response)
docs.use(
  OpenApiValidator.middleware({
    apiSpec: specification,
    validateRequests: true, // (default)
    validateResponses: true, // false by default
  })
);

export default docs;
