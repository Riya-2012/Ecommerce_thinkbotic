import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaShareAlt, FaStar } from "react-icons/fa";
import WishlistIcon from "../products/WhishlistIcon";
import AddCart from "../products/AddCart";
import ShareButton from "../products/ShareButton";

export default function ProductCard({
  id,
  image,
  title,
  category,
  price,
  oldPrice,
  rating = 4,
  discount,
  variant = "default",
  showCounter = false,


}) 

{
  return (

    <div
      className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden transition duration-300
        ${variant === "topRated"
          ? "w-full shadow-sm hover:shadow-md"
          : "w-full shadow-sm hover:shadow-xl"
        }
      `}
    >

    <Link href={`/products/${id}`} className="block">
      <div className=" relative w-full h-[140px] lg:h-[220px] md:h-[200px] overflow-hidden">

       <Image
        loader={() => image}
  src={image}
  alt={title}
  width={400}
  height={400}

  className="
    w-full
    h-full
    object-cover
    group-hover:scale-110
    transition duration-500
  "
/>


 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition "></div>


        {variant === "topRated" ? (
          <span className="absolute top-3 left-3 bg-primary-red text-white text-xs px-3 py-1 rounded-full shadow">
            Top Rated
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-primary-red text-white text-xs px-2 py-1 rounded-full shadow">
            {discount}%
          </span>
        )}



        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">

          <button className="bg-white/90 backdrop-blur p-2 rounded-full shadow  transition"
           onClick={(e) => {

    e.preventDefault();
    e.stopPropagation();

    console.log("Add to Wishlist");

  }}
          >
          <WishlistIcon productId={id} />
          </button>
        

          <button className="bg-white/90 backdrop-blur p-2 rounded-full shadow hover:text-primary-blue transition"
                onClick={(e) => {

    e.preventDefault();
    e.stopPropagation();

    console.log("Share Product");

  }}
     
          >
        <ShareButton  product={{ id, title}} />
          </button>
            

        </div>

        <div className="absolute bottom-3 left-0 w-full flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition">

          {/* <button className="bg-white text-primary-blue px-8 py-2 rounded-full text-xs font-medium shadow hover:bg-gray-100 transition"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Add to Cart");
            }}
          >
            Add 
          </button> */}
          <AddCart productId={id} />

          <button className="bg-gradient-blue-red text-white px-6 py-2 rounded-full text-xs font-medium shadow hover:opacity-90 transition"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Buy Now");
            }}
          >
            Buy
          </button>
  
        </div>

      </div>
    </Link>


      <div className="p-3">


        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {category}
        </p>


        <h3 className="font-semibold text-[15px] text-[#0f172a] mt-1 line-clamp-1">
          {title}
        </h3>


        <div className="flex items-center gap-1 text-primary-blue text-sm mt-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < rating ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="text-gray-500 text-xs ml-2">
            ({rating}.0)
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-primary-red">
            ₹{price}
          </span>

          {oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{oldPrice}
            </span>
          )}
        </div>
       
      </div>
    </div>
  );
}