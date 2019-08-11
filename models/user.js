const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.log(error);
            })
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cb => {
            return cb.productId.toString() === product._id.toString();
        });
        let quantity = 1;
        const updatedCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            quantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = quantity;
        } else {
            updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: quantity})
        }
        const updatedCart = {items: updatedCartItems};
        const db = getDb();
        return db.collection('users').updateOne(
            {_id: new mongodb.ObjectId(this._id)},
            {
                $set: {
                    cart: updatedCart
                }
            });
    }

    getCart() {
        const db = getDb();
        const prodIds = this.cart.items.map(i => {
            return i.productId;
        });
        return db.collection('products').find({_id: {$in: prodIds}}).toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p, quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    }
                })
            });
    }

    deleteCartItem(prodId) {
        const db = getDb();
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== prodId.toString();
        });
        return db.collection('users').updateOne(
            {_id: new mongodb.ObjectId(this._id)},
            {
                $set: {
                    cart: {items: updatedCartItems}
                }
            });
    }

    addOrder() {
        const db = getDb();
        return this.getCart().then(products => {
            const order = {
                items: products,
                user: {
                    _id: new mongodb.ObjectId(this._id),
                    username: this.username,
                    email: this.email
                }
            };
            return db.collection('orders')
                .insertOne(order)
        }).then(result => {
            this.cart = {items: []};
            return db.collection('users').updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {
                    $set: {
                        cart: {items: []}
                    }
                });
        });
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders')
            .find({'user._id': new mongodb.ObjectId(this._id)})
            .toArray()
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').find({_id: new mongodb.ObjectId(userId)}).next()
            .then(result => {
                return result;
            })
            .catch(error => {
                console.log(error);
            })
    }
}

module.exports = User;