const Product = require('../models/product');

  // Shop Product list GET
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products, 
        pageTitle: 'All Products', 
        path:'/products'
      });
    })
    .catch(err => {
    console.log(err);
  });
};

 // Product details GET
exports.getProduct = (req,res,next) => {
  const prodId = req.params.productId;
  // Product.findAll({where: {id: prodId }})
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0], 
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product, 
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};
 
// Shop Index GET 
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products, 
        pageTitle: 'Shop', 
        path:'/', 
      });
    })
    .catch(err => {
    console.log(err);
  });
};


exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            path : '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err));    
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: {id: prodId} }); // retrive products with the product id 
    })
    .then(products => { 
      let product; //get array of products
      if(products.length > 0) {
        product = products[0];
      }
      // increasing quantity of the existing product in cart
      if(product) {
        const oldQunatity = product.cartItem.quantity;
        newQuantity = oldQunatity + 1;
        return product;
      }   
      return Product.findByPk(prodId) // if new product is added to the cart  
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));     
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']}) // only works becuase we have relation between orders and products as set up in aap.js
    .then(orders => {
      res.render('shop/orders', {
        path : '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      }); 
    })
    .catch(err => console.log(err));
};