import { useAuth } from "@/app/context/AuthContext";
import api from "@/app/lib/axios";
import React, { useState, useEffect } from "react";

import { FaRegHeart, FaHeart } from "react-icons/fa";





const WishlistIcon = ({ productId }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { user } = useAuth();
    useEffect(() => {
        const checkWishlistStatus = async () => {
            try {
                const { data } = await api.get(
                    `/api/user/wishlist`);
                const inWishlist = data.some(item => item._id === productId);
                setIsInWishlist(inWishlist);
            } catch (error) {
                console.error("Error fetching wishlist status", error);
            }
        };
        if (user) checkWishlistStatus();
    }, [productId, user]);

    const toggleWishlist = async () => {
        try {
            if (!user) {
                console.error("User not authenticated");
                return;
            }

            if (isInWishlist) {
                await api.delete(`api/user/wishlist/${productId}`);
                console.log(`Product ${productId} removed from wishlist`);
            } else {
                await api.post(
                    `api/user/wishlist`,
                    { productId }
                   
                );
                console.log(`Product ${productId} added to wishlist`);
            }

            setIsInWishlist(prev => !prev);
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        }
    };

    return (
        <>
            {isInWishlist ? (
                <FaHeart
                    className="text-primary-red"  
                    onClick={ toggleWishlist}
                    title="Remove from wishlist"
                />
            ) : (
                <FaRegHeart
                    className=""
                    onClick={toggleWishlist}
                    title="Add to wishlist"
                />
            )}
        </>
    );
};

export default WishlistIcon;
