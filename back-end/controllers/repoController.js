const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");



async function createRepository(req, res){
    const {owner,name,issues,content,description,visibility} = req.body;
    try{
        if(!name){
            return res.status(400).json({ error: "Repository name is required!"});
        }
        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).json({ error: "Invalid owner ID!"});
        }
        const newRepository = new Repository({
            name,
            description,
            visibility,
            owner,
            content,
            issues,
        });

        const result = await newRepository.save();
        res.status(201).json({
            message: "Repository created successfully!",
            repositoryID: result._id,
        });

    } catch(err){
        console.error("Error  during creating repository:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function getAllRepositories(req, res){
    try{
        const repositories = await Repository.find()
            .populate("owner")
            .populate("issues");
        res.json(repositories);

    }catch(err){
        console.error("Error during fetching repositories:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function fetchRepositoryById(req, res){
    const { id } = req.params;
    try{
        const repository = await Repository.find({_id: id})
            .populate("owner")
            .populate("issues");
        res.json(repository);
    } catch(err){
        console.error("Error during fetching repository by ID:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function fetchRepositoryByName(req, res){
const  { name } = req.params;
    try{
        const repository = await Repository.find({ name })
            .populate("owner")
            .populate("issues");
        res.json(repository);
    } catch(err){
        console.error("Error during fetching repository by ID:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function fetchRepositoriesForCurrentUser(req, res) {
  const { userID } = req.params;  // extract just the string value

  // Validate the userID
  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ error: "Invalid user ID!" });
  }

  try {
    const repositories = await Repository.find({ owner: userID })
      .populate("owner")
      .populate("issues");

    if (!repositories || repositories.length === 0) {
      return res
        .status(404)
        .json({ message: "No repositories found for this user." });
    }

    res.json({
      message: "Repositories fetched successfully!",
      repositories
    });
  } catch (err) {
    console.error("Error during fetching repositories for current user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


async function updateRepositoryById(req, res){
    const {id} = req.params;
    const {content, description}= req.body;
    try{
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found!" });
        }
        repository.content.push(content);
        repository.description = description;
        const updatedRepository = await repository.save();
        res.json({
            message: "Repository updated successfully!",
            repository: updatedRepository,
        });
    }catch(err){
        console.error("Error during updating repository by ID:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function toggleVisibilityById(req, res){
    const {id} = req.params;
    try{
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found!" });
        }
        repository.visibility = !repository.visibility; // Toggle visibility
        const updatedRepository = await repository.save();
        res.json({
            message: "Repository visibility toggled successfully!",
            repository: updatedRepository,
        });
    }catch(err){
        console.error("Error during toggling visibility:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function deleteRepositoryById(req, res){
    const { id } = req.params;
    try{
        const repository = await Repository.findByIdAndDelete(id);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found!" });
        }
        res.json({message: "Repository deleted successfully!"});
    }catch(err){
        console.error("Error during deleting repository by ID:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    createRepository,       
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById
};