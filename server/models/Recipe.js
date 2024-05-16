const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  recipeName: {
    type: String,
    required: true
  },
  recipeType: {
    type: String,
    required: true,
  },
  recipeArea: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true, 
  },
  instructions: {
    type: [String],
    required: true, 
  },
  thumbnail:{
    type:String,
    required:true
  }
});

const RecipeModel = mongoose.model('recipes', recipeSchema);

module.exports = RecipeModel;
