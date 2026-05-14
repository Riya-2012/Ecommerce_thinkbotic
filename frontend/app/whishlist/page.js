"use client";

import { use, useEffect, useState } from "react";
import ProductCard from "../components/home/Card";
import { FaHeartBroken } from "react-icons/fa";
import Link from "next/link";
import api, { BASE_URL } from "../lib/axios";
import toast from "react-hot-toast";


// const initialWishlist = [
//   {
//     id: 1,
//     image: "/product-1.jpg",
//     title: "Smart Watch Elite",
//     category: "Electronics",
//     price: 2999,
//     oldPrice: 3999,
//     rating: 5,
//   },
//   {
//     id: 2,
//     image: "/product-2.jpg",
//     title: "Pro Noise-Canceling Headphones",
//     category: "Audio",
//     price: 1299,
//     oldPrice: 1999,
//     rating: 4,
//   },
//   {
//     id: 3,
//     image: "/product-1.jpg",
//     title: "Urban Sneakers X1",
//     category: "Fashion",
//     price: 1999,
//     oldPrice: 2499,
//     rating: 3,
//   },
// ];



export default function WishlistPage() {


  const [wishlistItems, setWishlistItems] = useState();


const getWishlist = async()=>{
  try{
const response=await api.get(`api/user/wishlist`);
console.log( "whislist products",response.data);
   const formattedProducts = response.data.map((item) => ({

          id: item._id,

          image:  `${BASE_URL}/${item.img}`,

          title: item.name,

          category: item.category,

          price: item.price,

          oldPrice: item.oldPrice,

          rating: Math.round(item.rating || 4),

          discount: item.discount,

          brand: item.Brand,

        }));
setWishlistItems(formattedProducts);
  }
  catch(error){
    console.error("Error fetching wishlist:", error);
  }
}
useEffect(()=>{
  getWishlist();
}, []);

// remove from wishlist
  const handleRemoveFromWishlist = async (productId) => {
        try {
            await api.delete(`api/user/wishlist/${productId}`);
            getWishlist();
            toast.success("Product removed from wishlist!");
        } catch (error) {
            toast.error("Failed to remove product from wishlist!");
        }
    };


  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      
     
      <div className="bg-white border-b border-gray-100 py-4 px-4 lg:px-10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div>
            <p className="text-xs text-gray-500 mb-1.5 font-medium tracking-wide">
              <Link href="/" className="hover:text-primary-blue transition">Home</Link> / 
              <span className="text-[#0f172a] font-bold ml-1">Wishlist</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] flex items-center gap-3">
              My Wishlist
              <span className="text-sm font-medium bg-primary-red/10 text-primary-red px-3 py-1 rounded-full">
                {wishlistItems ? wishlistItems.length : 0} items
              </span>
            </h1>
          </div>
          
    
          {wishlistItems && wishlistItems.length > 0 && (
            <button className="w-full md:w-auto bg-gradient-blue-red text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:scale-105 transition duration-300">
              Move All to Cart
            </button>
          )}
          
        </div>
      </div>

    
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 mt-8">
        
        {wishlistItems && wishlistItems.length > 0 ? (
            
          /*  WISHLIST GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative group">
                <ProductCard {...item} />
                
            
                <button 
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-600 hover:text-white hover:bg-primary-red px-3 py-1.5 rounded-full text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition duration-300 z-10"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
        ) : (
            
          /*  EMPTY STATE */
          <div className="bg-white rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[450px] border border-gray-100 shadow-sm mt-4">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <FaHeartBroken className="text-primary-red/40 text-5xl" />
            </div>
            
            <h3 className="text-3xl font-bold text-[#0f172a] mb-3">Your wishlist is empty</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed text-lg">
              Looks like you haven't found anything you love yet. Explore our collections and find something perfect!
            </p>
            
            <Link href="/products">
              <button className="bg-gradient-blue-red text-white px-10 py-3.5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-primary-blue/20">
                Continue Shopping
              </button>
            </Link>
          </div>
          
        )}

      </div>
    </div>
  );
}
