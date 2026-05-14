
"use client"
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { FaRegCreditCard, FaMoneyBillAlt, FaUniversity, FaMobileAlt, FaLock, FaEdit, FaMapMarkerAlt, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { MdOutlineSecurity } from 'react-icons/md';
import Address from '../components/Address';

const initialCart = [
    {
        id: 1,
        image: "/product-1.jpg",
        title: "Smart Watch Elite",
        category: "Electronics",
        price: 2999,
        oldPrice: 3999,
        rating: 5,
        color: "black",
        qty: 1
    },
    {
        id: 2,
        image: "/product-2.jpg",
        title: "Pro Noise-Canceling Headphones",
        category: "Audio",
        price: 1299,
        oldPrice: 1999,
        rating: 4,
        color: "orange",
        qty: 1
    },
];








export default function CheckoutPage() {
       const [cart] = useState(initialCart);
        const [step, setStep] = useState(1);

 

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20">
            {/* Minimalist Header */}
            {/* <div className="bg-white border-b border-gray-100 py-5 px-4 lg:px-10 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1200px] mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-black bg-gradient-blue-red bg-clip-text text-transparent tracking-tighter">
                            Thinkbotic.
                        </span>
                    </Link>
                    <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                        <FaLock className="text-gray-400" />
                        <span>Secure Checkout</span>
                    </div>
                </div>
            </div> */}

            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT SIDE: STEPS */}
            <Address />

                {/* RIGHT SIDE: ORDER SUMMARY */}
                {/* <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
                        <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100 flex justify-between items-center">
                            Order Summary
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{cart.length} Items</span>
                        </h2>
                        
                        
                        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden flex-shrink-0">
                                      
                                        <div className="w-full h-full bg-gray-200"></div>
                                       
                                    </div>
                                    <div className="flex-grow flex flex-col justify-center">
                                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">{item.title}</h4>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Qty: {item.qty}</span>
                                            <span className="font-bold text-gray-900">₹{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                 
                        <div className="space-y-3.5 text-sm text-gray-600 border-t border-gray-100 pt-5">
                            <div className="flex justify-between items-center">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-800">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Discount</span>
                                <span className="font-medium text-green-600">-₹{discount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Taxes (GST)</span>
                                <span className="font-medium text-gray-800">₹{gst}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Delivery Charges</span>
                                <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">FREE</span>
                            </div>
                            
                            <div className="border-t border-dashed border-gray-200 my-4"></div>
                            
                            <div className="flex justify-between items-center text-lg font-black">
                                <span className="text-gray-900">Total Amount</span>
                                <span className="text-primary-red text-xl">₹{total}</span>
                            </div>
                            <div className="text-right text-xs text-green-600 font-medium">
                                You will save ₹{discount} on this order
                            </div>
                        </div>

                        {step === 2 && (
                            <button className="w-full mt-8 bg-gradient-blue-red text-white py-4 rounded-xl font-bold shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2.5 text-lg">
                                <FaLock className="text-sm opacity-80" /> 
                                Pay ₹{total}
                            </button>
                        )}
                        
                        <div className="mt-6 flex flex-col items-center justify-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <MdOutlineSecurity className="text-lg text-green-500" />
                                <span>Safe and Secure Payments</span>
                            </div>
                            <p>100% Authentic products.</p>
                        </div>
                    </div>
                </div> */}

                  <div className=" p-2 rounded-2xl   h-fit sticky top-24">

    <h2 className="text-xl font-bold mb-4">
      Order Summary
    </h2>

   
    {(() => {
      const subtotal = cart.reduce(
        (acc, item) => acc + item.price * (item.qty || 1),
        0
      );
        const oldPriceTotal = cart.reduce(
        (acc, item) => acc + item.oldPrice * (item.qty || 1),
        0
      );
 
      const shipping = 50;
      const total = subtotal + shipping;
const discount=oldPriceTotal-subtotal;
      return (
        <>
<div className="flex justify-between text-gray-600 mb-2">
            <span>Old Price</span>
            <span>₹{oldPriceTotal}</span>
          </div>

          <div className="flex justify-between text-gray-600 mb-2">
            <span>Cart Total</span>
            <span>₹{subtotal}</span>
          </div>
 <div className="flex justify-between text-gray-600 mb-2">
            <span>Discount</span>
            <span>₹{discount}</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>
  <div className="flex justify-between text-gray-600 mb-2">
            <span>Coupon Discount</span>
            <span>₹0.0</span>
          </div>
            <div className="flex justify-between text-gray-600 mb-2">
            <span>GST</span>
            <span>₹899</span>
          </div>
            <div className="flex justify-between text-gray-600 mb-2">
            <span>Shipping charges</span>
            <span>₹{shipping}</span>
          </div>
          <div className="border-t my-3"></div>

          <div className="flex justify-between font-bold text-lg">
            <span className='text-primary-red'>Total</span>
            <span className='text-primary-red'>₹{total}</span>
          </div>

          <button className="w-full mt-6 bg-gradient-blue-red  text-white py-2 rounded-xl font-bold">
            <Link href="/delivery">Place Order</Link>

          </button>
        </>
      );
    })()}

  </div>
            </div>
        </div>
    );
}
