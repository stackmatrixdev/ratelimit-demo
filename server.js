const express = require("express");
const port = 3000;
const ratelimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const app = express();

const limiter = ratelimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 2, // max requests per window per IP
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const speedLimiter = slowDown({
  windowMs: 5 * 1000, // 5 seconds
  delayAfter: 1, // allow 1 request per 5 seconds, then...
  delayMs: 1000, // begin adding 1 second of delay per request above 1:
});

const anotherLimiter = ratelimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 1, // max requests per window per IP
  message: "Too many requests, please try again later2.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Rate limit
app.get("/", (req, res) => {
  console.log("request catch...");
  res.send("Welcome to rest api");
});

app.get("/another", anotherLimiter, (req, res) => {
  console.log("Another Limiter request catch...");
  res.send("Welcome to another rest api");
});

// Slow down

app.get("/slow", speedLimiter, (req, res) => {
  console.log("Slow down request catch...");
  res.send("Welcome to slow rest api");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
