import { elements, select } from './base';

export const renderItem = item => {
    const element = getItem(item.id);
    if (element) {
        updateAmount(item.id, item.quantity);
    }
    else {
        addNewElement(item);
    }
};

export const deleteItem = id => {
    const item = getItem(id);
    if (item) {
        item.parentElement.removeChild(item);
    }
};

export const updateAmount = (id, quantity) => {
    const item = getItem(id);
    if (item) {
        const input = item.querySelector(".shopping__count-value");
        input.value = quantity;
    }
};

function addNewElement(item) {
    const markup = `
        <li class="shopping__item" data-id="${item.id}">
            <div class="shopping__count">
                <input type="number" value="${item.quantity}" step="${item.quantity}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shoppingList.insertAdjacentHTML("beforeend", markup);

}

function getItem(id) {
    return document.querySelector(`[data-id="${id}"]`);
}
