const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
);

const getCartFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            let cart = {products: [], totalPrice: 0};
            cb(cart);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Cart {

    static fetchAll(cb) {
        getCartFromFile(cb);
    }

    static addProduct(id, productPrice) {
        getCartFromFile(cart => {
            // Analize the cart and find existing product
            let updatedProduct;
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.quantity = updatedProduct.quantity + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, quantity: 1};
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        getCartFromFile(cart => {
            const indexToDelete = cart.products.findIndex(prod => prod.id === id);
            const productToKeep = cart.products.filter(prod => prod.id !== id);
            if (indexToDelete != -1) {
                cart.totalPrice = cart.totalPrice - (productPrice * cart.products[indexToDelete].quantity);
                cart.products = [...productToKeep];
                fs.writeFile(p, JSON.stringify(cart), err => {
                    console.log(err);
                });
            }
        });
    }
}