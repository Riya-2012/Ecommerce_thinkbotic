"use client";

import ProductSlider from "@/app/components/home/Slider";
import TopRatedProducts from "@/app/components/home/TopRated";
import { useAuth } from "@/app/context/AuthContext";
import api, { BASE_URL } from "@/app/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, use, useEffect } from "react";
import {
  FaStar, FaStarHalfAlt, FaRegStar,
  FaShoppingCart, FaBolt, FaChevronDown,
  FaChevronUp, FaCheckCircle, FaShieldAlt,
  FaTags, FaTruck, FaUserCircle,
  FaArrowRight
} from "react-icons/fa";

export default function Page({ params }) {
  const { id } = use(params);

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const [activeIndex, setActiveIndex] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
const [product, setProduct] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [relatedProducts, setRelatedProducts] = useState([]);

const {user}=useAuth();
useEffect(() => {

  const fetchProductDetails = async () => {

    try {

      const { data } = await api.get(
        `/api/comman/productdetails/${id}`
      );

      console.log(data);

      setProduct(data.productDetails);
  const formattedProducts = data.relatedProducts.map((item) => ({

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

      setRelatedProducts(formattedProducts);

    } catch (err) {

      setError(
        "Failed to fetch product details."
      );

    } finally {

      setLoading(false);

    }
  };

  fetchProductDetails();

}, [id]);

const currentImageSet =
  product.images?.[selectedColorIdx]?.imageSet
  || [product.img];

const [selectedImage, setSelectedImage] =
  useState("");

useEffect(() => {

  if (currentImageSet?.length > 0) {

    setSelectedImage(
      currentImageSet[0]
    );

  }

}, [product, selectedColorIdx]);

/*  SAFE IMAGE URL */
const imageUrl = selectedImage
  ? selectedImage.startsWith("http")
    ? selectedImage
    : `${process.env.NEXT_PUBLIC_API_URL}/${selectedImage}`
  : "/product-1.jpg";
  const router=useRouter();

  const handleColorChange = (idx) => {
    setSelectedColorIdx(idx);
  setSelectedImage(
  product.images?.[idx]?.imageSet?.[0]
);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">


        <div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-24 lg:h-fit ">
          <div>
            <p className="text-[13px] text-gray-500 mb-[2px] font-medium tracking-wide">
              <Link href="/"> <span className="hover:text-primary-blue cursor-pointer transition">Home</span></Link> / <Link href="/products"><span className="hover:text-primary-blue cursor-pointer transition">Shop</span></Link> / <span className="text-primary-blue font-bold">{product.name}</span>
            </p>

          </div>
          {/* MAIN IMAGE */}
          <div className="relative w-full md:w-[700px] lg:w-full h-full h-[350px] md:h-[350px] sm:h-[200px] lg:h-[500px]  bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden group md:mx-8 lg:mx-0 ">
            <div className="relative w-[900px] h-[300px] md:h-[400px] lg:h-[900px]  transition-transform duration-500 ease-out group-hover:scale-105">
              <Image
              unoptimized
                src={imageUrl}
                fill
                priority
                className="object-cover drop-shadow-xl"
                alt={product.name}
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-6 left-8 flex flex-col gap-2">
              {product.discount > 0 && (
                <span className="bg-primary-red text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  -{product.discount}%
                </span>
              )}
              {product.stockStatus === 'in-stock' ? (
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  In Stock
                </span>
              ) : (
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  Few Left
                </span>
              )}
            </div>
          </div>


          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 justify-start sm:justify-center">
            {/* {currentImageSet.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 overflow-hidden transition-all duration-300 flex-shrink-0 bg-white ${selectedImage === img ? 'border-primary-blue ring-4 ring-blue-50 scale-105 shadow-sm' : 'border-transparent border-gray-100 hover:border-gray-300 hover:scale-105'
                  }`}
              >
                <Image
                  src={img}
                  fill
                  className="object-contain p-3"
                  alt={`${product.name} thumbnail ${i + 1}`}
                />
              </button>
            ))} */}
            {currentImageSet
  ?.filter((img) => img && img.trim() !== "")
  .map((img, i) => {

    const thumbUrl = img.startsWith("http")
      ? img
      : `${process.env.NEXT_PUBLIC_API_URL}/${img}`;

    return (

      <button
        key={i}
        onClick={() => setSelectedImage(img)}
        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 overflow-hidden transition-all duration-300 flex-shrink-0 bg-white ${
          selectedImage === img
            ? "border-primary-blue ring-4 ring-blue-50 scale-105 shadow-sm"
            : "border-transparent border-gray-100 hover:border-gray-300 hover:scale-105"
        }`}
      >

        <Image
        unoptimized
          src={thumbUrl}
          fill
          className="object-contain p-3"
          alt={`${product.name} thumbnail ${i + 1}`}
        />

      </button>

    );
  })}
          </div>
        </div>


        <div className="lg:col-span-6 flex flex-col gap-6  max-h-[1400px] no-scrollbar ">

          {/* TITLE & BRAND */}
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="text-primary-blue font-bold tracking-wider text-xs uppercase bg-blue-50 px-3 py-1 rounded-full">
                {product.Brand}
              </span>
              {/* <span className="text-primary-red px-3 py-1 rounded-full bg-red-50 text-sm font-medium">{product.stock} left in stock</span> */}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
              {product.name}
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              {product.descriptions}
            </p>
          </div>

          {/* RATINGS */}
          <div className="flex items-center gap-3 bg-white w-fit px-4 py-2 rounded-full border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition" onClick={() => document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' })}>
            <div className="flex gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="font-bold text-gray-900">{product.rating}</span>
            <span className="text-gray-400 text-sm underline decoration-gray-300 decoration-dotted underline-offset-4">({product.ratingCount} reviews)</span>
          </div>

         
          {/* PRICING */}

          <div>
            <div className="flex items-end gap-4 mb-2">
              <span className="text-4xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                ₹{product.price}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through font-medium mb-1.5">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>
            <p className="text-sm text-green-600 font-medium flex items-center gap-1">
              <FaCheckCircle className=" text-green-600" /> Inclusive of all taxes (GST {product.gst}%)
            </p>
          </div>

          {/* COLORS */}
          {product.images && product.images.length > 0 && (
            <div>
              <div className="flex justify-between items-end mb-3">
                <h3 className="text-gray-900 font-semibold">Select Color</h3>
                {/* <span className="text-primary-blue text-sm font-medium">{product.images[selectedColorIdx].imageColor}</span> */}
              </div>
              <div className="flex flex-wrap gap-4">
                {product.images.map((imgObj, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleColorChange(idx)}
                    className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      selectedColorIdx === idx 
                        ? "ring-2 ring-offset-4 ring-primary-blue scale-110 shadow-md" 
                        : "ring-1 ring-gray-200 hover:scale-105 hover:ring-gray-300"
                    }`}
                    style={{ backgroundColor: imgObj.imageColor}}
                    title={imgObj.imageColor}
                    
                  >
{/*                     
                    {selectedColorIdx === idx && (
                      <FaCheckCircle className={`text-xl ${imgObj.colorCode === '#f8fafc' || imgObj.colorCode === '#ffffff' ? 'text-gray-800' : 'text-white drop-shadow-md'}`} />
                    )} */}
                    
                  </button>
                  
                ))}
                 
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm hover:border-gray-200 transition">
                <button 
                  onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                  className="px-3 py-2 text-gray-400 hover:text-primary-blue hover:bg-blue-50 transition-colors text-lg font-medium"
                >
                  −
                </button>
                <span className="w-4 text-center font-bold text-gray-900 text-lg">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty < product.stock ? qty + 1 : product.stock)}
                  className="px-3 py-2 text-gray-400 hover:text-primary-blue hover:bg-blue-50 transition-colors text-lg font-medium"
                >
                  +
                </button>
              </div>
              {product.stock < 20 && (
                <span className="text-sm text-primary-red font-medium bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                  Hurry! Only {product.stock} left
                </span>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button className=" bg-white border-2 border-primary-red text-primary-red hover:bg-primary-blue hover:scale-[1.02] hover:border-primary-blue hover:text-white py-3 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
              <FaShoppingCart /> Add to Cart
            </button>
            
            <button className="bg-gradient-blue-red  text-white py-3 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg  hover:shadow-xl hover:scale-[1.02]">
              <FaBolt /> Buy It Now
            </button>
          </div>

          {/*  BULK & CUSTOM ORDER */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

  {/* BULK ORDER */}
  <button className="group relative overflow-hidden shadow-sm bg-blue-50 hover:bg-primary-blue rounded-md  p-5 transition-all duration-300 text-left" onClick={()=>{
    router.push("/productInquiry?type=bulk")
  }} >

    <div className="relative z-10">
    <h3 className="font-bold text-primary-blue group-hover:text-white text-lg transition">
        Bulk Order
      </h3>

      <p className="text-sm text-gray-600 group-hover:text-white/80 mt-1 transition">
        Get special pricing on large quantity purchases.
      </p>
    </div>

    {/* Glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-primary-blue to-blue-600 opacity-0 group-hover:opacity-100 transition duration-300"></div>

  </button>

  {/* CUSTOM ORDER */}

  <button className="group relative overflow-hidden shadow-sm  bg-red-50 hover:bg-primary-red rounded-2xl p-5 transition-all duration-300 text-left" onClick={()=>{router.push("/productInquiry?type=custom")}}>

    <div className="relative z-10">
      <h3 className="font-bold text-primary-red group-hover:text-white text-lg transition">
        Custom Order
      </h3>

      <p className="text-sm text-gray-600 group-hover:text-white/80 mt-1 transition">
        Customize product design, branding, or packaging.
      </p>
    </div>

    {/* Glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-primary-red to-red-500 opacity-0 group-hover:opacity-100 transition duration-300"></div>

  </button>


</div>

          {/* TRUST BADGES */}
          <div className="grid grid-cols-2 gap-4 mt-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue shrink-0">
                <FaTruck size={20} />
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900">Free Delivery</p>
                <p className="text-gray-500 text-xs">Orders over ₹500</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50  flex items-center justify-center text-green-600 shrink-0">
                <FaShieldAlt size={20} />
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900">1 Year Warranty</p>
                <p className="text-gray-500 text-xs">100% Authentic</p>
              </div>
            </div>
          </div>

          {/* ACCORDION TABS */}
          <div className="mt-4 flex flex-col gap-3">

            {/* Description Tab */}
            <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
              <button
                onClick={() => setActiveTab(activeTab === "description" ? "" : "description")}
                className="w-full flex justify-between items-center p-5 font-bold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Product Description
                {activeTab === "description" ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
              </button>
              <div className={`px-5 overflow-hidden transition-all duration-300 ${activeTab === "description" ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="text-gray-600 leading-relaxed">
                  {product.productDescription}
                </p>
              </div>
            </div>

            {/* Specifications Tab */}
            <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
              <button
                onClick={() => setActiveTab(activeTab === "specs" ? "" : "specs")}
                className="w-full flex justify-between items-center p-5 font-bold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Specifications
                {activeTab === "specs" ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
              </button>
              <div className={`px-5 overflow-hidden transition-all duration-300 ${activeTab === "specs" ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex flex-col gap-3 mt-2">
                  {product.specifications?.map((spec, i) => (
                    <div key={i} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500">{spec.key}</span>
                      <span className="font-semibold text-gray-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Offers Tab */}
            <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
              <button
                onClick={() => setActiveTab(activeTab === "offers" ? "" : "offers")}
                className="w-full flex justify-between items-center p-5 font-bold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Available Offers
                {activeTab === "offers" ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
              </button>
              <div className={`px-5 overflow-hidden transition-all duration-300 ${activeTab === "offers" ? "max-h-[500px] pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                <ul className="flex flex-col gap-4 mt-2">
                  {product.offers?.map((offer, i) => (
                    <li key={i} className="flex gap-3 text-sm bg-green-50/50 p-3 rounded-xl border border-green-100">
                      <FaTags className="text-green-500 shrink-0 mt-0.5 text-base" />
                      <div>
                        <span className="font-bold text-green-800 block mb-1">{offer.key}</span>
                        <span className="text-green-700/80">{offer.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      </div>


      {/*Other info  */}
      <div>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-10 pt-12">


          <div className="relative mb-8">
            <h1 className="text-2xl font-bold text-[#0f172a]">
              Other Information
            </h1>

            <span className="absolute left-0 top-9 w-40 h-[2px] bg-gradient-blue-red rounded-full"></span>
          </div>


          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {product.otherinfo?.map((info, index) => (
              <div
                key={index}
                className="grid grid-cols-2 lg:grid-col-3 px-6 py-4 border-b border-gray-100 last:border-0"
              >
                <p className="text-gray-500 font-medium">
                  {info.key}
                </p>


                <p className="text-[#0f172a] font-semibold ">
                  {info.value}
                </p>

              </div>
            ))}

          </div>

        </div>
      </div>

      {/* faq */}
      <div>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-10">

          <div className="relative">
            <h1 className="text-3xl font-bold">
              Frequently Asked Question
            </h1>

            <span className="absolute left-4 top-20 md:top-11 lg:top-11 w-[100px] md:w-[300px] lg:w-[300px] h-[2px] bg-gradient-blue-red rounded-full"></span>
          </div>

          <div className="flex flex-col   gap-3 mt-12">

            {product.quesAns?.map((ques, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition"
              >

                <button
                  onClick={() =>
                    setActiveIndex(activeIndex === i ? null : i)
                  }
                  className="w-full flex justify-between items-center p-5 font-bold text-gray-500"
                >
                  {ques.key}

                  {activeIndex === i ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>

                <div
                  className={`px-5 overflow-hidden transition-all duration-300 ${activeIndex === i
                    ? "max-h-96 pb-5 opacity-100"
                    : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="mt-2">
                    <p className="text-gray-700">{ques.value}</p>
                  </div>
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>



      {/* CUSTOMER REVIEWS SECTION */}
      <div id="reviews" className="max-w-[1400px] mx-auto px-4 lg:px-10 py-12">
        <div className="relative flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Customer Reviews</h2>

          <span className="absolute left-4 top-10 w-[200] h-[2px]  bg-gradient-blue-red rounded-full"></span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-[60px]">


          <div className="lg:col-span-4 h-fit bg-white p-8 rounded-3xl border  border-gray-200 shadow-sm flex flex-col items-center justify-center text-center md:mx-8 lg:mx-0">
            <span className="text-5xl font-bold text-gray-900">{product.rating}</span>
            <div className="flex text-yellow-400 text-l my-2 gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-gray-500 text-sm font-medium mb-4">Based on {product.ratingCount} reviews</span>


            <div className="w-full flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 font-medium w-3">{star}</span>
                  <FaStar className="text-yellow-400 w-4" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 6 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="lg:col-span-8 flex flex-col gap-6">
            {product.reviews?.map((review, i) => (

            <div key={i} className="bg-white px-6 py-3 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary-blue text-xl font-bold">
                    JD
                  </div>

                  <div>

                    <h4 className="font-bold text-gray-900 text-base">{review.userId?.firstname} {review.userId?.lastname}</h4>

                    <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">
                      <FaCheckCircle /> Verified
                    </p>
                   <div className="flex text-yellow-400 text-sm gap-1 mb-1 mt-2 justify-end">

    {[...Array(5)].map((_, idx) => (

      <FaStar
        key={idx}
        className={
          idx < review.rating
            ? "text-yellow-400"
            : "text-gray-300"
        }
      />

    ))}

  </div>
                  </div>
                </div>
                <div className="text-right">

                 
                </div>
              </div>
              <h5 className="font-bold text-gray-900 mb-1 !mt-0">{review.key}</h5>
              <p className="text-gray-600 leading-relaxed">
                {review.value}
              </p>
            </div>
         
            ))}

            {/* <button className="w-full py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors">
              Load More Reviews
            </button> */}

          </div>
        </div>
      </div>

      {/* similiar product */}
      <div className="max-w-[1400px] mx-auto px-0  lg:px-10 py-12">
        <div className="flex items-center justify-between mb-10">

          <div className="ps-3 relative">


            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
              Similiar Products
            </h2>
            <span className="absolute left-5 top-10 w-[200] h-[2px]  bg-gradient-blue-red rounded-full"></span>
          </div>

          <div className="flex me-6 items-center gap-1 text-primary-blue hover:underline cursor-pointer">
            <button className="text-md font-bold">
              View All
            </button>
            <FaArrowRight />
          </div>

        </div>

        <div className="flex justify-center items-center">
          <ProductSlider products={relatedProducts} />
        </div>

      </div>
    </div>
  );
}
