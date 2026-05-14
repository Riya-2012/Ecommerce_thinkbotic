"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/home/Card";
import { FaFilter, FaStar, FaChevronDown, FaCheck } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import Link from "next/link";
import api, { BASE_URL } from "../lib/axios";
import {
  useSearchParams,
  useRouter
} from "next/navigation";

const Ratings=[ 5,4,3,2,1];

export default function ProductsPage() {
  // search query
const searchParams=useSearchParams();
const router=useRouter();
const category= searchParams.get('category');
const brand=searchParams.get('brands');

const rating = searchParams.get('rating');
  const [allProducts, setAllProducts] = useState([]);
  const [sort, setSort] = useState("default");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [selectedCategory,setSelectedCategory] =useState(category || "All");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [priceRange, setPriceRange] = useState(1000000);
    const [discountRange, setDiscountRange] = useState(0);
const [selectedSubCategory, setSelectedSubCategory] = useState("");
const [openCategory, setOpenCategory] = useState("");
const [selectedBrands,
setSelectedBrands] =
useState(brand || "");

const [selectedRating,
setSelectedRating] =
useState(rating || 0);
const[showBrands,setShowBrands]=useState(false);
const[showRatings,setShowRatings]=useState(false);
const [brands, setBrands] = useState([]);

useEffect(() => {

  const params =
    new URLSearchParams();

  if (
    selectedCategory &&
    selectedCategory !== "All"
  ) {

    params.set(
      "category",
      selectedCategory
    );
  }

  if (selectedBrands) {

    params.set(
      "brand",
      selectedBrands
    );
  }

  if (selectedRating) {

    params.set(
      "rating",
      selectedRating
    );
  }
  
  router.push(
    `/products?${params.toString()}`
  );

}, [
  selectedCategory,
  selectedBrands,
  selectedRating,

]);

// fetch
  const fetchProducts = async () => {
    try{
      const res= await api.get("api/comman/products")
      console.log(res.data.data);

      const formattedProducts =
        res.data.data.map((item) => ({

          id: item._id,

          image: `${BASE_URL}/${item.img}`,

          title: item.name,

          category: item.category,

          subcategory: item.subCategory,

          brand: item.Brand,

          price: item.price,

          oldPrice: item.oldPrice,

          discount: item.discount,

          rating: Math.round(item.rating || 4),

          colors: item.colors || [],

          sizes: item.sizes || [],

        }));

             
      setAllProducts(formattedProducts);
 /*  DYNAMIC CATEGORIES */
const categoriesSet = [
  "All",
  ...new Set(
    formattedProducts.map(
      (p) => p.category
    )
  ),
];

setCategories(categoriesSet);
console.log("categories:", categoriesSet);
/* DYNAMIC SUBCATEGORIES */
const categoryToSub = {};

formattedProducts.forEach((product) => {

  if (
    !categoryToSub[
      product.category
    ]
  ) {

    categoryToSub[
      product.category
    ] = new Set();

  }

  if (product.subcategory) {

    categoryToSub[
      product.category
    ].add(product.subcategory);

  }
});

/*  CONVERT SET → ARRAY */
const subCatObj ={};

for (
  const [cat, subSet]
  of Object.entries(categoryToSub)
) {
  subCatObj[cat] =
    Array.from(subSet);

}

setSubcategories(subCatObj);
console.log("category to subcategory mapping:", subCatObj);
/*  DYNAMIC BRANDS */
const brandsSet = [
  ...new Set(
    formattedProducts.map(
      (p) => p.brand
    )
  ),
];

setBrands(brandsSet);

    } catch (error) {
      console.error("Error fetching products:", error);
    }

  };
console.log("all products",allProducts);
  useEffect(() => {
    fetchProducts();
  }, []);


 let filteredProducts =
  allProducts.filter((product) => {

    /* CATEGORY */
    if (
      selectedCategory !== "All" &&
      product.category !== selectedCategory
    ) {
      return false;
    }

    /* SUBCATEGORY */
    if (
      selectedSubCategory &&
      product.subcategory !== selectedSubCategory
    ) {
      return false;
    }

    /* PRICE */
    if (
      product.price > priceRange
    ) {
      return false;
    }

    /* DISCOUNT */
    if (
      product.discount <
      discountRange
    ) {
      return false;
    }

    /* BRAND */
    if (
      selectedBrands.length > 0 &&
      !selectedBrands.includes(
        product.brand
      )
    ) {
      return false;
    }

    /* RATING */
    if (
      selectedRating &&
      product.rating <
        selectedRating
    ) {
      return false;
    }

    return true;
  });
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });
const toggleBrand = (brand) => {
  setSelectedBrands((prev) =>
    prev.includes(brand)
      ? prev.filter((b) => b !== brand) 
      : [...prev, brand] 
  );
};
const handleRating = (rate) => {
  setSelectedRating((prev) => (prev === rate ? 0 : rate));
};
const visibleBrands = showBrands ? brands : brands.slice(0, 2);
const visibleRatings = showRatings ? Ratings : Ratings.slice(0, 2);
  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
           <div className="bg-white  border-b border-gray-400 py-2 px-4 lg:px-10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div>
            <p className="text-xs text-gray-500 mb-1.5 font-medium tracking-wide">
             <Link href="/"> <span className="hover:text-primary-blue cursor-pointer transition">Home</span></Link> / <Link href="products"><span className="hover:text-primary-blue cursor-pointer transition">Shop</span></Link> / <span className="text-primary-blue font-bold">Products</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] flex items-center gap-3">
              Products
              {/* <span className="text-sm font-medium bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full">{sortedProducts.length} items</span> */}
            </h1>
          </div>
          
          {/* MOBILE FILTER BTN & SORT DROPDOWN */}
          <div className="flex sm:flex-row items-stretch sm:items-center  gap-3 w-full md:w-auto mt-2 md:mt-0">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex-1 flex justify-center items-center gap-2 bg-gray-50 border border-gray-200 text-[#0f172a] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition duration-300"
            >
              <FaFilter className="text-primary-red" /> Filters
            </button>
            
            <div className="relative flex-1 sm:w-[220px]">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-[#0f172a] px-4 py-2.5 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:border-primary-blue transition cursor-pointer"
              >
                <option value="default">Sort by: Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>
          
        </div>
      </div>

    
   <div className="flex  mt-0 relative">
       <div className="">   
        <div className={`
           fixed lg:sticky 
            top-0
            left-0
            h-[calc(100vh-1px)] 
            w-[300px] lg:w-[250px]
             lg:bg-transparent
             bg-white
            shadow-2xl lg:shadow-none 
            z-50 lg:z-10
            overflow-y-auto 
            
            no-scrollbar
            transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          
          <div className=" rounded-none mt-0 pt-0 px-0   lg:border border-gray-100  lg:shadow-sm min-h-full lg:min-h-fit">
            
            {/* MOBILE CLOSE BTN */}
            <div className="flex justify-between items-center lg:hidden mb-8 border-b pb-2 ps-2">
              <h3 className="font-bold text-xl text-[#0f172a]">Filters</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 m-2 bg-gradient-blue-red text-white  rounded-full hover:bg-gray-200 transition">
                <MdOutlineClose size={20} />
              </button>
            </div>

            {/* CATEGORIES */}
     <div className="mb-4  bg-white p-6" >
      
<div className="flex justify-between">
    <h4 className="font-semibold text-lg  mb-4">
    Categories
  </h4>
    
</div>
  

  <ul className="space-y-4 ">

    {categories.map((cat) => (
      <li key={cat}>

        {/* CATEGORY BUTTON */}
        <button
          onClick={() => {
            setSelectedCategory(cat);
            setOpenCategory(openCategory === cat ? "" : cat);
            setSelectedSubCategory("");
          }}
          className={`w-full text-left text-[15px] flex items-center justify-between transition group ${
            selectedCategory === cat
              ? "text-primary-red font-bold"
              : "text-gray-600 hover:text-primary-blue"
          }`}
        >
          <span>{cat}</span>

          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            selectedCategory === cat
              ? "bg-gradient-blue-red text-white"
              : "bg-gray-100 text-gray-500"

          }`}>
            {cat === "All"
              ? allProducts.length
              : allProducts.filter(p => p.category === cat).length}
          </span>
        </button>

        {/*  SUBCATEGORIES */}
        {openCategory === cat && subcategories[cat] && (
          <ul className="mt-2 ml-3 space-y-2 border-l-2 border-gray-100 pl-3">

            {subcategories[cat].map((sub) => (
              <li key={sub}>
                <button
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`text-sm flex justify-between w-full ${
                    selectedSubCategory === sub
                      ? "text-primary-blue font-semibold"
                      : "text-gray-500 hover:text-primary-blue"
                  }`}
                >
                  <span>{sub}</span>

                  <span className="text-xs text-gray-400">
                    {
                      allProducts.filter(
                        (p) => p.subcategory === sub
                      ).length
                    }
                  </span>
                </button>
              </li>
            ))}

          </ul>
        )}

      </li>
    ))}

  </ul>
