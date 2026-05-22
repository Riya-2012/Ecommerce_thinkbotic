"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    FaMapMarkerAlt,
    FaPlus,
    FaEdit,
    FaCheckCircle,
    FaTrash,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import toast from "react-hot-toast";


function Address() {

    const [addresses, setAddresses] = useState([]);
    const [selectedShippingId, setSelectedShippingId] = useState(null);
    const [selectedBillingId, setSelectedBillingId] = useState(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
    const [step, setStep] = useState(1);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [editedAddress, setEditedAddress] = useState({});

    useEffect(() => {
        if (billingSameAsShipping) {
            setSelectedBillingId(selectedShippingId);
        }
    }, [selectedShippingId, billingSameAsShipping]);

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
                shipping: {
                    fullName: addr.fullName,
                    mobile: addr.mobile,
                    address: addr.address,
                    street: addr.street,
                    city: addr.city,
                    state: addr.state,
                    zipCode: addr.zipCode,
                    type: addr.type,
                },
                billing: addr.billing || null,
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
            const shippingPayload = {
                userId, type: "Shipping",
                fullName: data.fullName, mobile: data.mobile,
                address: data.address, street: data.street,
                city: data.city, state: data.state, zipCode: data.zipCode,
            };
            await api.post(`/api/user/addresses`, shippingPayload);

            if (!billingSameAsShipping) {
                const billingPayload = {
                    userId, type: "Billing",
                    fullName: data.b_fullName, mobile: data.b_mobile,
                    address: data.b_address, street: data.b_street,
                    city: data.b_city, state: data.b_state, zipCode: data.b_zipCode,
                };
                await api.post(`/api/user/addresses`, billingPayload);
            }

            toast.success("Address saved successfully");
            reset();
            setIsAddingAddress(false);
            fetchAddresses();
        } catch (error) {
            console.log(error);
            toast.error("Failed to save address");
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            await api.delete(`/api/user/address/${id}`);
            setAddresses((prev) => prev.filter((addr) => addr.id !== id));
            toast.success("Address deleted successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete address");
        }
    };

    const handleEditClick = (id, address) => {
        setEditingAddressId(id);
        setEditedAddress({ ...address.shipping });
    };

    const handleSaveEditedAddress = async (id) => {
        try {
            await api.put(`/api/user/address/${id}`, editedAddress);
            setAddresses((prev) =>
                prev.map((addr) =>
                    addr.id === id ? { ...addr, shipping: { ...editedAddress } } : addr
                )
            );
            setEditingAddressId(null);
            toast.success("Address updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update address");
        }
    };

    // Get full address object by id
    const getAddressById = (id) => addresses.find(a => a.id === id);

    return (
        <>
            <div className="lg:col-span-2 flex flex-col gap-5">
                <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${step === 1 ? 'border-primary-blue/30 shadow-md ring-4 ring-primary-blue/5' : 'border-gray-100 opacity-90'}`}>

                    {/* Header */}
                    <div className="p-5 sm:p-6 flex justify-between items-center border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${step >= 1 ? 'bg-primary-blue text-white shadow-md shadow-primary-blue/20' : 'bg-gray-100 text-gray-400'}`}>1</span>
                            <h2 className="text-xl font-bold text-gray-800">Delivery & Billing Address</h2>
                        </div>
                        {step > 1 && (
                            <button onClick={() => setStep(1)} className="text-primary-blue text-sm font-semibold flex items-center gap-1.5 hover:text-blue-700 transition">
                                <FaEdit /> Change
                            </button>
                        )}
                    </div>

                    {/* STEP 1 CONTENT */}
                    {step === 1 && (
                        <div className="p-5 sm:p-8 transition-opacity duration-500 opacity-100 bg-gray-50/30">

                            {/* NO ADDRESSES */}
                            {addresses.length === 0 && !isAddingAddress && (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <FaMapMarkerAlt className="text-2xl" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">No Address Available</h3>
                                    <p className="text-gray-500 text-sm mb-6">Please add a shipping address to proceed with your order.</p>
                                    <button
                                        onClick={() => setIsAddingAddress(true)}
                                        className="px-6 py-3 bg-gradient-blue-red text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto transform hover:-translate-y-0.5">
                                        <FaPlus /> Add New Address
                                    </button>
                                </div>
                            )}

                            {/* ADDRESS LIST */}
                            {addresses.length > 0 && !isAddingAddress && (
                                <div className="space-y-5 animate-in fade-in duration-300">

                                    {/* SHIPPING SELECTION */}
                                    <h3 className="font-semibold text-gray-800 text-lg">Select Delivery Address</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {addresses.map(addr => (
                                            <div
                                                key={addr.id}
                                                className={`rounded-2xl border transition-all ${selectedShippingId === addr.id ? 'border-primary-blue bg-blue-50/40 ring-1 ring-primary-blue shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                            >
                                                {editingAddressId === addr.id ? (
                                                    /* EDIT FORM */
                                                    <div className="p-5">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <input value={editedAddress.fullName || ""} onChange={(e) => setEditedAddress({ ...editedAddress, fullName: e.target.value })} placeholder="Full Name" className="border border-gray-300 px-3 py-2 rounded-lg" />
                                                            <input value={editedAddress.mobile || ""} onChange={(e) => setEditedAddress({ ...editedAddress, mobile: e.target.value })} placeholder="Mobile" className="border border-gray-300 px-3 py-2 rounded-lg" />
                                                            <input value={editedAddress.address || ""} onChange={(e) => setEditedAddress({ ...editedAddress, address: e.target.value })} placeholder="Address" className="border border-gray-300 px-3 py-2 rounded-lg md:col-span-2" />
                                                            <input value={editedAddress.street || ""} onChange={(e) => setEditedAddress({ ...editedAddress, street: e.target.value })} placeholder="Street" className="border border-gray-300 px-3 py-2 rounded-lg" />
                                                            <input value={editedAddress.city || ""} onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })} placeholder="City" className="border border-gray-300 px-3 py-2 rounded-lg" />
                                                            <input value={editedAddress.state || ""} onChange={(e) => setEditedAddress({ ...editedAddress, state: e.target.value })} placeholder="State" className="border border-gray-300 px-3 py-2 rounded-lg" />
                                                            <input value={editedAddress.zipCode || ""} onChange={(e) => setEditedAddress({ ...editedAddress, zipCode: e.target.value })} placeholder="Zip Code" className="border border-gray-300 px-3 py-2 rounded-lg" />
                                                            <div className="flex gap-3 mt-2 md:col-span-2">
                                                                <button type="button" onClick={() => handleSaveEditedAddress(addr.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
                                                                <button type="button" onClick={() => setEditingAddressId(null)} className="bg-gray-200 px-4 py-2 rounded-lg text-sm">Cancel</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* ADDRESS CARD */
                                                    <label className="flex items-start gap-4 p-5 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="selectedAddress"
                                                            checked={selectedShippingId === addr.id}
                                                            onChange={() => setSelectedShippingId(addr.id)}
                                                            className="mt-1 w-4 h-4 text-primary-blue border-gray-300 focus:ring-primary-blue"
                                                        />
                                                        <div className="flex-grow">
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <span className="font-bold text-white p-1.5 px-2 bg-primary-blue rounded-lg text-xs">
                                                                    {addr.shipping.type || "Shipping"}
                                                                </span>
                                                                <p className="font-bold text-gray-800 text-base">{addr.shipping.fullName}</p>
                                                                {selectedShippingId === addr.id && <FaCheckCircle className="text-primary-blue text-sm" />}
                                                            </div>
                                                            <p className="text-gray-600 text-sm">{addr.shipping.address}, {addr.shipping.street}</p>
                                                            <p className="text-gray-600 text-sm">{addr.shipping.city}, {addr.shipping.state} - <span className="font-semibold">{addr.shipping.zipCode}</span></p>
                                                            <p className="text-gray-600 text-sm mt-1.5 font-medium">Mobile: <span className="text-gray-800">{addr.shipping.mobile}</span></p>
                                                        </div>
                                                        <div className="flex gap-2 shrink-0">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.preventDefault(); handleEditClick(addr.id, addr); }}
                                                                className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-yellow-200 transition"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.preventDefault(); handleDeleteAddress(addr.id); }}
                                                                className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-200 transition"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </label>
                                                )}
                                            </div>
                                        ))}
                                    </div>



                                    {/* BILLING SAME CHECKBOX */}
                                    {/* <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-4">
                                        <input
                                            type="checkbox"
                                            id="sameAsShipping"
                                            checked={billingSameAsShipping}
                                            onChange={(e) => {
                                                setBillingSameAsShipping(e.target.checked);
                                                if (e.target.checked) {
                                                    setSelectedBillingId(selectedShippingId);
                                                } else {
                                                    setSelectedBillingId(null);
                                                }
                                            }}
                                            className="w-5 h-5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue transition"
                                        />
                                        <label htmlFor="sameAsShipping" className="text-gray-700 font-medium cursor-pointer select-none">
                                            Billing address is same as shipping
                                        </label>
                                    </div> */}

                                    {/* BILLING SELECTION - only when unchecked */}
                                    {!billingSameAsShipping && (
                                        <div className="mt-6">
                                            <h3 className="font-semibold text-gray-800 text-lg mb-4">Select Billing Address</h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {addresses.map(addr => (
                                                    <label
                                                        key={addr.id}
                                                        className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${selectedBillingId === addr.id ? 'border-primary-red bg-red-50/40 ring-1 ring-primary-red shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="billingAddress"
                                                            checked={selectedBillingId === addr.id}
                                                            onChange={() => setSelectedBillingId(addr.id)}
                                                            className="mt-1 w-4 h-4 text-primary-red border-gray-300 focus:ring-primary-red"
                                                        />
                                                        <div className="flex-grow">
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <span className="font-bold text-white p-1.5 px-2 bg-red-500 rounded-lg text-xs">Billing</span>
                                                                <p className="font-bold text-gray-800 text-base">{addr.shipping.fullName}</p>
                                                                {selectedBillingId === addr.id && <FaCheckCircle className="text-primary-red text-sm" />}
                                                            </div>
                                                            <p className="text-gray-600 text-sm">{addr.shipping.address}, {addr.shipping.street}</p>
                                                            <p className="text-gray-600 text-sm">{addr.shipping.city}, {addr.shipping.state} - <span className="font-semibold">{addr.shipping.zipCode}</span></p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={() => setIsAddingAddress(true)} className="mt-2 text-primary-blue font-semibold text-sm flex items-center gap-1.5 hover:underline">
                                        <FaPlus className="text-xs" /> Add another address
                                    </button>
                                    {/* CONTINUE BUTTON */}
                                    <div className="pt-6 border-t border-gray-200 mt-6 flex justify-end">
                                        <button
                                            disabled={!selectedShippingId || !selectedBillingId}
                                            onClick={() => {
                                                setStep(2);
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            className="px-8 py-3.5 bg-gradient-blue-red text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ADD ADDRESS FORM */}
                            {isAddingAddress && (
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
                                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                        <h3 className="text-lg font-bold text-gray-800">Add New Address</h3>
                                        {addresses.length > 0 && (
                                            <button type="button" onClick={() => setIsAddingAddress(false)} className="text-gray-500 text-sm font-medium hover:text-gray-800 transition">Cancel</button>
                                        )}
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmitAddress)} className="space-y-8">
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

                                        <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                            <input type="checkbox" id="formSameAsShipping" checked={billingSameAsShipping} onChange={(e) => setBillingSameAsShipping(e.target.checked)} className="w-5 h-5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue transition" />
                                            <label htmlFor="formSameAsShipping" className="text-gray-700 font-medium cursor-pointer select-none">Billing address is the same as shipping address</label>
                                        </div>

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
                                            <button type="submit" className="w-full md:w-auto px-8 py-3.5 bg-gradient-blue-red text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                                Save Address
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ADDRESS SUMMARY (when step > 1) */}
                    {step > 1 && selectedShippingId && (() => {
                        const shippingAddr = getAddressById(selectedShippingId);
                        const billingAddr = getAddressById(selectedBillingId);
                        if (!shippingAddr) return null;

                        const isSame = selectedShippingId === selectedBillingId;

                        return (
                            <div className="px-5 sm:px-8 py-5 bg-gray-50/50 rounded-b-2xl">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* SHIPPING */}
                                    <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
                                        <h4 className="text-xs font-bold text-primary-blue uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <FaMapMarkerAlt /> Shipping To
                                        </h4>
                                        <p className="font-bold text-gray-800">{shippingAddr.shipping.fullName}</p>
                                        <p className="text-gray-600 text-sm mt-1">{shippingAddr.shipping.address}, {shippingAddr.shipping.street}</p>
                                        <p className="text-gray-600 text-sm">{shippingAddr.shipping.city}, {shippingAddr.shipping.state} - <span className="font-semibold">{shippingAddr.shipping.zipCode}</span></p>
                                        <p className="text-gray-600 text-sm mt-1 font-medium">Mobile: <span className="text-gray-800">{shippingAddr.shipping.mobile}</span></p>
                                    </div>

                                    {/* BILLING */}
                                    {billingAddr && (
                                        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <FaMapMarkerAlt /> Billing To
                                                {isSame && <span className="text-xs text-gray-400 font-normal normal-case">(same as shipping)</span>}
                                            </h4>
                                            <p className="font-bold text-gray-800">{billingAddr.shipping.fullName}</p>
                                            <p className="text-gray-600 text-sm mt-1">{billingAddr.shipping.address}, {billingAddr.shipping.street}</p>
                                            <p className="text-gray-600 text-sm">{billingAddr.shipping.city}, {billingAddr.shipping.state} - <span className="font-semibold">{billingAddr.shipping.zipCode}</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </>
    );
}

export default Address;