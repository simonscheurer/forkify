export const elements = {
    searchForm: document.querySelector('.search'),
    searchField: document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    searchResultsContainer: document.querySelector('.results'),
    searchPaging: document.querySelector('.results__pages'),
    recipeContainer: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    //servings: document.querySelector('.recipe__info-data--people'),
    //servingsButtons: document.querySelector('.recipe__info-buttons'),
};

export const elementStrings = {
    loader: 'loader',
    pagingButton: 'btn-inline',
    recipeLink: 'results__link',
    servingsButton: 'btn-tiny',
    shoppingButton: 'recipe__btn--add',
    deleteListItemButton: 'shopping__delete',
    changeQuantityInput: 'shopping__count-value',
    shoppingItem: 'shopping__item'
};

export const renderLoader = (parent) => {
    // Infinitely rotating svg - check CSS for details
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML("afterbegin", loader);
};

export const removeLoaders = () => {
    // Infinitely rotating svg - check CSS for details
    const loaders = document.querySelectorAll(`.${elementStrings.loader}`);
    for (const loader of loaders) {
        loader.parentElement.removeChild(loader);
    }
};

export const select = (clazz, fromElement) => {
    const selector = `.${clazz}`;
    const root = fromElement ? fromElement : document;
    return root.querySelector(selector);
};

export const match = (clazz, element) => {
    const selector = `.${clazz}, .${clazz} *`;
    const root = element ? element : document;
    if (root.matches(selector)) {
        return element.closest(`.${clazz}`);
    }
    return undefined;
};