
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

    const [
        selectedShippingId,
        setSelectedShippingId
    ] = useState(null);

    const [
        selectedBillingId,
        setSelectedBillingId
    ] = useState(null);

    const [isAddingAddress, setIsAddingAddress] =
        useState(false);

    const [billingSameAsShipping, setBillingSameAsShipping] =
        useState(true);

    const [step, setStep] = useState(1);

    const [editingAddressId, setEditingAddressId] =
        useState(null);

    const [editedAddress, setEditedAddress] =
        useState({});

    useEffect(() => {

        if (billingSameAsShipping) {

            setSelectedBillingId(
                selectedShippingId
            );

        }

    }, [
        selectedShippingId,
        billingSameAsShipping
    ]);


    const { user } = useAuth();

    const userId = user?._id || user?.id;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: "",
            mobile: "",
            address: "",
            street: "",
            city: "",
            state: "",
            zipCode: "",

            //    Billing
            b_fullName: "",
            b_mobile: "",
            b_address: "",
            b_street: "",
            b_city: "",
            b_state: "",
            b_zipCode: "",
        },
    });


    const fetchAddresses = async () => {
        if (!userId) return;

        try {

            const response = await api.get(
                `/api/user/addresses/${userId}`
            );

            const data = response.data || [];


            //    FORMAT DATA FOR UI
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
            console.log("Fetched Addresses:", formattedAddresses);

        } catch (error) {

            console.log(error);

            setAddresses([]);
        }
    };


    useEffect(() => {
        fetchAddresses();
    }, [userId]);




    const onSubmitAddress = async (data) => {

        try {

            //    SHIPPING ADDRESS
            const shippingPayload = {
                userId,
                type: "Shipping",
                fullName: data.fullName,
                mobile: data.mobile,

                address: data.address,

                street: data.street,

                city: data.city,

                state: data.state,

                zipCode: data.zipCode,

            };


            //    SAVE SHIPPING
            await api.post(
                `/api/user/addresses`,
                shippingPayload
            );


            //    BILLING ADDRESS
            if (!billingSameAsShipping) {

                const billingPayload = {

                    userId,

                    type: "Billing",

                    fullName: data.b_fullName,

                    mobile: data.b_mobile,

                    address: data.b_address,

                    street: data.b_street,

                    city: data.b_city,

                    state: data.b_state,

                    zipCode: data.b_zipCode,

                };


                await api.post(
                    `/api/user/addresses`,
                    billingPayload
                );
            }


            toast.success(
                "Address saved successfully"
            );


            //    RESET FORM
            reset();

            setIsAddingAddress(false);


            //    REFRESH
            fetchAddresses();

        } catch (error) {

            console.log(error);

            toast.error(
                "Failed to save address"
            );
        }
    };




    const handleDeleteAddress = async (id) => {

        try {

            await api.delete(
                `/api/user/address/${id}`
            );
            setAddresses((prev) =>
                prev.filter((addr) => addr.id !== id)
            );


            toast.success(
                "Address deleted successfully"
            );

        } catch (error) {

            console.log(error);

            toast.error(
                "Failed to delete address"
            );
        }
    };



    const handleEditClick = (id, address) => {

        setEditingAddressId(id);

        setEditedAddress({
            ...address.shipping,
        });
    };




    const handleSaveEditedAddress = async (id) => {

        try {

            const response = await api.put(
                `/api/user/address/${id}`,
                editedAddress
            );


            setAddresses((prev) =>
                prev.map((addr) =>
                    addr.id === id
                        ? {
                            ...addr,
                            shipping: {
                                ...editedAddress,
                            },
                        }
                        : addr
                )
            );


            setEditingAddressId(null);


            toast.success(
                "Address updated successfully"
            );

        } catch (error) {

            console.log(error);

            toast.error(
                "Failed to update address"
            );
        }
    };


    return (

        <>

            {/* YOUR EXISTING UI HERE */}
            <div className="lg:col-span-2 flex flex-col gap-5">

                {/* STEP 1: ADDRESS */}
                <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${step === 1 ? 'border-primary-blue/30 shadow-md ring-4 ring-primary-blue/5' : 'border-gray-100 opacity-90'}`}>
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

                    {/* Content for Step 1 */}
                    {step === 1 && (
                        <div className="p-5 sm:p-8 transition-opacity duration-500 opacity-100 bg-gray-50/30">

                            {/* 1A: NO ADDRESSES YET */}
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

                            {/* 1B: SHOW LIST OF ADDRESSES */}
                            {addresses.length > 0 && !isAddingAddress && (
                                <div className="space-y-5 animate-in fade-in duration-300">
                                    <h3 className="font-semibold text-gray-800 text-lg">Select Delivery Address</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {addresses.map(addr => (
                                            <label key={addr.id} className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${selectedShippingId === addr.id ? 'border-primary-blue bg-blue-50/40 ring-1 ring-primary-blue shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>

                                                <input
                                                    type="radio"
                                                    name="selectedAddress"
                                                    checked={selectedShippingId === addr.id}
                                                    onChange={() => setSelectedShippingId(addr.id)}
                                                    className="mt-1 w-4 h-4 text-primary-blue border-gray-300 focus:ring-primary-blue"
                                                />
                                                {/* <div className="flex-grow">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <p className="font-bold text-gray-800 text-base">{addr.shipping.fullName}</p>
                                                        {selectedShippingId === addr.id && <FaCheckCircle className="text-primary-blue text-sm" />}
                                                    </div>
                                                    <p className="text-gray-600 text-sm">{addr.shipping.address}, {addr.shipping.street}</p>
                                                    <p className="text-gray-600 text-sm">{addr.shipping.city}, {addr.shipping.state} - <span className="font-semibold">{addr.shipping.zipCode}</span></p>
                                                    <p className="text-gray-600 text-sm mt-1.5 font-medium">Mobile: <span className="text-gray-800">{addr.shipping.mobile}</span></p>
                                                </div> */}
                                                <div className="flex-grow">

                                                    {editingAddressId === addr.id ? (

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                                            <input
                                                                value={editedAddress.fullName || ""}
                                                                onChange={(e) =>
                                                                    setEditedAddress({
                                                                        ...editedAddress,
                                                                        fullName: e.target.value,
                                                                    })
                                                                }
                                                                placeholder="Full Name"
                                                                className="border border-gray-300 px-3 py-2 rounded-lg"
                                                            />

                                                            <input
                                                                value={editedAddress.mobile || ""}
                                                                onChange={(e) =>
                                                                    setEditedAddress({
                                                                        ...editedAddress,
                                                                        mobile: e.target.value,
                                                                    })
                                                                }
                                                                placeholder="Mobile"
                                                                className="border border-gray-300 px-3 py-2 rounded-lg"
                                                            />

                                                            <input
                                                                value={editedAddress.address || ""}
                                                                onChange={(e) =>
                                                                    setEditedAddress({
                                                                        ...editedAddress,
                                                                        address: e.target.value,
                                                                    })
                                                                }
                                                                placeholder="Address"
                                                                className="border border-gray-300 px-3 py-2 rounded-lg md:col-span-2"
                                                            />

                                                            <input
                                                                value={editedAddress.street || ""}
                                                                onChange={(e) =>
                                                                    setEditedAddress({
                                                                        ...editedAddress,
                                                                        street: e.target.value,
                                                                    })
                                                                }
                                                                placeholder="Street"
                                                                className="border border-gray-300 px-3 py-2 rounded-lg"
                                                            />

                                                            <input
                                                                value={editedAddress.city || ""}
                                                                onChange={(e) =>
                                                                    setEditedAddress({
                                                                        ...editedAddress,
                                                                        city: e.target.value,
                                                                    })
                                                                }
                                                                placeholder="City"
                                                                className="border border-gray-300 px-3 py-2 rounded-lg"
                                                            />

                                                            <input
                                                                value={editedAddress.state || ""}
                                                                onChange={(e) =>
                                                                    setEditedAddress({
                                                                        ...editedAddress,
                                                                        state: e.target.value,
                                                                    })
                                                                }
                                                                placeholder="State"
                                                                className="border border-gray-300 px-3 py-2 rounded-lg"
                                                            />

                                                            <input
                                                                value={editedAddress.zipCode || ""}
                                                                onChange={(e) =>
                                                                    setEditedAddress({
                                                                        ...editedAddress,
                                                                        zipCode: e.target.value,
                                                                    })
                                                                }
                                                                placeholder="Zip Code"
                                                                className="border border-gray-300 px-3 py-2 rounded-lg"
                                                            />

                                                            <div className="flex gap-3 mt-2">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleSaveEditedAddress(addr.id)
                                                                    }
                                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                                                                >
                                                                    Save
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setEditingAddressId(null)
                                                                    }
                                                                    className="bg-gray-200 px-4 py-2 rounded-lg text-sm"
                                                                >
                                                                    Cancel
                                                                </button>

                                                            </div>

                                                        </div>

                                                    ) : (

                                                        <>

                                                            <div className="flex items-center gap-2 mb-1.5">


                                                                <div className="font-bold text-gray-800 p-2 bg-primary-blue/10 rounded-lg text-sm text-primary-blue">
                                                                    {addr.shipping.type === "Shipping" ? "Shipping " : "Billing "}
                                                                </div>
                                                                <p className="font-bold text-gray-800 text-base">
                                                                    {addr.shipping.fullName}
                                                                </p>

                                                                {selectedShippingId === addr.id && (
                                                                    <FaCheckCircle className="text-primary-blue text-sm" />
                                                                )}

                                                            </div>

                                                            <p className="text-gray-600 text-sm">
                                                                {addr.shipping.address},
                                                                {addr.shipping.street}


                                                            </p>

                                                            <p className="text-gray-600 text-sm">

                                                                {addr.shipping.city},
                                                                {addr.shipping.state} -
                                                                <span className="font-semibold">
                                                                    {addr.shipping.zipCode}
                                                                </span>
                                                            </p>

                                                            <p className="text-gray-600 text-sm mt-1.5 font-medium">
                                                                Mobile:
                                                                <span className="text-gray-800">
                                                                    {addr.shipping.mobile}
                                                                </span>
                                                            </p>
                                                        </>

                                                    )}

                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(addr.id, addr)
                                                    }
                                                    className="text-primary-blue text-sm font-medium"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteAddress(addr.id)
                                                    }
                                                    className="text-red-500 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </label>
                                        ))}
                                    </div>

                                    <button onClick={() => setIsAddingAddress(true)} className="mt-4 text-primary-blue font-semibold text-sm flex items-center gap-1.5 hover:underline">
                                        <FaPlus className="text-xs" /> Add another address
                                    </button>
                                    {/* BILLING SAME CHECKBOX */}

                                    <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-6">

                                        <input
                                            type="checkbox"
                                            id="sameAsShipping"
                                            checked={billingSameAsShipping}
                                            onChange={(e) => {

                                                setBillingSameAsShipping(
                                                    e.target.checked
                                                );

                                                if (e.target.checked) {

                                                    setSelectedBillingId(
                                                        selectedShippingId
                                                    );

                                                } else {

                                                    setSelectedBillingId(null);

                                                }
                                            }}
                                            className="w-5 h-5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue transition"
                                        />

                                        <label
                                            htmlFor="sameAsShipping"
                                            className="text-gray-700 font-medium cursor-pointer select-none"
                                        >

                                            Billing address is same as shipping

                                        </label>

                                    </div>


                                    {/* BILLING ADDRESS SELECTION */}

                                    {!billingSameAsShipping && (

                                        <div className="mt-8">

                                            <h3 className="font-semibold text-gray-800 text-lg mb-4">

                                                Select Billing Address

                                            </h3>

                                            <div className="grid grid-cols-1 gap-4">

                                                {addresses.map(addr => (

                                                    <label
                                                        key={addr.id}
                                                        className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${selectedBillingId === addr.id
                                                                ? 'border-primary-red bg-red-50/40 ring-1 ring-primary-red shadow-sm'
                                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                            }`}
                                                    >

                                                        <input
                                                            type="radio"
                                                            name="billingAddress"
                                                            checked={
                                                                selectedBillingId === addr.id
                                                            }
                                                            onChange={() =>
                                                                setSelectedBillingId(addr.id)
                                                            }
                                                            className="mt-1 w-4 h-4 text-primary-red border-gray-300 focus:ring-primary-red"
                                                        />

                                                        <div className="flex-grow">

                                                            <div className="flex items-center gap-2 mb-1.5">

                                                                <div className="font-bold text-gray-800 p-2 bg-primary-red/10 rounded-lg text-sm text-primary-red">

                                                                    Billing

                                                                </div>

                                                                <p className="font-bold text-gray-800 text-base">

                                                                    {addr.shipping.fullName}

                                                                </p>

                                                            </div>

                                                            <p className="text-gray-600 text-sm">

                                                                {addr.shipping.address},
                                                                {addr.shipping.street}

                                                            </p>

                                                            <p className="text-gray-600 text-sm">

                                                                {addr.shipping.city},
                                                                {addr.shipping.state}

                                                            </p>

                                                        </div>

                                                    </label>

                                                ))}

                                            </div>

                                        </div>

                                    )}
                                    <div className="pt-6 border-t border-gray-200 mt-6 flex justify-end">
                                        <button
                                           disabled={!selectedShippingId ||  !selectedBillingId}
                                            onClick={() => {

                                                const shippingAddress =
                                                    addresses.find(
                                                        a => a.id === selectedShippingId
                                                    );

                                                const billingAddress =
                                                    addresses.find(
                                                        a => a.id === selectedBillingId
                                                    );

                                                console.log({
                                                    shippingAddress,
                                                    billingAddress
                                                });

                                                setStep(2);

                                                window.scrollTo({
                                                    top: 0,
                                                    behavior: "smooth",
                                                });

                                            }}
                                            className="px-8 py-3.5 bg-gradient-blue-red text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                            Continue to Payment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 1C: ADD ADDRESS FORM */}
                            {isAddingAddress && (
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
                                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                        <h3 className="text-lg font-bold text-gray-800">Add New Address</h3>
                                        {addresses.length > 0 && (
                                            <button type="button" onClick={() => setIsAddingAddress(false)} className="text-gray-500 text-sm font-medium hover:text-gray-800 transition">Cancel</button>
                                        )}
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmitAddress)} className="space-y-8">
                                        {/* Shipping Section */}
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

                                        {/* Billing Same Checkbox */}
                                        <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                            <input
                                                type="checkbox"
                                                id="sameAsShipping"
                                                checked={billingSameAsShipping}
                                                onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                                                className="w-5 h-5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue transition"
                                            />
                                            <label htmlFor="sameAsShipping" className="text-gray-700 font-medium cursor-pointer select-none">
                                                Billing address is the same as shipping address
                                            </label>
                                        </div>

                                        {/* Billing Section (Conditional) */}
                                        {!billingSameAsShipping && (
                                            <div className="pt-6 border-t border-gray-100 transition-all duration-500 opacity-100">
                                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-gray-400" /> Billing Address
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Full Name *</label>
                                                        <input {...register("b_fullName", { required: !billingSameAsShipping })} placeholder="John Doe" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Mobile Number *</label>
                                                        <input {...register("b_mobile", { required: !billingSameAsShipping })} placeholder="10-digit number" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Complete Address *</label>
                                                        <input {...register("b_address", { required: !billingSameAsShipping })} placeholder="House/Flat No., Building Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Street / Area</label>
                                                        <input {...register("b_street")} placeholder="Street / Area Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">City *</label>
                                                        <input {...register("b_city", { required: !billingSameAsShipping })} placeholder="City" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">State *</label>
                                                        <input {...register("b_state", { required: !billingSameAsShipping })} placeholder="State" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">PIN Code *</label>
                                                        <input {...register("b_zipCode", { required: !billingSameAsShipping })} placeholder="000000" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                                            <button type="submit" className="w-full md:w-auto px-8 py-3.5 bg-gradient-blue-red text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                                Save Address
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Address Summary (Inactive state when step > 1) */}
                    {step > 1 && selectedShippingId && (
                        <div className="px-5 sm:px-8 py-5 bg-gray-50/50 rounded-b-2xl transition-opacity duration-300 opacity-100">
                            {(() => {
                                const shippingAddr =
                                    addresses.find(
                                        a => a.id === selectedShippingId
                                    );

                                const billingAddr =
                                    addresses.find(
                                        a => a.id === selectedBillingId
                                    );
                                if (!shippingAddr) return null;
                                return (
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FaMapMarkerAlt /> Shipping To</h4>
                                            <p className="font-bold text-gray-800 text-base">{shippingAddr.fullName}</p>
                                            <p className="text-gray-600 text-sm mt-1">{shippingAddr.address},{shippingAddr.street}</p>
                                            <p className="text-gray-600 text-sm">{shippingAddr.city}, {shippingAddr.state} - <span className="font-semibold">{shippingAddr.zipCode}</span></p>
                                            <p className="text-gray-600 text-sm mt-1 font-medium">Mobile: <span className="text-gray-800">{shippingAddr.mobile}</span></p>
                                        </div>
                                        {billingAddr && (
                                            <div className="flex-1 md:border-l md:border-gray-200 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FaMapMarkerAlt /> Billing To</h4>
                                                <p className="font-bold text-gray-800 text-base">{billingAddr.fullName}</p>
                                                <p className="text-gray-600 text-sm mt-1">{billingAddr.address}, {billingAddr.street}</p>
                                                <p className="text-gray-600 text-sm">{billingAddr.city}, {billingAddr.state} - <span className="font-semibold">{billingAddr.zipCode}</span></p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })()}
                        </div>
                    )}
                </div>
            </div>

        </>

    );
}

export default Address;