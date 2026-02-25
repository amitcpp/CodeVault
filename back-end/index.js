const express = require("express");
const dotenv = require("dotenv");
dotenv.config(); // ✅ Load .env only once

const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const mainRouter = require("./routes/main.router"); // ✅ Import main router
const connectDB = require("./config/db");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

// CLI controllers
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

// ================= CLI COMMANDS =================
yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull commits from S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;


// ================= SERVER START =================
function startServer() {
  const app = express();
  const port = process.env.PORT || 5000;

  // ✅ MIDDLEWARE
  app.use(cors({ origin: "*" }));
  app.use(express.json()); // ✅ removed duplicate bodyParser

  // ================= MONGODB =================
  const mongoURI = process.env.MONGODB_URI;

  mongoose
    .connect(mongoURI)
    .then(() => console.log("✅ MongoDB connected!"))
    .catch((err) =>
      console.error("❌ MongoDB connection error:", err)
    );

  // ================= ROUTES =================
  // ✅ IMPORTANT FIX: prefix added to avoid 404 in frontend
  app.use("/api", mainRouter);

  // ================= SOCKET =================
  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let user = "test";

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("=====");
      console.log(user);
      console.log("=====");
      socket.join(userID);
    });
  });

  // ================= DB EVENTS =================
  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations called");
  });

  // ================= SERVER =================
  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}