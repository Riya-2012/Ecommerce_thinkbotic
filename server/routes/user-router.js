const express = require("express");
const userController = require("../controllers/User-Controller");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");

const router = express.Router();

/*=================================
          .User Address Routes
====================================*/
router.route("/addresses/:userId") // Ensure this route matches the frontend request
    .get(authMiddleware, userController.getAllAddresses); // Fetch all addresses for a user

router.route("/addresses") // Update this route to match the frontend POST request
    .post(authMiddleware, userController.createAddress); // Create a new address

router.route("/address/:id")
    .get(authMiddleware, userController.getAddressById)
    .put(authMiddleware, userController.updateAddressById)
    .delete(authMiddleware, userController.deleteAddressById);

/*=================================
           Cart-router
===================================*/
router.route('/cart').get(authMiddleware, userController.getCart);
router.route('/cart').post(authMiddleware, userController.addToCart);
router.route("/cart/remove/:productId").delete(authMiddleware, userController.removeFromCart);
router.route('/cart/update').post(authMiddleware, userController.updateCart);

// pricing-userController.getCartConfig

router.get("/cart-config", authMiddleware, userController.getCartConfig); // For all users
router.post("/cart-config", authMiddleware, adminMiddleware, userController.updateCartConfig);

/*=================================
           Wishlist-router
====================================*/
router.route('/wishlist').get(authMiddleware, userController.getWishlist);
router.route('/wishlist').post(authMiddleware, userController.addToWishlist);
router.route('/wishlist/:productId').delete(authMiddleware, userController.removeFromWishlist);

/*=================================
          .Order Routes
====================================*/
router.post("/order", authMiddleware, userController.createOrder);
router.get("/orders", authMiddleware, userController.getOrdersByUser);

router.post("/create-order", authMiddleware, userController.createRazorpayOrder);
router.get("/order/:orderId", authMiddleware, userController.getOrderById);

/*=================================
          .Order Routes
====================================*/
router.post("/product/:productId/rate", authMiddleware, userController.rateProduct);
router.get("/product/:productId/my-rating", authMiddleware, userController.getMyProductRating);
router.get("/my-reviews", authMiddleware, userController.getMyReviews);




module.exports = router;
