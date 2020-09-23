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
            const ingredients = this.parseIngredients(recipe.ingredients);
            return {
                title: recipe.title,
                author: recipe.publisher,
                ingredients: ingredients,
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
            return false;
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

    parseIngredients(ingredients) {
        const parser = new IngredientParser();
        // Once more: map(parser.parse) does not work
        // because then in the parser 'this' is not defiend
        return ingredients.map(item => parser.parse(item));
    }
}

class IngredientParser {
    construtor() {}

    parse(rawIngredient) {
        const ingredient = this.clean(rawIngredient);
        const state = {
            index: 0,
            tokens: ingredient.split(' ')
        };

        const quantity = this.parseQuantity(state);
        const measure  = this.parseMeasure(state);
        const text     = this.parseText(state);
        const ounces   = this.getOunces(measure, quantity);

        return {
            raw: rawIngredient,
            quantity: quantity,
            measure: measure,
            text: text,
            ounces: ounces,
            fullText: this.getFullText(quantity, measure, ounces, text)
        };

        /*
        "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled"
        "1 3/4 (.44 ounce) teaspoons salt"
        "1 teaspoon (.11 ounce) instant yeast"
        "1/4 cup (2 ounces) olive oil (optional)"
        "1 3/4 cups (14 ounces) water, ice cold (40F)"
        "Semolina flour OR cornmeal for dusting"        
        */
    }

    clean(ingredient) {
        // Remove ounces from string, as we calculate them later
        ingredient = ingredient.replace(/ \([\.0-9]+ (?:ounces|ounce|oz)\)/gi, "");

        // Ounces with an "each" refer to packages, jars, pieces, etc. 
        // We keep these as there is no general rule on how much these refer to
        ingredient = ingredient.replace(/\(([\.0-9]+) (?:ounces|ounce|oz) ?(each)?\)/gi, "($1 oz each)");

        // Change alternative number representation to normal one
        return ingredient.replace(/(\d+)-(\d+\/\d+)/g, "$1 $2");

    }

    parseQuantity(state) {
        let quantity = 0;
        for (const token of state.tokens) {
            if (token.match(/^\d+\/\d+$/)) {
                // Fraction
                const f = token.split('/');
                if (f[1] > 0) quantity += f[0]/f[1];
                state.index++;
            } else if (token.match(/^\d+$/)) {
                quantity += parseInt(token);
                state.index++;
            } else {
                break;
            }
        }
        return quantity;
    }
    
    parseMeasure(state) {
        let measure = state.tokens[state.index].toLowerCase();
        const validMeasures = Object.keys(this.measures);
        if (validMeasures.includes(measure)) {
            measure = this.measures[measure];
            state.index++;
        } else {
            measure = this.measures["default"];
        }
        return measure;
    }

    parseText(state) {
        return state.tokens.slice(state.index).join(' ');
    }

    format(num) {
        if (Math.floor(num) === num) {
            return num.toFixed(0);
        }
        return num.toFixed(2);
    }

    getFullText(quantity, measure, ounces, text) {
        if (quantity <= 0) {
            return text;
        }
        else if (measure === "pkg" || measure === "jar") {
            return `${this.format(quantity)} ${measure} ${text}`;
        } 
        else if (measure === "pcs") {
            return `${this.format(quantity)} ${text}`;
        } 
        else {
            return `${this.format(quantity)} ${measure} (${this.format(ounces)} oz) ${text}`;
        }
    }
}

IngredientParser.prototype.measures = {
    oz:         "oz",
    ounce:      "oz",
    ounces:     "oz",
    tbsp:       "tbsp",
    tablespoon: "tbsp",
    tblsp:      "tbsp",
    tablespoons:"tbsp",
    tsp:        "tsp",
    teaspoon:   "tsp",
    teaspoons:  "tsp",
    cup:        "cup",
    cups:       "cup",
    pounds:     "pound",
    pound:      "pound",
    jars:       "jar",
    jar:        "jar",
    packages:   "pkg",
    package:    "pkg",
    qt:         "qt",
    quart:      "qt",
    "liquid quart": "qt",
    default:    "pcs"
};

IngredientParser.prototype.getOunces = function(measure, quantity) {
    switch (measure) {
        case "oz":
            return quantity;
        case "tbsp":
            return quantity * 0.5;
        case "tsp":
            return quantity / 6; 
        case "cup":
            return quantity * 8; 
        case "pound":
            return quantity * 16; 
        case "qt":
            return quantity * 32; 
        default:
            return 0;
    }
};


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