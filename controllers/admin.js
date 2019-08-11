const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, imageUrl, description, null, req.user._id);
    product.save().then(result => {
        console.log(result);
        res.redirect('/admin/products')
    }).catch(error => {
        console.log(error);
    })
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        }).catch(error => {
        console.log(error);
    });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImg = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedImg,
        updatedDescription,
        prodId
    );

    return product.save()
        .then(result => {
            console.log('Updated product');
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        })

};

exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch(error => {
        console.log(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const userId = req.user._id;
    Product.deleteById(prodId, userId)
        .then(result => {
            console.log('Destroy product');
            res.redirect('/admin/products')
        })
        .catch(error => {
            console.log(error);
        });
};


