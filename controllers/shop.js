const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
<<<<<<< Updated upstream
    Product.findAll().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    }).catch(error => {
        console.log(error)
=======
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
>>>>>>> Stashed changes
    });
};

exports.getProduct = (req, res, next) => {
<<<<<<< Updated upstream
    const prodId = req.params.productId;
    Product.findByPk(prodId).then((product) => {
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
    Product.findAll().then(products => {
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
        .then(cart => {
            return cart.getProducts()
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
        })
        .catch(error => {
            console.log(error);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({where: {id: prodId}})
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            let newQuantity = 1;
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return fetchedCart.addProduct(product, {through: {quantity: newQuantity}})
            }
            return Product.findByPk(prodId)
                .then(product => {
                    return fetchedCart.addProduct(product, {through: {quantity: newQuantity}})
                })
                .catch(error => {
                    console.log(error);
                })
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        })
};

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({where: {id: prodId}});
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        })
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(error => {console.log(error)})
};

exports.postOrders = (req, res, next) => {
    let fetchCart;
    req.user.getCart()
        .then(cart => {
            fetchCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                            product.orderItem = {quantity: product.cartItem.quantity};
                            return product;
                        })
                    );
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .then(result => {
            return fetchCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(error => {
            console.log(error)
        });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
=======
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
>>>>>>> Stashed changes
};
