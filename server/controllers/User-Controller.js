const mongoose = require("mongoose");
const Address = require("../models/address-model");
const Cart = require("../models/cart-model");
const Wishlist = require("../models/wishlist-model");
const ProductPage = require("../models/productPage-model");
const Order = require("../models/order-model");
const CartConfig = require("../models/pricing-model");

const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: "rzp_test_EIiCOx00HCTIgi",
  key_secret: "nzXPcqAX7uANKo84SXvfI3kr",
});

// Get all addresses for a user

const getAllAddresses = async (req, res, next) => {
  try {
    const { userId } = req.params; 
    const addresses = await Address.find({ userId }); 
    if (!addresses || addresses.length === 0) {
      return res.status(200).json([]); 
    }
    return res.status(200).json(addresses); 
  } catch (error) {
    next(error); 
  }
};

// Get a single address by ID
const getAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);
    if (!address) {
      return res.status(200).json(null); // Return null if the address is not found
    }
    return res.status(200).json(address);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

// Create a new address
const createAddress = async (req, res, next) => {
  try {
    const {
      userId,
      fullName,
      businessName,
      gst,
      address,
      street,
      landmark,
      city,
      state,
      zipCode,
      mobile,
      altMobile,
      type,
    } = req.body;

    // Check only required fields
    if (!userId || !fullName || !address || !street || !city || !state || !zipCode || !mobile || !type) {
      return res.status(400).json({ msg: "All required fields must be provided" });
    }

    const newAddress = new Address({
      userId,
      fullName,
      businessName,
      gst,
      address,
      street,
      landmark,
      city,
      state,
      zipCode,
      mobile,
      altMobile,
      type,
    });

    await newAddress.save();
    return res.status(201).json({ msg: "Address created successfully", data: newAddress });
  } catch (error) {
    next(error);
  }
};

// Update an address by ID
const updateAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedAddress = await Address.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedAddress) {
      return res.status(404).json({ msg: "Address not found" });
    }
    return res.status(200).json({ msg: "Address updated successfully", data: updatedAddress });
  } catch (error) {
    next(error);
  }
};

// Delete an address by ID
const deleteAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAddress = await Address.findByIdAndDelete(id);
    if (!deletedAddress) {
      return res.status(404).json({ msg: "Address not found" });
    }
    return res.status(200).json({ msg: "Address deleted successfully" });
  } catch (error) {
    next(error);
  }
};
// function to get cart 
const getCart = async (req, res) => {

  const userId = req.userID;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        items: cart.items || [],
        cartDiscount: 0,
        deliveryFee: 0,
        gatewayCharges: 0,
        gst: 0,
        appliedCoupon: "",
        availableCoupons: []
      });
    }

    res.status(200).json(cart); // ✅ Return full cart object
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};



// Add an item to the cart

const addToCart = async (req, res) => {
  console.log("--------------")
  const { productId, quantity } = req.body;
  const userId = req.userID; // from auth middleware

  try {
    let cart = await Cart.findOne({ userId }); // ✅ Find cart for this user
    const product = await ProductPage.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ msg: "Insufficient stock" });
    }

    if (!cart) {
      // ✅ Create cart if it doesn't exist
      cart = new Cart({
        userId,
        items: [{
          productId,
          quantity,
          price: product.price,
          name: product.name,
          img: product.img,
          imageColor: req.body.imageColor || product.images?.[0]?.imageColor || "", // <-- FIXED
          oldPrice: product.oldPrice || 0,
          gst: product.gst || 0,
          description: product.descriptions || "",
        }],
      });
    } else {
      // ✅ Update existing cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity; // Increment quantity
      } else {
        cart.items.push({
          productId,
          quantity,
          price: product.price,
          name: product.name,
          img: product.img,
          imageColor: req.body.imageColor || product.images?.[0]?.imageColor || "", // <-- FIXED
          oldPrice: product.oldPrice || 0,
          gst: product.gst || 0,
          description: product.descriptions || "",
        });
      }
    }

    await cart.save();
    return res.status(200).json({ msg: "Product added to cart", cart });

  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({ error: "Failed to add product to cart" });
  }
};


// Remove an item from the cart
const removeFromCart = async (req, res) => {
  const userId = req.userID; // from auth middleware
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    return res.status(200).json({ msg: "Product removed from cart", cart });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res.status(500).json({ error: "Failed to remove product from cart" });
  }
};


// Update the cart (e.g., for checkout)
const updateCart = async (req, res) => {
  const userId = req.userID;
  const { cartItems } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    cart.items = cartItems;
    await cart.save();
    return res.status(200).json({ msg: "Cart updated", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: "Failed to update cart" });
  }
};

// Get all wishlist items
const getWishlist = async (req, res) => {
  const userId = req.userID;

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate("products");

    if (!wishlist) {
      return res.status(200).json([]); // Empty array if no wishlist
    }

    res.status(200).json(wishlist.products); // Return only products array
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};


// Add product to wishlist
const addToWishlist = async (req, res) => {
  const userId = req.userID; // Coming from auth middleware
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      } else {
        return res.status(200).json({ msg: "Product already in wishlist" });
      }
    }

    await wishlist.save();
    res.status(200).json({ msg: "Added to wishlist", wishlist });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
};


// Remove an item from the wishlist
const removeFromWishlist = async (req, res) => {
  const userId = req.userID;
  const { productId } = req.params; // Taking from URL params

  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    

    await wishlist.save();
    res.status(200).json({ msg: "Removed from wishlist", wishlist });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
};

