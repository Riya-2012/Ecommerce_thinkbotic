"use client";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import api, { BASE_URL } from "@/app/lib/axios";
import { useAuth } from "@/app/context/AuthContext";

function CardContent({ item, textPosition = "bottom-left" }) {
  const pos =
    textPosition === "top-left"
      ? "top-4 left-4"
      : "bottom-4 left-4";
  return (
    <div className={`absolute ${pos} text-white z-10`}>
      <p className="text-xs uppercase opacity-75">{item.category}</p>
      <h3 className="text-sm font-semibold mt-0.5">{item.name}</h3>
      <span className="text-xs opacity-80">Shop Now →</span>
    </div>
  );
}

// Normal full card
function ProductCard({ item }) {
  return (
    <Link href={`/products/${item._id}`} className="block w-full h-full">
      <div className="relative w-full h-full rounded-3xl overflow-hidden group cursor-pointer">
        <Image src={`${BASE_URL}/${item.img}`} alt={item.name} fill unoptimized
          className="object-cover group-hover:scale-110 transition duration-500" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
        <CardContent item={item} textPosition="bottom-left" />
      </div>
    </Link>
  );
}

// Split overlap — card1 top-left, card2 bottom-right, overlap in center
// function SplitOverlapCard({ card1, card2 }) {
//   return (
//     <div className="relative w-full h-full rounded-3xl overflow-hidden border-1  border-gray-300">

//       {/* Card 2 — bottom-right (behind) */}
//       <Link href={`/products/${card2._id}`}
//         className="absolute bottom-0 right-0 z-[1] rounded-3xl overflow-hidden"
//         style={{ width: "55%", height: "60%" }}>
//         <div className="relative w-full h-full group cursor-pointer">
//           <Image src={`${BASE_URL}/${card2.img}`} alt={card2.name} fill unoptimized
//             className="object-cover group-hover:scale-105 transition duration-500" />
//           <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition" />
//           <CardContent item={card2} textPosition="bottom-right" />
//         </div>
//       </Link>

//       {/* Card 1 — top-left (in front) */}
//       <Link href={`/products/${card1._id}`}
//         className="absolute top-0 left-0 z-[2] rounded-3xl overflow-hidden"
//         style={{ width: "50%", height: "60%" }}>
//         <div className="relative w-full h-full group cursor-pointer">
//           <Image src={`${BASE_URL}/${card1.img}`} alt={card1.name} fill unoptimized
//             className="object-cover group-hover:scale-110 transition duration-500" />
//           <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
//           <CardContent item={card1}  textPosition="bottom-left" />
//         </div>
//       </Link>

//     </div>
//   );
// }

function SplitOverlapCard({ card1, card2 }) {
  const [front, setFront] = useState("card1");
  const isFront1 = front === "card1";

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg ">

      {/* ── TOP-RIGHT space — card2 info ── */}
      <div className="absolute top-4 right-4 z-[0] text-left text-black max-w-[42%]">
        <p className="text-[10px] uppercase opacity-60 tracking-wider">{card2.category}</p>
        <h4 className="text-sm font-semibold leading-tight mt-0.5 opacity-90">{card2.name}</h4>
        {card2.price && (
          <p className="text-xs opacity-70 mt-0.5">₹{card2.price}</p>
        )}
        {/* <p className="text-[10px] opacity-50 mt-1">tap to view</p> */}
      </div>

      {/* ── BOTTOM-LEFT space — card1 info ── */}
      <div className="absolute bottom-4 left-4 z-[0] text-black max-w-[42%]">
        <p className="text-[10px] uppercase opacity-60 tracking-wider">{card1.category}</p>
        <h4 className="text-sm font-semibold leading-tight mt-0.5 opacity-90">{card1.name}</h4>
        {card1.price && (
          <p className="text-xs opacity-70 mt-0.5">₹{card1.price}</p>
        )}
        {/* <p className="text-[10px] opacity-50 mt-1">tap to view</p> */}
      </div>

      {/* ── Card 2 — bottom-right ── */}
      <div
        className="absolute rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
        style={{
          bottom: "0", right: "0",
          width: "55%", height: "60%",
          zIndex: isFront1 ? 1 : 3,
        }}
        onClick={() => setFront("card2")}
      >
        <div className="relative w-full h-full group">
          <Image src={`${BASE_URL}/${card2.img}`} alt={card2.name} fill unoptimized
            className="object-cover group-hover:scale-105 transition duration-500" />
          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition" />

        
            <Link
              href={`/products/${card2._id}`}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 z-20"
            >
              <button className="   text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-primary-blue hover:text-white transition-all duration-300 shadow">
                Shop Now →
              </button>
            </Link>
        
        </div>
      </div>

      {/* ── Card 1 — top-left ── */}
      <div
        className="absolute rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
        style={{
          top: "0", left: "0",
          width: "55%", height: "60%",
          zIndex: isFront1 ? 3 : 1,
        }}
        onClick={() => setFront("card1")}
      >
        <div className="relative w-full h-full group">
          <Image src={`${BASE_URL}/${card1.img}`} alt={card1.name} fill unoptimized
            className="object-cover group-hover:scale-110 transition duration-500" />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

        
            <Link
              href={`/products/${card1._id}`}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 z-20"
            >
              <button className=" text-white px-3 py-1.5 rounded-full text-xs font-medium  transition-all duration-300 shadow">
                Shop Now →
              </button>
            </Link>
        
        </div>
      </div>

    </div>
  );
}

function EmptySlot() {
  return (
    <div className="w-full h-full rounded-3xl " />
  );
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const fetchProducts = async () => {
      try {
        if (user) {
          const res = await api.get("/api/user/recentlyViewed");
          setProducts((res.data.data || []).slice(0, 5));
        } else {
          const guestProducts =
            JSON.parse(localStorage.getItem("recentlyViewed")) || [];
          setProducts(guestProducts.slice(0, 5));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, [user, loading]);

  if (!products || products.length === 0) return null;

  const count = products.length;

  const slot1 = () => {
    if (count === 0) return <EmptySlot />;
    if (count >= 4) return <SplitOverlapCard card1={products[0]} card2={products[3]} />;
    return <ProductCard item={products[0]} />;
  };

  const slot2 = () => {
    if (count < 2) return <EmptySlot />;
    if (count >= 5) return <SplitOverlapCard card1={products[1]} card2={products[4]} />;
    return <ProductCard item={products[1]} />;
  };

  const slot3 = () => {
    if (count < 3) return <EmptySlot />;
    return <ProductCard item={products[2]} />;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-14 bg-white ">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-primary-red rounded-full" />
              <p className="text-xs font-medium text-primary-red uppercase tracking-wider">
                Explore
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
              Recently viewed
            </h2>
          </div>
          <Link href="/products">
            <div className="flex items-center gap-2 text-primary-blue hover:underline cursor-pointer">
              <button className="text-md font-bold">View All</button>
              <FaArrowRight />
            </div>
          </Link>
        </div>

        {/* 3 slots in a row — slot 1 & 2 large, slot 3 small */}
        <div className="flex gap-6 h-[260px] ">
          <div className="relative flex-[2] min-w-0">{slot1()}</div>
          <div className="relative flex-[2] min-w-0">{slot2()}</div>
          <div className="relative flex-[1] min-w-0">{slot3()}</div>
        </div>

      </div>
    </div>
  );
}