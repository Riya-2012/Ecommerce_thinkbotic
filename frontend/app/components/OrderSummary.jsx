"use client";

import {

  useEffect,

  useMemo,

  useState,

} from "react";

import Link from "next/link";

import { useCart }
  from "../context/CartContext";
import api from "../lib/axios";

function OrderSummary({

  // pricingConfig = {

  //   cartDiscount: 0,

  //   deliveryFee: 50,

  //   minFreeDeliveryAmount: 5000,

  //   gst: 18,
  // },
showCoupon = true,
 

}) {

  const {

    cartItems,

  } = useCart();

  const [couponInput,
    setCouponInput] =
    useState("");

  const [appliedCoupon,
    setAppliedCoupon] =
    useState(null);


const [showCoupons,
setShowCoupons] =
useState(false);


  const [availableCoupons,
    setAvailableCoupons] =
    useState([]);

  const [pricingConfig,
    setPricingConfig] =
    useState({

      cartDiscount: 0,

      deliveryFee: 0,

      minFreeDeliveryAmount: 0,
    });

  useEffect(() => {

    const fetchConfig =
      async () => {

        try {

          const res =
            await api.get(

              "/api/user/cart-config"
            );

          setPricingConfig({

            cartDiscount:
              res.data.cartDiscount || 0,

            deliveryFee:
              res.data.deliveryFee || 0,

            minFreeDeliveryAmount:
              res.data.minFreeDeliveryAmount || 0,
          });

          setAvailableCoupons(

            res.data.availableCoupons || []
          );

        } catch (error) {

          console.log(error);
        }
      };

    fetchConfig();

  }, []);




  // CART TOTAL

  const cartTotal =
    useMemo(() => {

      return cartItems.reduce(

        (acc, item) =>

          acc +

          item.price *

          (item.quantity || 1),

        0
      );

    }, [cartItems]);


  // OLD PRICE

  const oldPriceTotal =
    useMemo(() => {

      return cartItems.reduce(

        (acc, item) =>

          acc +

          (item.oldPrice ||

            item.price) *

          (item.quantity || 1),

        0
      );

    }, [cartItems]);

  // PRODUCT DISCOUNT

  const productDiscount =

    oldPriceTotal -
    cartTotal;

  // CART DISCOUNT

  const cartDiscount =
    (cartTotal *
      pricingConfig.cartDiscount) /
    100;

  // COUPON DISCOUNT

  const couponDiscount =
    appliedCoupon

      ? (cartTotal *

        appliedCoupon.discount) /
      100

      : 0;

  // DELIVERY

  const deliveryFee =

    cartTotal >=
      pricingConfig.minFreeDeliveryAmount

      ? 0

      : pricingConfig.deliveryFee;

  // GST


  // GST PERCENT

  const avgGstPercent =

    cartItems.length > 0

      ? cartItems.reduce(

        (acc, item) =>

          acc + (item.gst || 0),

        0
      ) / cartItems.length

      : 0;

  // GST AMOUNT

  const gstAmount =

    ((cartTotal -

      cartDiscount -

      couponDiscount) *

      avgGstPercent) /

    100;



  // FINAL TOTAL

  const total =
    cartTotal -

    cartDiscount -

    couponDiscount +

    gstAmount +

    deliveryFee;

  // APPLY COUPON

  const handleApplyCoupon =
    () => {

      const coupon =
        availableCoupons.find(

          (c) =>

            c.code.toLowerCase() ===

            couponInput.toLowerCase()
        );

      if (!coupon) {

        return;
      }

      setAppliedCoupon(coupon);
    };

  return (

    <div className="sticky top-24 bg-white rounded-md border border-gray-100 shadow-sm p-4">

      {/* TITLE */}

      <h2 className="text-2xl font-bold text-[#0f172a] mb-2">

        Order Summary

      </h2>

      {/* PRICE DETAILS */}

      <div className="space-y-2">

        <div className="flex justify-between text-gray-600">

          <span>

            Old Price

          </span>

          <span>

            ₹{oldPriceTotal.toFixed(2)}

          </span>

        </div>

        <div className="flex justify-between text-gray-600">

          <span>

            Cart Total

          </span>

          <span>

            ₹{cartTotal.toFixed(2)}

          </span>

        </div>

        {/* <div className="flex justify-between text-green-600">

          <span>

            Product Discount

          </span>

          <span>

            - ₹{productDiscount.toFixed(2)}

          </span>

        </div> */}

        <div className="flex justify-between text-green-600">

          <span>

            Cart Discount

          </span>

          <span>

            - ₹{cartDiscount.toFixed(2)}

          </span>

        </div>

        <div className="flex justify-between text-green-600">

          <span>

            Coupon Discount

          </span>

          <span>

            - ₹{couponDiscount.toFixed(2)}

          </span>

        </div>

        <div className="flex justify-between text-gray-600">

          <span>
            GST ({avgGstPercent.toFixed(1)}%)
          </span>

          <span>

            ₹{gstAmount.toFixed(2)}

          </span>

        </div>

        <div className="flex justify-between text-gray-600">

          <span>

            Delivery Fee

          </span>

          <span>

            {deliveryFee === 0

              ? "Free"

              : `₹${deliveryFee}`}
          </span>

        </div>

      </div>

      {/* TOTAL */}

      <div className="border-t border-gray-200 my-2"></div>

      <div className="flex justify-between items-center">

        <h3 className="text-xl font-bold text-primary-red">

          Total

        </h3>

        <h3 className="text-xl font-bold text-primary-red">

          ₹{total.toFixed(2)}

        </h3>

      </div>




      {/* COUPON SECTION */}


{/* COUPON SECTION */}

{showCoupon && (

  <div className="mt-8">

    {/* HEADER */}

    <div className="flex items-center justify-between mb-4">

      <h4 className="font-semibold text-[#0f172a]">

        Coupons

      </h4>

      <button
        type="button"
        onClick={() =>

          setShowCoupons(
            !showCoupons
          )
        }
        className="text-primary-red font-medium"
      >

        {showCoupons

          ? "Hide Coupons"

          : "Show Coupons"}
      </button>

    </div>

    {/* APPLIED COUPON */}

    {appliedCoupon && (

      <div className="border border-green-200 bg-green-50 rounded-2xl p-4 flex items-center justify-between mb-4">

        <div>

          <h5 className="font-bold text-green-700">

            {appliedCoupon.code}

          </h5>

          <p className="text-sm text-green-600">

            {appliedCoupon.discount}% OFF Applied

          </p>

        </div>

        <button
          type="button"
          onClick={() =>

            setAppliedCoupon(
              null
            )
          }
          className="text-red-500 font-medium"
        >

          Remove

        </button>

      </div>
    )}

    {/* COUPON LIST */}

    {showCoupons && (

      <div className="space-y-3">

        {availableCoupons.map(
          (coupon, index) => (

            <div
              key={index}
              className={`

border rounded-2xl p-4

flex items-center justify-between

${

appliedCoupon?.code ===
coupon.code

? "border-primary-red bg-red-50"

: "border-gray-200"
}
`}
            >

              {/* LEFT */}

              <div>

                <h5 className="font-bold text-[#0f172a]">

                  {coupon.code}

                </h5>

                <p className="text-sm text-gray-500">

                  {coupon.description ||

                    `${coupon.discount}% OFF`}
                </p>

              </div>

              {/* APPLY */}

              <button
                type="button"
                onClick={() =>

                  setAppliedCoupon(
                    coupon
                  )
                }
                disabled={

appliedCoupon?.code ===
coupon.code
                }
                className="px-4 py-2 rounded-xl bg-gradient-blue-red text-white text-sm font-semibold disabled:opacity-50"
              >

                {appliedCoupon?.code ===
coupon.code

                  ? "Applied"

                  : "Apply"}
              </button>

            </div>
          )
        )}

      </div>
    )}

  </div>
)}




      {/* CHECKOUT */}


    </div>
  );
}

export default OrderSummary;

