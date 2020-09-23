import uid from 'uniqid';

const LIST_KEY = 'forkify__shopping-list';

export default class List {
    constructor() {
        this.items = this.readFromLocalStorage();
    }

    addItem(quantity, unit, ingredient) {
        let item = this.existing(unit, ingredient);
        if (item) {
            item.quantity += quantity;
        }
        else {
            item = {
                id: uid(),
                quantity,
                unit,
                ingredient
            };
            this.items.push(item);
        } 
        this.persistToLocalStorage();
        return item;
    }

    removeItem(id) {
        this.actOnId(id, (_, index) => this.items.splice(index, 1));
    }

    updateItem(id, quantity) {
        this.actOnId(id, item => item.quantity = quantity);
    }

    actOnId(id, action) {
        const index = this.items.findIndex(item => item.id === id);
        if (index > -1) {
            const item = this.items[index];
            action(item, index);
            this.persistToLocalStorage();
        }
    }

    existing(unit, ingredient) {
        const index = this.items.findIndex(item => 
            item.unit === unit && item.ingredient == ingredient);
        return index > -1 ? this.items[index] : undefined;
    }

    readFromLocalStorage() {
        const serializedList = localStorage.getItem(LIST_KEY);
        if (serializedList) {
            return JSON.parse(serializedList);
        }
        return [];
    }

    persistToLocalStorage() {
        const serializedList = JSON.stringify(this.items);
        localStorage.setItem(LIST_KEY, serializedList);
    }
}