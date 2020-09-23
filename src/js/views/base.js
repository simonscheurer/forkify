export const elements = {
    searchForm: document.querySelector('.search'),
    searchField: document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    searchResultsContainer: document.querySelector('.results'),
    searchPaging: document.querySelector('.results__pages')
};

export const elementStrings = {
    loader: 'loader',
    pagingButton: 'btn-inline',
    recipeLink: 'results__link'
}

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