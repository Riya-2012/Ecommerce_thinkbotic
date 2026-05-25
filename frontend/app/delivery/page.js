"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaLock } from 'react-icons/fa';
import { MdOutlineSecurity } from 'react-icons/md';
import Address from '../components/Address';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { load } from '@cashfreepayments/cashfree-js';

export default function CheckoutPage() {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Address selection state lifted from Address.jsx
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [selectedBilling, setSelectedBilling] = useState(null);
    const [step, setStep] = useState(1);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get('/api/user/cart');
                setCart(res.data?.items || []);
            } catch (error) {
                console.error("Failed to fetch cart", error);
                toast.error("Failed to load cart");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleContinueToPayment = (shippingAddr, billingAddr) => {
        setSelectedShipping(shippingAddr);
        setSelectedBilling(billingAddr);
        setStep(2);
    };

    const handlePlaceOrder = async (total) => {
        if (!selectedShipping) {
            return toast.error("Please select a shipping address first");
        }
        if (cart.length === 0) {
            return toast.error("Your cart is empty");
        }

        setIsProcessing(true);
        try {
            // 1. Create order on backend to get Cashfree session
            const res = await api.post("/api/user/create-order", {
                amount: total,
                customerName: selectedShipping.shipping.fullName,
                customerEmail: user?.email || "customer@example.com",
                customerPhone: selectedShipping.shipping.mobile,
            });

            if (res.data.success && res.data.paymentSessionId) {
                // Save order details to localStorage so we can finalize it after payment success
                localStorage.setItem("pendingOrderDetails", JSON.stringify({
                    shippingAddress: selectedShipping.shipping,
                    billingAddress: selectedBilling ? selectedBilling.shipping : selectedShipping.shipping,
                    items: cart,
                    orderSummary: { totalAmount: total },
                    payment: { method: "Cashfree", status: "Pending" }
                }));

                // 2. Load Cashfree SDK and checkout
                const cashfree = await load({
                    mode: "sandbox", // use "production" for live
                });

                cashfree.checkout({
                    paymentSessionId: res.data.paymentSessionId,
                });
            } else {
                toast.error("Failed to initialize payment session");
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Payment initiation error:", error);
            toast.error("An error occurred while starting payment");
            setIsProcessing(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;
    }

    const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || item.qty || 1), 0);
    const oldPriceTotal = cart.reduce((acc, item) => acc + (item.oldPrice || item.price) * (item.quantity || item.qty || 1), 0);
    const discount = oldPriceTotal > subtotal ? oldPriceTotal - subtotal : 0;
    const shipping = subtotal > 500 ? 0 : 50; 
    const total = subtotal + shipping;

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT SIDE: STEPS */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <Address onContinueToPayment={handleContinueToPayment} />
                    
                    {/* STEP 2: PAYMENT */}
                    {step === 2 && (
                        <div className="bg-white rounded-2xl shadow-md ring-4 ring-primary-blue/5 border border-primary-blue/30 p-6 animate-in fade-in duration-300">
                            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
                                <FaLock className="text-primary-blue" /> Secure Payment
                            </h2>
                            <p className="text-gray-600 mb-6">
                                You are about to pay <span className="font-bold text-lg text-primary-red">₹{total}</span> using Cashfree secure gateway.
                            </p>
                            
                            <button 
                                onClick={() => handlePlaceOrder(total)}
                                disabled={isProcessing}
                                className="w-full md:w-auto px-10 py-4 bg-gradient-blue-red text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {isProcessing ? (
                                   <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FaLock className="text-sm opacity-80" /> 
                                )}
                                {isProcessing ? "Initializing Payment..." : `Pay ₹${total} Securely`}
                            </button>
                            
                            <div className="mt-6 flex flex-col items-start gap-2 text-xs text-gray-400 font-medium bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <MdOutlineSecurity className="text-lg text-green-500" />
                                    <span>Safe and Secure Payments via Cashfree</span>
                                </div>
                                <p>Your payment information is encrypted and securely processed.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE: ORDER SUMMARY */}
                <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl h-fit sticky top-24">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-100 pb-4">
                        Order Summary
                    </h2>
                    
                    <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {cart.length === 0 ? (
                            <p className="text-gray-500 text-sm">Your cart is empty.</p>
                        ) : (
                            cart.map(item => {
                                if (!item) return null;
                                return (
                                <div key={item?.productId || item?._id || Math.random()} className="flex gap-4">
                                    <div className="flex-grow flex flex-col justify-center">
                                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">{item?.name || item?.title || "Product"}</h4>
                                        <div className="flex justify-between items-center text-sm mt-1">
                                            <span className="text-gray-500">Qty: {item?.quantity || item?.qty || 1}</span>
                                            <span className="font-bold text-gray-900">₹{item?.price || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                );
                            })
                        )}
                    </div>

                    <div className="border-t my-4"></div>

                    <div className="flex justify-between text-gray-600 mb-2 text-sm">
                        <span>Cart Total</span>
                        <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600 mb-2 text-sm">
                            <span>Discount</span>
                            <span>-₹{discount}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-600 mb-2 text-sm">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${shipping}`}</span>
                    </div>

                    <div className="border-t my-4"></div>

                    <div className="flex justify-between font-bold text-lg">
                        <span className='text-gray-900'>Total</span>
                        <span className='text-primary-red'>₹{total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
