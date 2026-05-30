"use client";

import React from "react";

import {
  useRouter
} from "next/navigation";

import {
  useCart
} from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";



function BuyNow({

  product,

  qty = 1,

  selectedColor,
  className=""

}) {

  const router =
    useRouter();
const {user}= useAuth();
  const {
    addToCart
  } = useCart();

  const handleBuyNow =
    async (e) => {
       if (!user) {

        toast.error(
          "Please login first"
        );

        router.push(
          "/signin"
        );

        return;
      }

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

        quantity: qty,
        imageColor:
selectedColor || "",
      });

      // GO TO CART

      router.push(
        "/cart"
      );
    };

  return (

    <button

      onClick={handleBuyNow}

      className={ `bg-gradient-blue-red text-white px-6 py-2 rounded-full text-xs font-medium shadow hover:opacity-90 transition  ${className} `}
    >

      Buy Now

    </button>
  );
}

export default BuyNow;