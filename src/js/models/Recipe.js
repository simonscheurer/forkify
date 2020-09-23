import axios from 'axios';
import urls from './urls';

export default class Recipe {
    constructor(recipeId) {
        this.id = recipeId;
    }

    async getRecipe() {
        try {
            const result = await axios(urls.recipeUrl(this.id));
            const recipe = result.data.recipe;
            return {
                title: recipe.title,
                author: recipe.publisher,
                ingredients: recipe.ingredients,
                image: recipe.image_url,
                cookingTime: this.calcCookingTime(recipe.ingredients),
                servings: this.calcServings()
            };
        }
        catch (error) {
            // Should be 404 to be properly restful
            // 400 also happens in case there are no results
            if ((""+error).includes('400')) {
                console.log(`Could not find recipe with id '${this.id}'.`);
            }
            else {
                console.log(`Could not retrieve recipe for id '${this.id}': ${error}`);
            } 
            return [];
        }
    }

    calcCookingTime(ingredients) {
        // Based on number of ingredients
        const count = ingredients.length;
        const periods = Math.ceil(count/3);
        return periods * 15;
    }

    calcServings() {
        return 4;
    }
}


/* Model structure 

{
  "publisher": "101 Cookbooks",
  "ingredients": [
    "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled",
    "1 3/4 (.44 ounce) teaspoons salt",
    "1 teaspoon (.11 ounce) instant yeast",
    "1/4 cup (2 ounces) olive oil (optional)",
    "1 3/4 cups (14 ounces) water, ice cold (40F)",
    "Semolina flour OR cornmeal for dusting"
  ],
  "source_url": "http://www.101cookbooks.com/archives/001199.html",
  "recipe_id": "47746",
  "image_url": "http://forkify-api.herokuapp.com/images/best_pizza_dough_recipe1b20.jpg",
  "social_rank": 100,
  "publisher_url": "http://www.101cookbooks.com",
  "title": "Best Pizza Dough Ever"
}

*/