"use client";

import React from "react";

import {
  useRouter
} from "next/navigation";

import {
  useCart
} from "@/app/context/CartContext";

function BuyNow({

  product
}) {

  const router =
    useRouter();

  const {
    addToCart
  } = useCart();

  const handleBuyNow =
    async (e) => {

      e.preventDefault();

      e.stopPropagation();

      await addToCart({

        _id:
          product.id ||

          product._id,

        title:
          product.title,

        image:
          product.image,

        price:
          product.price,

        oldPrice:
          product.oldPrice,

        category:
          product.category,

        quantity: 1,
      });

      // GO TO CART

      router.push(
        "/cart"
      );
    };

  return (

    <button

      onClick={
        handleBuyNow
      }

      className="bg-gradient-blue-red text-white px-6 py-2 rounded-full text-xs font-medium shadow hover:opacity-90 transition"
    >

      Buy Now

    </button>
  );
}

export default BuyNow;