</div>

       

            {/* PRICE RANGE */}
            <div className="mb-4 bg-white p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-lg text-[#0f172a]">Price Range</h4>
                <span className="text-xs font-bold text-primary-blue bg-primary-blue/10 px-2 py-1 rounded-md">
                  Up to ₹{priceRange}
                </span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="10000" 
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-red" 
              />
              <div className="flex justify-between text-xs text-gray-400 mt-3 font-medium">
                <span>₹500</span>
                <span>₹139999</span>
              </div>
            

          
{/* DISCOUNT RANGE */}
  
              <div className="flex justify-between items-center mb-4 mt-4">
                <h4 className="font-semibold text-lg text-[#0f172a]">Discount Range</h4>
                <span className="text-xs font-bold text-primary-blue bg-primary-blue/10 px-2 py-1 rounded-md">
                  Up to {discountRange}%
                </span>
              </div>
              <input 
                type="range" 
                min="0%" 
                max="100%" 
                step="5"
                value={discountRange}
                onChange={(e) => setDiscountRange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-red " 
              />
              <div className="flex justify-between text-xs text-gray-400 mt-3 font-medium">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* COLORS */}
            {/* <div className="mb-8">
              <h4 className="font-semibold text-lg text-[#0f172a] mb-4">Colors</h4>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => {
                  const isSelected = selectedColors.includes(color);
                  const isWhite = color === "#ffffff";
                  return (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isWhite ? "border-2 border-gray-200" : "border-none shadow-sm"
                      } ${isSelected ? "ring-2 ring-offset-2 ring-primary-blue scale-110" : "hover:scale-110"}`}
                      title={color}
                    >
                      {isSelected && (
                        <FaCheck size={12} className={isWhite ? "text-gray-800" : "text-white"} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div> */}

            
{/* BRANDS */}
<div className="mb-4 bg-white p-6">
  <h4 className="font-semibold text-lg text-[#0f172a] mb-4">
    Brands
  </h4>

  <div className="space-y-1">

    {visibleBrands.map((brand) => {
      const isSelected = selectedBrands.includes(brand);

      return (
        <button
          key={brand}
          onClick={() => toggleBrand(brand)}
          className={`w-full flex items-center justify-between text-sm px-3 py-2 rounded-lg transition ${
            isSelected
              ? "text-primary-red font-bold"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span>{brand}</span>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              isSelected
                ? "bg-gradient-blue-red text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {
              allProducts.filter((p) => p.brand === brand).length
            }
          </span>
        </button>
      );
    })}

    
    {brands.length > 2 && (
      <button
        onClick={() => setShowBrands(!showBrands)}
        className="text-sm text-primary-blue mt-2 hover:underline"
      >
        {showBrands ? "Show Less" : "Show More"}
      </button>
    )}

  </div>

  

{/* Rating */}

  <h4 className="font-semibold text-lg text-[#0f172a] mb-4 mt-4">
    Ratings
  </h4>

  <div className="space-y-1">

    {visibleRatings.map((rate) => {
      const isSelected = selectedRating === rate;

      return (
        <button
          key={rate}
          onClick={() => handleRating(rate)}
          className={`w-full flex items-center justify-between text-sm px-3 py-2 rounded-lg transition ${
            isSelected
              ? " text-primary-red font-bold"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span className="flex items-center gap-1">
            {rate}
            <FaStar className="text-yellow-400" />
            & above
          </span>

{/*         
          <span className="text-xs text-gray-400">
            {
              allProducts.filter((p) => p.rating >= rate).length
            }
          </span> */}
             <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
             isSelected
              ? "bg-gradient-blue-red text-white"
              : "bg-gray-100 text-gray-500"

          }`}>
            {
              allProducts.filter((p) => p.rating >= rate).length
            }
          </span>
        </button>
      );
    })}
 {Ratings.length > 2 && (
      <button
        onClick={() => setShowRatings(!showRatings)}
        className="text-sm text-primary-blue mt-2 hover:underline"
      >
        {showRatings ? "Show Less" : "Show More"}
      </button>
    )}
  </div>
</div>

  <button 
                onClick={() => {
                  setSelectedCategory("All");
                setPriceRange(10000);
                setDiscountRange(0);
                setSelectedBrands([]);
                setSelectedRating(0);
                setSelectedSubCategory("");


                }}
                className="bg-gradient-blue-red text-white px-4 py-2 rounded-xl font-medium hover:scale-105 transition-transform shadow-md ms-6"
              >
                Clear Filters
              </button>
            {/* SIZES */}
            {/* <div className="mb-6">
              <h4 className="font-semibold text-lg text-[#0f172a] mb-4">Size</h4>
              <div className="flex flex-wrap gap-2.5">
                {availableSizes.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isSelected 
                          ? "bg-gradient-blue-red border-transparent text-white shadow-lg shadow-primary-blue/30 scale-105" 
                          : "bg-white border-2 border-gray-100 text-gray-600 hover:border-primary-red/50 hover:text-primary-red"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div> */}

          </div>
        </div>

        {/* MOBILE OVERLAY */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

  
</div>
        {/* PRODUCTS*/}
     
 <div className="flex-1 px-4 lg:px-10 mt-8">
          {sortedProducts.length > 0 ? (
            <div className="grid  lg:grid-col-3 grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-6">
              {sortedProducts.map((item) => (
                <ProductCard key={item.id}
                {...item} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[400px] border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <FaFilter className="text-gray-300 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-3">No products found</h3>
              <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                We couldn't find any products matching your current filters. Try adjusting your category, price, or color selections.
              </p>
              <button 
                onClick={() => {
                  setSelectedCategory("All");
                  setPriceRange(10000);
                   setDiscountRange(0);
                setSelectedBrands([]);
                setSelectedRating(0);
                setSelectedSubCategory("");
                }}
                className="bg-gradient-blue-red text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform shadow-md"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
   </div>
      </div>
      
    
  );
}