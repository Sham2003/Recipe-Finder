const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RecipeModel = require('./models/Recipe');

const app = express();
app.use(cors());
app.use(express.json());
const MONGODB_URI = 'mongodb://localhost:27017/flavourify';

mongoose.connect(MONGODB_URI);

app.get("/getRecipe", (req, res) => {
    const {name} = req.query;
    console.log("GET /getRecipe ?name=",name);

    const namePattern = new RegExp(name, 'i'); 

    RecipeModel.find({ recipeName: namePattern })
        .then((recipes) => {
            if (recipes.length === 0) {
                res.json(null);
            } else {
                res.json(recipes);
            }
        })
        .catch((err) => {
            console.error('Error:', err);
            res.status(501).json({
                message: "Error Encountered",
            });
        });
});

app.get("/getAll", (req, res) => {
    console.log("GET /getAll");
    RecipeModel.find({}).then(function(recipes){
        if(recipes.length > 5){
            recipes.splice(5);
        }
        console.log(recipes.length);
        res.json(recipes);
    }).catch(function(err){
        console.log('error'+err);
        res.json({
            status:501,
            message:"Error Encountered"
        })
    })
});

app.listen(5001, () => {
    console.log("Server is running on port 5001");
})
