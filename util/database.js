const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://Luca:ker998ns@nodeecommerce-sl3pr.mongodb.net/shop?retryWrites=true&w=majority', {useNewUrlParser: true})
        .then(client => {
            console.log('Connected to MongoDB');
            _db = client.db();
            callback();
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No DB found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;