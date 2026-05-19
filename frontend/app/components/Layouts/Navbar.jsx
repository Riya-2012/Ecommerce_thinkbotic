"use client";
import { useContext, useEffect, useState } from "react";
import { RiShoppingCart2Line } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { FaSearch, FaPhone, FaBars, FaTimes } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import api, { BASE_URL } from "@/app/lib/axios";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { user, loading } = useAuth();
const [navbar,setNavbar]=useState([]);
  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) {
        setCartCount(0);
        setWishlistCount(0);
        return;
      }

      try {
        const cartResponse = await api.get("/api/user/cart");
        const wishlistResponse = await api.get("/api/user/wishlist");
const NavbarItems=await api.get("/api/comman/navbar");
console.log("Navbar",NavbarItems.data.data)
setNavbar(NavbarItems.data.data || []);

        setCartCount(cartResponse.data.items?.length || 0);
        setWishlistCount(wishlistResponse.data?.length || 0);
      } catch (error) {
        console.error("Error fetching counts:", error);
        setCartCount(0);
        setWishlistCount(0);
      }
    };

    fetchCounts();
  }, [user]);
const logoItem =
  navbar.find(
    (item) =>
      item.label === "LOGO"
  );
  console.log("logo",logoItem)
  return (
    <div>  
      <div className="hidden md:flex border-b px-6 py-1 justify-between bg-gradient-blue-red text-white text-sm">
        <div className="flex">
          <div className="flex items-center gap-2 border-r pr-3">
            <FaPhone /> (+91) 888888888
          </div>
          <div className="flex items-center gap-2 pl-3 ">
            <IoIosMail /> thinkbotic@gmail.com
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaPhone /> Support Available 24/7
        </div>

      </div>

      {/* MAIN NAVBAR */}
      <div className="px-4 md:px-6 py-4 sticky top-0 z-50 bg-white shadow-sm">

        <div className="flex items-center justify-between">

          {/* LEFT: LOGO */}
         {/* <Link href="/"> <Image   src={`${BASE_URL}/uploads/${logoItem.logo}`} height={140} width={140} alt="logo" style={{ width: "auto", height: "auto" }} /></Link> */}
         <Link href="/">

  {logoItem?.logo && (

    <Image
      src={`${BASE_URL}/uploads/${logoItem.logo}`}
      alt="logo"
      width={180}
      height={180}
      unoptimized
     
    />

  )}

</Link>

          {/* DESKTOP SEARCH */}
         {/*  CENTER SEARCH */}
<div className="hidden md:flex flex-1 justify-center px-4 lg:px-8">

  <div className="w-full md:max-w-[260px] lg:max-w-lg border border-primary-blue rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-primary-blue transition bg-white">

    <div className="flex items-center">

      <input
        type="text"
        placeholder="Search products..."
        className="flex-1 px-3 lg:px-4 py-2 text-sm outline-none"
      />

      <button className="flex items-center justify-center px-4 lg:px-6 py-2.5 border-l bg-gradient-blue text-white hover:opacity-90 transition">
        <FaSearch />
      </button>

    </div>

  </div>

</div>

{/*  RIGHT SIDE */}
<div className="hidden md:flex items-center gap-2 lg:gap-8 shrink-0">

  {/* HEART */}
  <div className="relative cursor-pointer">
    <Link href="/whishlist">
      <CiHeart className="text-[22px] lg:text-[24px]" />
    </Link>

    <span className="absolute -top-2 -right-2 bg-primary-red text-white text-[10px] px-1.5 rounded-full">
      {wishlistCount}
    </span>
  </div>

  {/* CART */}
  <div className="relative cursor-pointer">
    <Link href="/cart">
      <RiShoppingCart2Line className="text-[22px] lg:text-[24px]" />
    </Link>

    <span className="absolute -top-2 -right-2 bg-primary-blue text-white text-[10px] px-1.5 rounded-full">
      {cartCount}
    </span>
  </div>

{/* 
  <Link href="/signup">
    <button className="px-3 lg:px-[15px] py-2 lg:py-[10px] bg-primary-red font-bold text-white rounded-full text-xs lg:text-sm whitespace-nowrap transition hover:opacity-90">
      Sign Up
    </button>
  </Link>


  <Link href="/signin">
    <button className="px-3 lg:px-[15px] py-2 lg:py-[10px] font-bold bg-primary-blue text-white rounded-full text-xs lg:text-sm whitespace-nowrap transition hover:opacity-90">
      Sign In
    </button>
  </Link> */}

  {
    user ? (
<Link href="/user">
    <div className="flex items-center gap-3 lg:gap-1 shrink-0">

  <div className="w-9 h-9 rounded-full bg-gradient-blue-red text-white flex items-center justify-center font-semibold text-sm shadow-sm">

    {user?.username?.charAt(0).toUpperCase()}

  </div>

  <span className="text-sm font-medium text-[#0f172a]">

    {user?.username}

  </span>

</div>
</Link>
    ) : (
     
<div className="flex items-center gap-3 lg:gap-5 shrink-0">

  <Link href="/signup">
    <button className="px-3 lg:px-[15px] py-2 lg:py-[10px] bg-primary-red font-bold text-white rounded-full text-xs lg:text-sm whitespace-nowrap transition hover:opacity-90">
      Sign Up
    </button>
  </Link>


  <Link href="/signin">
    <button className="px-3 lg:px-[15px] py-2 lg:py-[10px] font-bold bg-primary-blue text-white rounded-full text-xs lg:text-sm whitespace-nowrap transition hover:opacity-90">
      Sign In
    </button>
  </Link> 


  </div>

    )
  }

</div>

        

          <div className="md:hidden flex items-center gap-4">

            <CiHeart size={22} />
            <RiShoppingCart2Line size={22} />

            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>

          </div>

        </div>

  {/* mobile */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-4 border-t pt-4">

            {/* SEARCH */}
            <div className="flex border rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-3 py-2 outline-none"
              />
              <div className="px-4 flex items-center bg-primary-blue text-white">
                <FaSearch />
              </div>
            </div>

            {/* LINKS */}
            <div className="flex flex-col gap-3 text-sm">
              <p className="cursor-pointer">Home</p>
              <p className="cursor-pointer">Shop</p>
              <p className="cursor-pointer">Collections</p>
              <p className="cursor-pointer">Deals</p>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button className="flex-1 bg-primary-red text-white py-2 rounded-full">
                Sign Up
              </button>
              <button className="flex-1 bg-primary-blue text-white py-2 rounded-full">
                Sign In
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Navbar;