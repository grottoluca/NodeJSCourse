const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
    constructor(title, price, imageUrl, description, id, userId) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userid = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this})
        } else {
            dbOp = db.collection('products').insertOne(this)
        }
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.log(error);
            });

    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(products => {
                return products;
            })
            .catch(error => {
                console.log(error);
            });
    }

    static findById(prodId) {
        const db = getDb();
        return db.collection('products').find({_id: new mongodb.ObjectId(prodId)}).next()
            .then(product => {
                return product;
            })
            .catch(error => {
                console.log(error);
            })
    }

    static deleteById(prodId, userId) {
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
            .then(result => {
                return db.collection('users').updateOne({
                    _id: new mongodb.ObjectId(userId),
                }, {
                    $pull: {'cart.items': {'productId': new mongodb.ObjectId(prodId)}}
                });
            })
            .then(result => {
                console.log("Deleted");
            })
            .catch(error => {
                console.log(error);
            });
    }
}

module.exports = Product;