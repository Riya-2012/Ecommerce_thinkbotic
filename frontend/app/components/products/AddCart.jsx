import { useAuth } from '@/app/context/AuthContext';
import api from '@/app/lib/axios';
import React from 'react'
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
function AddCart({ productId, quantity , selectedColor }) {
const { user } = useAuth();
const router = useRouter();
      const handleAddToCart = async () => {
      
        if (!user) {
            toast.error("Please login to add items to cart.");
            router.push("/login");
            return;
        }
        try {
            await api.post(`api/user/cart`, {
                productId,
                quantity,
                imageColor: selectedColor
            }
            );
            router.push("/cart");
        } catch (error) {
            if (error.response && error.response.status === 401) {
               
            } else {
                console.error("Error adding to cart:", error);
            }
        }
    };

  return (
    <div>
      <button className="bg-white text-primary-blue px-8 py-2 rounded-full text-xs font-medium shadow hover:bg-gray-100 transition"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
              console.log("Add to Cart");
            }}
          >
            Add 
          </button>
    </div>
  )
}

export default AddCart
