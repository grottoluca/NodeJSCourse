const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/product-list', {
            prods: rows,
            pageTitle: 'All Products',
            path: '/products'
        });
    }).catch( err => {
        console.log(err);
    })
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(([product]) => {
        res.render('shop/product-detail', {
            pageTitle: product.title,
            product: product[0],
            path: '/product'
        })
    }).catch(err=> {
        console.log(err);
    })
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/index', {
            path: '/',
            pageTitle: 'Shop',
            prods: rows
        });
    }).catch(err => {
        console.log(err);
    })
};

exports.getCart = (req, res, next) => {
    Cart.fetchAll(cart => {
        Product.fetchAll(products => {
            cartProducts = [];
            for (product of products) {
                const cartProduct = cart.products.find(prod => prod.id === product.id)
                if (cartProduct) {
                    cartProducts.push({productData: product, qty: cartProduct.quantity});
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    })
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart')
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  const price = req.body.productPrice;
  Cart.deleteProduct(prodId, price);
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};
