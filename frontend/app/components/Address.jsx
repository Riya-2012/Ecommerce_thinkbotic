"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaPlus, FaEdit } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import toast from "react-hot-toast";
import AddressList from "./AddressList";

function Address({ onContinueToPayment }) {
    const [addresses, setAddresses] = useState([]);
    const [selectedShippingId, setSelectedShippingId] = useState(null);
    const [selectedBillingId, setSelectedBillingId] = useState(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
    const [step, setStep] = useState(1);

    const { user } = useAuth();
    const userId = user?._id || user?.id;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: "", mobile: "", address: "", street: "",
            city: "", state: "", zipCode: "",
            b_fullName: "", b_mobile: "", b_address: "", b_street: "",
            b_city: "", b_state: "", b_zipCode: "",
        },
    });

    const fetchAddresses = async () => {
        if (!userId) return;
        try {
            const response = await api.get(`/api/user/addresses/${userId}`);
            const data = response.data || [];
            const formattedAddresses = data.map((addr) => ({
                id: addr._id,
                fullName: addr.fullName,
                mobile: addr.mobile,
                address: addr.address,
                street: addr.street,
                city: addr.city,
                state: addr.state,
                zipCode: addr.zipCode,
                type: addr.type,
            }));
            setAddresses(formattedAddresses);
        } catch (error) {
            console.log(error);
            setAddresses([]);
        }
    };

    useEffect(() => { fetchAddresses(); }, [userId]);

    const onSubmitAddress = async (data) => {
        try {
            await api.post(`/api/user/addresses`, {
                userId, type: "Shipping",
                fullName: data.fullName, mobile: data.mobile,
                address: data.address, street: data.street,
                city: data.city, state: data.state, zipCode: data.zipCode,
            });

            await api.post(`/api/user/addresses`, {
                userId, type: "Billing",
                fullName: billingSameAsShipping ? data.fullName : data.b_fullName,
                mobile:   billingSameAsShipping ? data.mobile   : data.b_mobile,
                address:  billingSameAsShipping ? data.address  : data.b_address,
                street:   billingSameAsShipping ? data.street   : data.b_street,
                city:     billingSameAsShipping ? data.city     : data.b_city,
                state:    billingSameAsShipping ? data.state    : data.b_state,
                zipCode:  billingSameAsShipping ? data.zipCode  : data.b_zipCode,
            });

            toast.success("Address saved successfully"); 
            reset();
            setIsAddingAddress(false);
            fetchAddresses();
        } catch (error) {
            console.log(error);
            toast.error("Failed to save address");
        }
    };

    const getAddressById = (id) => addresses.find((a) => a.id === id);

    return (
        <div className="lg:col-span-2 flex flex-col gap-5">
            <div
                className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${
                    step === 1
                        ? "border-primary-blue/30 shadow-md ring-4 ring-primary-blue/5"
                        : "border-gray-100 opacity-90"
                }`}
            >
                {/* Header */}
                <div className="p-5 sm:p-6 flex justify-between items-center border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <span
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                                step >= 1
                                    ? "bg-primary-blue text-white shadow-md shadow-primary-blue/20"
                                    : "bg-gray-100 text-gray-400"
                            }`}
                        >
                            1
                        </span>
                        <h2 className="text-xl font-bold text-gray-800">Delivery & Billing Address</h2>
                    </div>
                    {step > 1 && (
                        <button
                            onClick={() => setStep(1)}
                            className="text-primary-blue text-sm font-semibold flex items-center gap-1.5 hover:text-blue-700 transition"
                        >
                            <FaEdit /> Change
                        </button>
                    )}
                </div>

                {/* ── STEP 1 ── */}
                {step === 1 && (
                    <div className="p-5 sm:p-8 transition-opacity duration-500 opacity-100 bg-gray-50/30">

                        {/* Empty state */}
                        {addresses.length === 0 && !isAddingAddress && (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <FaMapMarkerAlt className="text-2xl" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">No Address Available</h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    Please add a shipping address to proceed with your order.
                                </p>
                                <button
                                    onClick={() => setIsAddingAddress(true)}
                                    className="px-6 py-3 bg-gradient-blue-red text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto transform hover:-translate-y-0.5"
                                >
                                    <FaPlus /> Add New Address
                                </button>
                            </div>
                        )}

                        {/* Address list + continue */}
                        {addresses.length > 0 && !isAddingAddress && (
                            <div className="space-y-5 animate-in fade-in duration-300">
                                <h3 className="font-semibold text-gray-800 text-lg">
                                    Select Delivery & Billing Addresses
                                </h3>

                                <AddressList
                                    addresses={addresses}
                                    onAddressesChange={setAddresses}
                                    selectable
                                    selectedShippingId={selectedShippingId}
                                    selectedBillingId={selectedBillingId}
                                    onSelectShipping={setSelectedShippingId}
                                    onSelectBilling={setSelectedBillingId}
                                />

                                <button
                                    onClick={() => setIsAddingAddress(true)}
                                    className="mt-2 text-primary-blue font-semibold text-sm flex items-center gap-1.5 hover:underline"
                                >
                                    <FaPlus className="text-xs" /> Add another address
                                </button>

                                <div className="pt-6 border-t border-gray-200 mt-6 flex justify-end">
                                    <button
                                        disabled={!selectedShippingId}
                                        onClick={() => {
                                            const finalBillingId = selectedBillingId || selectedShippingId;
                                            setSelectedBillingId(finalBillingId);
                                            setStep(2);
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                            if (onContinueToPayment) {
                                                const s = getAddressById(selectedShippingId);
                                                const b = getAddressById(finalBillingId);
                                                onContinueToPayment(s, b);
                                            }
                                        }}
                                        className="w-full md:w-auto px-8 py-3.5 bg-gradient-blue-red text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add address form */}
                        {isAddingAddress && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                    <h3 className="text-lg font-bold text-gray-800">Add New Address</h3>
                                    {addresses.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingAddress(false)}
                                            className="text-gray-500 text-sm font-medium hover:text-gray-800 transition"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit(onSubmitAddress)} className="space-y-8">
                                    {/* Shipping fields */}
                                    <div>
                                        <h4 className="text-sm font-bold text-primary-blue uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <FaMapMarkerAlt /> Shipping Address
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name *</label>
                                                <input {...register("fullName", { required: true })} placeholder="John Doe" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Mobile Number *</label>
                                                <input {...register("mobile", { required: true })} placeholder="10-digit number" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Complete Address *</label>
                                                <input {...register("address", { required: true })} placeholder="House/Flat No., Building Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Street / Area</label>
                                                <input {...register("street")} placeholder="Street / Area Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">City *</label>
                                                <input {...register("city", { required: true })} placeholder="City" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">State *</label>
                                                <input {...register("state", { required: true })} placeholder="State" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">PIN Code *</label>
                                                <input {...register("zipCode", { required: true })} placeholder="000000" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Billing same as shipping toggle */}
                                    <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                        <input
                                            type="checkbox"
                                            id="formSameAsShipping"
                                            checked={billingSameAsShipping}
                                            onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                                            className="w-5 h-5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue transition"
                                        />
                                        <label htmlFor="formSameAsShipping" className="text-gray-700 font-medium cursor-pointer select-none">
                                            Billing address is the same as shipping address
                                        </label>
                                    </div>

                                    {/* Separate billing fields */}
                                    {!billingSameAsShipping && (
                                        <div className="pt-6 border-t border-gray-100">
                                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400" /> Billing Address
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                                <div><label className="block text-xs font-medium text-gray-500 mb-1">Full Name *</label><input {...register("b_fullName", { required: !billingSameAsShipping })} placeholder="John Doe" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" /></div>
                                                <div><label className="block text-xs font-medium text-gray-500 mb-1">Mobile Number *</label><input {...register("b_mobile", { required: !billingSameAsShipping })} placeholder="10-digit number" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" /></div>
                                                <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Complete Address *</label><input {...register("b_address", { required: !billingSameAsShipping })} placeholder="House/Flat No., Building Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" /></div>
                                                <div><label className="block text-xs font-medium text-gray-500 mb-1">Street / Area</label><input {...register("b_street")} placeholder="Street / Area Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" /></div>
                                                <div><label className="block text-xs font-medium text-gray-500 mb-1">City *</label><input {...register("b_city", { required: !billingSameAsShipping })} placeholder="City" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" /></div>
                                                <div><label className="block text-xs font-medium text-gray-500 mb-1">State *</label><input {...register("b_state", { required: !billingSameAsShipping })} placeholder="State" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" /></div>
                                                <div><label className="block text-xs font-medium text-gray-500 mb-1">PIN Code *</label><input {...register("b_zipCode", { required: !billingSameAsShipping })} placeholder="000000" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" /></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto px-8 py-3.5 bg-gradient-blue-red text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                        >
                                            Save Address
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* ── ADDRESS SUMMARY (step > 1) ── */}
                {step > 1 && selectedShippingId && (() => {
                    const shippingAddr = getAddressById(selectedShippingId);
                    const billingAddr  = getAddressById(selectedBillingId);
                    if (!shippingAddr) return null;
                    const isSame = selectedShippingId === selectedBillingId;

                    return (
                        <div className="px-5 sm:px-8 py-5 bg-gray-50/50 rounded-b-2xl">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
                                    <h4 className="text-xs font-bold text-primary-blue uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <FaMapMarkerAlt /> Shipping To
                                    </h4>
                                    <p className="font-bold text-gray-800">{shippingAddr.fullName}</p>
                                    <p className="text-gray-600 text-sm mt-1">{shippingAddr.address}, {shippingAddr.street}</p>
                                    <p className="text-gray-600 text-sm">{shippingAddr.city}, {shippingAddr.state} - <span className="font-semibold">{shippingAddr.zipCode}</span></p>
                                    <p className="text-gray-600 text-sm mt-1 font-medium">Mobile: <span className="text-gray-800">{shippingAddr.mobile}</span></p>
                                </div>

                                {billingAddr && (
                                    <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <FaMapMarkerAlt /> Billing To
                                            {isSame && <span className="text-xs text-gray-400 font-normal normal-case">(same as shipping)</span>}
                                        </h4>
                                        <p className="font-bold text-gray-800">{billingAddr.fullName}</p>
                                        <p className="text-gray-600 text-sm mt-1">{billingAddr.address}, {billingAddr.street}</p>
                                        <p className="text-gray-600 text-sm">{billingAddr.city}, {billingAddr.state} - <span className="font-semibold">{billingAddr.zipCode}</span></p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

export default Address;