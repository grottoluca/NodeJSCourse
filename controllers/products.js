const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        docTitle: 'Add product', 
        path: '/admin/add-product',
        formsCss: true,
        productCss: true,
        activeAddProduct: true
    });
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProduct = (req, res, next) => {
    const products = Product.fetchAll();
    res.render('shop', {
        prods: products, 
        docTitle: 'Shop', 
        path: '/shop',
        hasProducts: products.length > 0,
        activeShop: true,
        productCss: true
    });
}