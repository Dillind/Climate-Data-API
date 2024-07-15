import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import docs from "./middleware/docs";
import readingsRouter from "./routes/readings";
import userRouter from "./routes/users";
import authRouter from "./routes/auth";

// Create express application instance
const app = express();
const port = 8080;

// Enable cross-origin resources sharing (CORS)
app.use(
  cors({
    // origin: true,
    origin: ["https://localhost:8080", "https://www.wikipedia.org"],
  })
);

// Enable JSON request body parsing middleware (turns JSON into JS objects for us)
app.use(express.json());

// registered routes
app.use(docs);
app.use("/readings", readingsRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);

// Handle errors raised by endpoints and respond with JSON error objects
app.use(
  (
    err: { status: number; message: string; errors: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(err.status || 500).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  }
);

// Start listening for requests
app.listen(port, () => {
  console.log(`Server started with http://localhost:${port}/docs`);
});
