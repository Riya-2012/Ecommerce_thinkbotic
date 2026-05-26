"use client";

import {

  createContext,

  useContext,

  useEffect,

  useState,

} from "react";

import api from "../lib/axios";

import { useAuth }
from "./AuthContext";

import toast from "react-hot-toast";

const CartContext =
  createContext();

export const CartProvider =
({
  children,
}) => {

  const [cartItems,

  setCartItems] =
    useState([]);

  const [loading,

  setLoading] =
    useState(true);

  const { user } =
    useAuth();

  // FETCH CART

  const fetchCart =
    async () => {

      try {

        // LOGIN USER

        if (user) {

          const res =
            await api.get(
              "/api/user/cart"
            );

          console.log(
            "Cart Data",
            res.data
          );

          setCartItems(

            res.data.items || []
          );
        }

        // GUEST USER

        else {

          const guestCart =
            JSON.parse(

              localStorage.getItem(
                "cart"
              )

            ) || [];

          setCartItems(
            guestCart
          );
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchCart();

  }, [user]);

  // ADD TO CART

  const addToCart =
    async (product) => {

      try {

        // LOGIN USER

        if (user) {

          await api.post(

            "/api/user/cart",

            {
              productId:
                product._id,

              quantity:
                product.quantity || 1,

              imageColor:
                product.imageColor || "",
            }
          );

          // REFETCH

          await fetchCart();
        }

        // GUEST USER

        else {

          let updatedCart =
            [...cartItems];

          const exists =
            updatedCart.find(

              (item) =>

                (item._id ||
                  item.id) ===

                (product._id ||
                  product.id)
            );

          if (exists) {

            toast.error(
              "Already in cart"
            );

            return;
          }

          updatedCart.push(
            product
          );

          localStorage.setItem(

            "cart",

            JSON.stringify(
              updatedCart
            )
          );

          setCartItems(
            updatedCart
          );
        }

        // toast.success(
        //   "Added to cart"
        // );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to add cart"
        );
      }
    };

  // REMOVE FROM CART

  const removeFromCart =
    async (productId) => {

      try {

        // LOGIN USER

        if (user) {

          await api.delete(

            `/api/user/cart/remove/${productId}`
          );

          // REFETCH

          await fetchCart();
        }

        // GUEST USER

        else {

          const updatedCart =
            cartItems.filter(

              (item) =>

                (item._id ||
                  item.id) !==
                productId
            );

          setCartItems(
            updatedCart
          );

          localStorage.setItem(

            "cart",

            JSON.stringify(
              updatedCart
            )
          );
        }

        toast.success(
          "Removed from cart"
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to remove cart item"
        );
      }
    };

  return (

    <CartContext.Provider
      value={{

        cartItems,

        setCartItems,

        addToCart,

        removeFromCart,

        cartCount:
          cartItems.length,

        loading,
      }}
    >

      {children}

    </CartContext.Provider>
  );
};

export const useCart =
  () =>
    useContext(
      CartContext
    );