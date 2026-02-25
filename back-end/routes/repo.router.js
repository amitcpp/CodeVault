const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/create", repoController.createRepository);
repoRouter.get("/all", repoController.getAllRepositories);
repoRouter.get("/id/:id", repoController.fetchRepositoryById);
repoRouter.get("/name/:name", repoController.fetchRepositoryByName);

/*
  🔥 THIS is what your dashboard needs
*/
repoRouter.get("/user/:userId", repoController.fetchRepositoriesForCurrentUser);

repoRouter.put("/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/toggle/:id", repoController.toggleVisibilityById);

module.exports = repoRouter;