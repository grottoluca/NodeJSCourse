const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename), 
    'data', 
    'products.json'
);

const readProductFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if(err) {
            return cb([]);
        } 
        return cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        readProductFile(products => {
            products.push(this);
            fs.readFile(p, (err, fileContent) => {
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            })
        });    
    }

    static fetchAll(cb) {
        readProductFile(cb);
    }
}