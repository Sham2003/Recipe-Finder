const RecipeModel = require('./models/Recipe');
const mongoose = require('mongoose');
const axios = require('axios');


const MONGODB_URI = 'mongodb://localhost:27017/flavourify';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Connected to MongoDB');
      fetchAndInsertRecipes(); // Fetch data and insert into the collection
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });

function cleanInstructionText(text) {
    return text.replace(/^\s*step\s*\d+\s*/i, '');
}
  

async function fetchAndInsertRecipes() {
    try {
      const recipes = [];
  
      // Fetch 20 random recipes
      for (let i = 0; i < 20; i++) {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
        const meal = response.data.meals[0]; // First (and only) meal in the response
  
        const recipeName = meal.strMeal;
        const recipeType = meal.strCategory;
        const recipeArea = meal.strArea;
        const thumbnail = meal.strMealThumb;
        const ingredients = [];
  
        // Collect ingredients from the API response
        for (let j = 1; j <= 20; j++) {
          const ingredient = meal[`strIngredient${j}`];
          const measure = meal[`strMeasure${j}`];
          if (ingredient && measure) {
            ingredients.push(`${measure} ${ingredient}`); // Combine measure and ingredient
          } else if (ingredient) {
            ingredients.push(ingredient);
          }
        }
  
        // Clean instructions to remove step numbering
        let instructions = meal.strInstructions.split('\r\n').filter(Boolean);
        instructions = instructions.map(cleanInstructionText);
  
        // Create a new recipe object for insertion
        const recipe = {
          recipeName,
          recipeType,
          recipeArea,
          ingredients,
          instructions,
          thumbnail
        };
  
        recipes.push(recipe);
      }
  
      // Insert all 20 recipes into the collection at once
      const result = await RecipeModel.insertMany(recipes);
      const recipeNames = result.map((r) => r.recipeName);
      console.log('Recipes inserted:', recipeNames);
    } catch (error) {
      console.error('Error fetching or inserting recipes:', error);
    } finally {
      mongoose.disconnect(); // Disconnect from MongoDB after operation is complete
    }
  }