import uid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(quantity, unit, ingredient) {
        const item = {
            id: uid.uniqueid(),
            quantity,
            unit,
            ingredient
        };
        this.items.push(item);
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
        }
    }
}