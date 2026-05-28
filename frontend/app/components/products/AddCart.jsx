"use client";

import React from "react";

import toast from "react-hot-toast";

import { useRouter }
from "next/navigation";

import { useAuth }
from "@/app/context/AuthContext";

import { useCart }
from "@/app/context/CartContext";

function AddCart({

  product,

  selectedColor,
  qty=1,
  className=""

}) {

  const { user } =
    useAuth();

  const { addToCart } =
    useCart();

  const router =
    useRouter();

  const handleAddToCart =
    async () => {

      if (!user) {

        toast.error(
          "Please login first"
        );

        router.push(
          "/login"
        );

        return;
      }

      try {

        await addToCart({

          _id:
            product._id,

          title:
            product.title ||
            product.name,

          image:
            product.image ||
            product.img,

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


        router.push(
        "/cart"
      );


      } catch (error) {

        console.log(error);
      }
    };

  return (

    <button

className={`

bg-white
text-primary-blue
px-8
py-2
rounded-full
text-xs
font-medium
shadow
hover:bg-gray-100
transition

${className}
`}

      onClick={(e) => {

        e.preventDefault();

        e.stopPropagation();

        handleAddToCart();
      }}
    >

      Add

    </button>
  );
}

export default AddCart;