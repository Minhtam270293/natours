'use strict';

class Cart {
    constructor(oldCart) {
        this.items = oldCart.items || {};
        this.shipping = oldCart.shipping || 0;
        this.discount = oldCart.discount || 0;

        this.couponCode = oldCart.couponCode || '';
        this.paymentMethod = oldCart.paymentMethod || 'COD';
        this.shippingAddress = oldCart.shippingAddress || '';
    }

    get quantity() {
        // let quantity = 0;
        // for (let id in this.items) {
        //     quantity += parseInt(this.items[id].quantity);
        // }
        // return quantity;
        return Object.keys(this.items).length;
    }

    get subtotal() {
        let price = 0;
        for (let id in this.items) {
            price += parseFloat(this.items[id].totalPrice);
        }
        return parseFloat(price).toFixed(2);
    }

    get total() {
        let price = parseFloat(this.subtotal) + parseFloat(this.shipping) - parseFloat(this.discount);
        return parseFloat(price).toFixed(2);
    }

    // add(product, quantity) {
    //     let id = product._id;

    //     let storedItem = this.items[id];
    //     if (!storedItem) {
    //         this.items[id] = { product, quantity: 0, total: 0 };
    //         storedItem = this.items[id];
    //     }
    //     storedItem.quantity += parseInt(quantity);
    //     storedItem.total = parseFloat(storedItem.product.price * storedItem.quantity).toFixed(2);
    //     return storedItem;
    // }

    remove(id) {
        let storedItem = this.items[id];
        if (storedItem) {
            delete this.items[id];
        }
    }

    // update(id, quantity) {
    //     let storedItem = this.items[id];
    //     if (storedItem && quantity >= 1) {
    //         storedItem.quantity = quantity;
    //         storedItem.total = parseFloat(storedItem.product.price * storedItem.quantity).toFixed(2);
    //     }
    //     return storedItem;
    // }

    addTour(tour, orderSize=1) {
        const tourID = tour._id;

        
        if (!this.items[tourID]) {
            const size = parseInt(orderSize);
            this.items[tourID] = {
                tour,
                groupSize: size,
                totalPrice: parseFloat(tour.price * size).toFixed(2)
            }
        }

        return this.items[tourID];
    }

    updateTourSize(tourID, updatedSize) {
        let storedItem = this.items[tourID];
        if (storedItem && updatedSize >= 1) {
            storedItem.groupSize = updatedSize;
            storedItem.totalPrice = parseFloat(storedItem.tour.price * storedItem.groupSize).toFixed(2);
        }
        return storedItem;
    }

    clear() {
        this.items = {};
        this.discount = 0;
        this.shipping = 0;
        this.couponCode = '';
    };

    #generateArray() {
        let arr = [];
        for (let id in this.items) {
            this.items[id].tour.price = parseFloat(this.items[id].tour.price).toFixed(2);
            this.items[id].totalPrice = parseFloat(this.items[id].totalPrice).toFixed(2);
            arr.push(this.items[id]);
        }
        return arr;
    };

    getCart() {
        return {
            items: this.#generateArray(),
            quantity: this.quantity,
            subtotal: this.subtotal,
            total: this.total,
            shipping: parseFloat(this.shipping).toFixed(2),
            discount: parseFloat(this.discount).toFixed(2),
            couponCode: this.couponCode,
            paymentMethod: this.paymentMethod,
            shippingAddress: this.shippingAddress
        }
    }
}

module.exports = Cart;