// Create Razorpay order (for frontend to get order_id)
const createRazorpayOrder = async (req, res) => {
   
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay order error:", error); // <--- Add this line
 res.status(500).json({
  error: error.message
});
console.error(error);
  }
};

const createOrder = async (req, res) => {
  

  try {
    const { userId, shippingAddress, billingAddress, items, orderSummary, payment } = req.body;
    // const safePayment = {
    //   ...payment,
    //   pricingDetails: Array.isArray(payment?.pricingDetails) ? payment.pricingDetails : [],
    //   appliedCoupon: payment?.appliedCoupon || null,
    // };
const safePayment = {
      ...(payment || {}),
      pricingDetails: Array.isArray(payment?.pricingDetails)
        ? payment.pricingDetails
        : [],
      appliedCoupon: payment?.appliedCoupon || null,
    };

    for (const item of items) {
      const product = await ProductPage.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }
      // Check if enough stock is available
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product: ${product.name}` });
      }
      product.stock -= item.quantity;
      if (product.stock === 0) {
        product.stockStatus = "out-of-stock";
      } else if (product.stock < 5) {
        product.stockStatus = "few-left";
      } else {
        product.stockStatus = "in-stock";
      }
      await product.save();
    }

    const order = new Order({
      userId,
      shippingAddress,
      billingAddress,
      items: items.map(item => ({
        ...item,
        imageColor: item.imageColor // <-- Make sure this is present
      })),
      orderSummary,
      payment: safePayment
    });
    await order.save();

    // Remove all items from user's cart after successful order
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } }
    );

    res.status(201).json({ msg: "Order placed successfully", order });
  } catch (error) {
      console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.userID;
    const orders = await Order.find({ userId })
      // .populate("address.id") // <-- Remove this line
      .populate("items.productId");

    // Add fallback for each order
    const safeOrders = orders.map(order => {
      if (!order.payment) order.payment = {};
      if (!Array.isArray(order.payment.pricingDetails)) order.payment.pricingDetails = [];
      if (!order.payment.appliedCoupon) order.payment.appliedCoupon = null;
      return order;
    });

    res.status(200).json(safeOrders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("items.productId");
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Fallback for missing pricingDetails
    if (!order.payment) order.payment = {};
    if (!Array.isArray(order.payment.pricingDetails)) order.payment.pricingDetails = [];
    if (!order.payment.appliedCoupon) order.payment.appliedCoupon = null;

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};


const rateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const product = await ProductPage.findById(productId).populate("reviews.userId", "firstname lastname email username");
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Remove previous rating by this user if exists
    product.reviews = product.reviews.filter(
      (r) => r.userId?.toString() !== userId.toString()
    );

    // Add new rating/review
    product.reviews.push({
      userId,
      rating,
      key: req.user?.username || req.user?.email || "Anonymous",
      value: review?.trim() || "",
    });

    // Update aggregate rating
    product.ratingCount = product.reviews.length;
    product.ratingTotal = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    product.rating = product.ratingCount > 0 ? parseFloat((product.ratingTotal / product.ratingCount).toFixed(1)) : 0;

    await product.save();

    res.status(200).json({ msg: "Rating submitted", rating: product.rating });
  } catch (error) {
    res.status(500).json({ error: "Failed to rate product" });
  }
};

const getMyProductRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const product = await ProductPage.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const userReview = product.reviews.find(
      (r) => r.userId?.toString() === userId.toString()
    );

    if (userReview && userReview.rating) {
      return res.json({ rating: userReview.rating });
    } else {
      return res.json({ rating: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user rating" });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const products = await ProductPage.find({ "reviews.userId": userId });

    const reviews = [];
    products.forEach(product => {
      const userReview = product.reviews.find(r => r.userId?.toString() === userId);
      if (userReview) {
        reviews.push({
          productId: product._id,
          productName: product.name,
          productImg: product.img,
          rating: userReview.rating,
          review: userReview.value,
        });
      }
    });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user reviews" });
  }
};



const getCartConfig = async (req, res) => {
  try {
    let config = await CartConfig.findOne();
    if (!config) {
      config = await CartConfig.create({});
    }
    // Filter out expired coupons
    const now = new Date();
    const validCoupons = config.availableCoupons.filter(coupon => {
      if (!coupon.validityDays) return true;
      const expiry = new Date(coupon.createdAt);
      expiry.setDate(expiry.getDate() + coupon.validityDays);
      return expiry > now;
    });
    res.status(200).json({ ...config.toObject(), availableCoupons: validCoupons });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart config" });
  }
};

// Update global pricing config (admin only)
const updateCartConfig = async (req, res) => {
  try {
    let config = await CartConfig.findOne();
    if (!config) {
      config = await CartConfig.create(req.body);
    } else {
      Object.assign(config, req.body);
      await config.save();
    }
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart config" });
  }
};

module.exports = {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddressById,
  deleteAddressById,

  getCart,
  addToCart,
  removeFromCart,
  updateCart,

  getCartConfig,
  updateCartConfig,

  getWishlist,
  addToWishlist,
  removeFromWishlist,

  createOrder,
  getOrdersByUser,
  getOrderById,
  createRazorpayOrder,

  rateProduct,
  getMyProductRating,
  getMyReviews,

};
