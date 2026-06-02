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
import OrderSummary from '../components/OrderSummary';

export default function CheckoutPage() {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Address selection state lifted from Address.jsx
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [selectedBilling, setSelectedBilling] = useState(null);
    const [step, setStep] = useState(1);

    const [finalTotal, setFinalTotal] = useState(0);
    const [summaryData, setSummaryData] = useState(null);


    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get('api/user/cart');
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
        // Extract the nested shipping object
        console.log(
            "shippingAddr",
            shippingAddr
        );

        console.log(
            "billingAddr",
            billingAddr
        );
        setSelectedShipping(shippingAddr?.shipping || shippingAddr);
        setSelectedBilling(billingAddr?.billing || billingAddr);
        setStep(2);
    };

    const handlePlaceOrder = async (total) => {
        console.log("selectedShipping:", selectedShipping);
        console.log("phone being sent:", selectedShipping.mobile);
        if (!selectedShipping) {
            return toast.error("Please select a shipping address first");
        }
        if (cart.length === 0) {
            return toast.error("Your cart is empty");
        }

        setIsProcessing(true);
        try {
            console.log("Shipping address object:", selectedShipping);
            // 1. Create order on backend to get Cashfree session
            const res = await api.post("/api/user/create-order", {
                amount: total,
                customerName: selectedShipping?.shipping?.fullName || selectedShipping?.fullName,
                customerEmail: user?.email || "customer@example.com",
                customerPhone: selectedShipping?.shipping?.mobile || selectedShipping?.mobile,
            });
            if (res.data.success && res.data.paymentSessionId) {
                // Save order details to localStorage so we can finalize it after payment success

                // console.log({

                //     shippingAddress:
                //         selectedShipping,

                //     billingAddress:
                //         selectedBilling,

                //     orderSummary: {

                //         subtotal,

                //         shipping,

                //         discount,

                //         total,
                //     },
                // });
                localStorage.setItem("pendingOrderDetails", JSON.stringify({
                    shippingAddress: selectedShipping,
                    billingAddress:

                        selectedBilling ||

                        selectedShipping,
                    items: cart,

                    orderSummary: {

                        ...summaryData,

                        pricingDetails: [

                            {
                                label: "Cart Total",
                                value: summaryData.cartTotal,
                            },

                            {
                                label: "Cart Discount",
                                value: summaryData.cartDiscount,
                            },

                            {
                                label: "Coupon Discount",
                                value: summaryData.couponDiscount,
                            },

                            {
                                label: "GST",
                                value: summaryData.gstAmount,
                            },

                            {
                                label: "Delivery Fee",
                                value: summaryData.deliveryFee,
                            },

                            {
                                label: "Order Total",
                                value: summaryData.total,
                            },
                        ],
                    },
                    payment: { method: "Cashfree", status: "Pending" }
                }));

                // 2. Load Cashfree SDK and checkout
                const cashfree = await load({
                    mode: "sandbox", 
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
            const errData = error.response?.data;
            console.log("ERR DATA RAW:", JSON.stringify(errData));
            console.log("ERR MESSAGE:", errData?.message || errData?.error || errData?.msg);
            toast.error("An error occurred while starting payment");
            setIsProcessing(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;
    }



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
                                You are about to pay <span className="font-bold text-lg text-primary-red">₹{finalTotal.toFixed(2)}</span> using Cashfree secure gateway.
                            </p>

                            <button
                                onClick={() => handlePlaceOrder(finalTotal)}
                                disabled={isProcessing}
                                className="w-full md:w-auto px-10 py-4 bg-gradient-blue-red text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {isProcessing ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FaLock className="text-sm opacity-80" />
                                )}
                                {isProcessing ? "Initializing Payment..." : `Pay ₹${finalTotal.toFixed(2)} Securely`}
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
                <OrderSummary
                    onSummaryChange={
                        setSummaryData
                    }
                    onTotalChange={
                        setFinalTotal
                    }
                />
            </div>
        </div>
    );
}
