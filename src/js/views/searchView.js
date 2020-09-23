import { elements, elementStrings } from './base';

const ITEMS_PER_PAGE = 10;

export const getInput = () => elements.searchField.value;

export const clearInput = () => {
    elements.searchField.value = "";
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = "";
    elements.searchPaging.innerHTML = "";
};

export const renderResults = (recipes, page = 1, itemsPerPage = ITEMS_PER_PAGE) => {
    clearResults();
    const start = (page-1) * itemsPerPage; // Starts with 0 by default
    let end = start + itemsPerPage; 
    // Slice will not go beyond the end of the array. Thus we do not need to test for recipes.length
    recipes.slice(start, end).forEach(renderRecipe);
    renderPagingButtons(page, recipes.length, itemsPerPage);
};

function ellipsis(str, limit = 19) {
    if (str.length > limit) {
        const fittingWords = [];
        let words = str.split(' ');
        words.reduce((accumulator, current)=> {
            if (accumulator + current.length <= limit - 3) {
                fittingWords.push(current);
            }
            // Return value is the new accumulator
            // Add one (because of the space)
            return accumulator + current.length + 1;
        }, 
        // Initial vale of accumulator
        0);
        str = fittingWords.join(' ') + " ...";
    } 
    return str;
}

function renderPagingButtons(page, totalResults, itemsPerPage = ITEMS_PER_PAGE) {
    const totalPages = Math.ceil(totalResults / itemsPerPage);
    if (totalPages <= 1)
        return;

    let buttons;
    if (page === 1) {
        buttons = getRightPagingButton(page);
    }
    else if (page === totalPages) {
        buttons = getLeftPagingButton(page);
    }
    else if (page < totalPages) {
        buttons = getLeftPagingButton(page) + getRightPagingButton(page);
    }
    elements.searchPaging.innerHTML = buttons;
}

function renderRecipe(recipe) {
    const recipeMarkup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${ellipsis(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`;
    elements.searchResultList.insertAdjacentHTML("beforeend", recipeMarkup);
}

function getRightPagingButton(currentPage) {
    return `
    <button class="${elementStrings.pagingButton} results__btn--next" data-page="${currentPage + 1}">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
    </button>`;
}

function getLeftPagingButton(currentPage) {
    return `
    <button class="${elementStrings.pagingButton} results__btn--prev" data-page="${currentPage - 1}">
        <span>Page ${currentPage - 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-left"></use>
        </svg>
    </button>`;
}