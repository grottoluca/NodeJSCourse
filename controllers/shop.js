const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    }).catch(error => {
        console.log(error)
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then((product) => {
        res.render('shop/product-detail', {
            pageTitle: product.title,
            product: product,
            path: '/product'
        })
    }).catch(err => {
        console.log(err);
    })
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(products => {
            res.render('shop/index', {
                path: '/',
                pageTitle: 'Shop',
                prods: products
            });
        }
    ).catch(error => {
        console.log(error)
    })
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(error => {
            console.log(error);
        })

};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log('Update cart');
            res.redirect('/cart')
        })
        .catch(error => {
            console.log(error);
        })
};

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteCartItem(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        })
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(error => {
            console.log(error)
        })
};

exports.postOrders = (req, res, next) => {
    req.user.addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(error => {
            console.log(error)
        });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};
