import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as viewHelpers from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
/* 
Global state of the app 
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};

/* Search controller */

class SearchController {
    constructor(elements) {
        this.elements = elements;
    }

    init(){
        this.addListeners();
    } 

    async controlSearch() {
        // Get query from the search
        const query = searchView.getInput();
        console.log(`Retrieving results for '${query}'.`);

        if (query) {
            this.prepareUI();
            await this.loadAndRenderResults(query);
        }
    }
    
    prepareUI() {
        searchView.clearInput();
        searchView.clearResults();
        viewHelpers.renderLoader(this.elements.container);
    }
    
    async loadAndRenderResults(query) {
        const search = new Search(query);
        this.recipes = await search.getResults();
        viewHelpers.removeLoaders();
        this.showResults();
    }

    showResults(page = 1) {
        searchView.renderResults(this.recipes, page);
    }    

    addListeners() {
        this.elements.form.addEventListener('submit', event => {
            event.preventDefault();
            this.controlSearch();
        });

        this.elements.pagingContainer.addEventListener('click', event => {
            const button = event.target.closest(`.${this.elements.pagingButtonClass}`);
            if (button) {
                // Button needs a data-page attribute
                const page = parseInt(button.dataset.page);
                this.showResults(page);
            }
            
            /*
            Alternate lookup without closest

            let element = event.target;
            while (!element.hasAttribute("data-page")) {
                element = element.parentElement;
            }
            */
        });
    }
}

class ListController {
    constructor(elements) {
        this.elements = elements;
    }

    init() {
        this.addListeners();
        this.list = new List();
        this.list.items.forEach(item => listView.renderItem(item));
    }

    addIngredients(ingredients) {
        ingredients.forEach(ingredient => {
            const item = this.list.addItem(ingredient.quantity, ingredient.unit, ingredient.text);
            listView.renderItem(item);
        });
    }

    deleteIngredient(id) {
        this.list.removeItem(id);
        listView.deleteItem(id);
    }

    addListeners() {
        const deleteClass = viewHelpers.elementStrings.deleteListItemButton;
        const inputClass = viewHelpers.elementStrings.changeQuantityInput;

        viewHelpers.elements.shoppingList.addEventListener("click", event => {
            let element = viewHelpers.match(deleteClass, event.target);
            if (element) {
                const id = this.getId(element);
                this.deleteIngredient(id);
                return;
            }

            element = viewHelpers.match(inputClass, event.target);
            if (element) {
                const id = this.getId(element);
                const quantity = parseFloat(element.value);
                this.list.updateItem(id, quantity);
                return;
            }
        });

        /*
        addEventListener(type, this.controlRecipe);
        does *not* work. Becuase then 'this' is set to the
        window object. By defining it explicitly, it's called
        from the actual context which keeps "this" on the 
        actual object.
        */


    }

    getId(element) {
        const parent = element.closest(`.${viewHelpers.elementStrings.shoppingItem}`);
        return parent.dataset.id;        
    }

}

class RecipeController {
    constructor(elements) {
        this.elements = elements;
    }

    init() {
        this.addListeners();
    }

    getRecipeId() {
        return window.location.hash.substring(1);
    }

    controlRecipe() {
        const id = this.getRecipeId();
        if (id) {
            this.showRecipe(id);
        }
    }

    async updateServings(increase) {
        if (!this.recipe) return;

        let servings = increase ?
            this.model.increaseServings() :
            this.model.decreaseServings();

        this.recipe = await this.model.getRecipe();
        recipeView.updateServingsAndIngredients(servings, this.recipe);
    }

    async showRecipe(id) {
        this.model = new Recipe(id);
        recipeView.clearRecipe();
        viewHelpers.renderLoader(this.elements.container);

        this.recipe = await this.model.getRecipe();
        // console.log("recipe", this.recipe);
        viewHelpers.removeLoaders();
        if (this.recipe) {
            searchView.highlightSelected(id);
            recipeView.renderRecipe(this.recipe);
            //console.log(this.recipe.ingredients);
        }
    }

    addListeners() {
        const servingsClass = viewHelpers.elementStrings.servingsButton;
        const shoppingClass = viewHelpers.elementStrings.shoppingButton;

        /*
        This works as well, but the hashchange is nicer
        and decouples the app better
        */
       /*
        this.elements.container.addEventListener("click", (event) => {
            const link = event.target.closest(`.${this.elements.link}`);
            if (link) {
                // link.href does not work as link.href adds the
                // actual base url to the link, while getAttribute
                // only returns the actual string
                const id = link.getAttribute("href").substring(1);
                this.showRecipe(id);
            }
        });
        */

        ['hashchange', 'load'].forEach(type => window.addEventListener(type, () => {
            this.controlRecipe();
        }));

        viewHelpers.elements.recipeContainer.addEventListener("click", event => {
            let button = viewHelpers.match(servingsClass, event.target);
            if (button) {
                const type = button.dataset.type;
                this.updateServings(type == "inc");
                return;
            }

            button = viewHelpers.match(shoppingClass, event.target);
            if (button) {
                state.listController.addIngredients(this.recipe.ingredients);
            }
        });

        /*
        addEventListener(type, this.controlRecipe);
        does *not* work. Becuase then 'this' is set to the
        window object. By defining it explicitly, it's called
        from the actual context which keeps "this" on the 
        actual object.
        */


    }
}



state.searchController = new SearchController({
    form: viewHelpers.elements.searchForm,
    pagingContainer: viewHelpers.elements.searchPaging,
    pagingButtonClass: viewHelpers.elementStrings.pagingButton,
    container: viewHelpers.elements.searchResultsContainer
});

state.recipeController = new RecipeController({
    container: viewHelpers.elements.recipeContainer,
    link: viewHelpers.elementStrings.recipeLink
});

state.listController = new ListController({

});

state.searchController.init();
state.recipeController.init();
state.listController.init();
//state.recipeController.showRecipe("a723e8");
