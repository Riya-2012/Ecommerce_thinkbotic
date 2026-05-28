"use client";

import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import api from "../lib/axios";
import toast from "react-hot-toast";

/**
 * AddressList
 *
 * Props:
 *   addresses        – array of address objects (from parent's state)
 *   onAddressesChange – callback(updatedAddresses) – parent syncs state
 *   selectable       – bool (default false) – show radio buttons for shipping/billing
 *   selectedShippingId – controlled value (required when selectable=true)
 *   selectedBillingId  – controlled value (required when selectable=true)
 *   onSelectShipping   – (id) => void
 *   onSelectBilling    – (id) => void
 */
function AddressList({
    addresses,
    onAddressesChange,
    selectable = false,
    selectedShippingId,
    selectedBillingId,
    onSelectShipping,
    onSelectBilling,
}) {
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [editedAddress, setEditedAddress] = useState({});

    const handleDeleteAddress = async (id) => {
        try {
            await api.delete(`/api/user/address/${id}`);
            const updated = addresses.filter((addr) => addr.id !== id);
            onAddressesChange(updated);
            toast.success("Address deleted successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete address");
        }
    };

    const handleEditClick = (addr) => {
        setEditingAddressId(addr.id);
        setEditedAddress({ ...addr });
    };

    const handleSaveEditedAddress = async (id) => {
        try {
            await api.put(`/api/user/address/${id}`, editedAddress);
            const updated = addresses.map((addr) =>
                addr.id === id ? { ...addr, ...editedAddress } : addr
            );
            onAddressesChange(updated);
            setEditingAddressId(null);
            toast.success("Address updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update address");
        }
    };

    if (addresses.length === 0) return null;

    return (
        <div className="grid grid-cols-1 gap-4">
            {addresses.map((addr) => {
                const isBillingType = addr.type === "Billing";
                const isSelected = selectable
                    ? isBillingType
                        ? selectedBillingId === addr.id
                        : selectedShippingId === addr.id
                    : false;

                return (
                    <div
                        key={addr.id}
                        className={`rounded-2xl border transition-all ${
                            isSelected
                                ? isBillingType
                                    ? "border-primary-red bg-red-50/10 shadow-sm ring-1 ring-primary-red/30"
                                    : "border-primary-blue bg-blue-50/10 shadow-sm ring-1 ring-primary-blue/30"
                                : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                        {editingAddressId === addr.id ? (
                            /* ── EDIT FORM ── */
                            <div className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { key: "fullName",  placeholder: "Full Name" },
                                        { key: "mobile",    placeholder: "Mobile" },
                                        { key: "address",   placeholder: "Address",  span: true },
                                        { key: "street",    placeholder: "Street" },
                                        { key: "city",      placeholder: "City" },
                                        { key: "state",     placeholder: "State" },
                                        { key: "zipCode",   placeholder: "Zip Code" },
                                    ].map(({ key, placeholder, span }) => (
                                        <input
                                            key={key}
                                            value={editedAddress[key] || ""}
                                            onChange={(e) =>
                                                setEditedAddress({ ...editedAddress, [key]: e.target.value })
                                            }
                                            placeholder={placeholder}
                                            className={`border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary-blue/20 outline-none${
                                                span ? " md:col-span-2" : ""
                                            }`}
                                        />
                                    ))}
                                    <div className="flex gap-3 mt-2 md:col-span-2">
                                        <button
                                            type="button"
                                            onClick={() => handleSaveEditedAddress(addr.id)}
                                            className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingAddressId(null)}
                                            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* ── ADDRESS CARD ── */
                            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
                                {selectable && (
                                    <input
                                        type="radio"
                                        name={isBillingType ? "billingAddress" : "shippingAddress"}
                                        checked={isSelected}
                                        onChange={() => {
                                            if (isBillingType) onSelectBilling?.(addr.id);
                                            else onSelectShipping?.(addr.id);
                                        }}
                                        className={`mt-1 w-4 h-4 shrink-0 border-gray-300 transition-all cursor-pointer ${
                                            isBillingType
                                                ? "text-primary-red focus:ring-primary-red"
                                                : "text-primary-blue focus:ring-primary-blue"
                                        }`}
                                    />
                                )}

                                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span
                                                className={`font-bold text-white p-1.5 px-2 rounded-lg text-xs ${
                                                    isBillingType ? "bg-primary-red" : "bg-primary-blue"
                                                }`}
                                            >
                                                {addr.type || "Address"}
                                            </span>
                                            <p className="font-bold text-gray-800 text-base truncate">
                                                {addr.fullName}
                                            </p>
                                        </div>
                                        <p className="text-gray-600 text-sm break-words">
                                            {addr.address}, {addr.street}
                                        </p>
                                        <p className="text-gray-600 text-sm break-words">
                                            {addr.city}, {addr.state} -{" "}
                                            <span className="font-semibold">{addr.zipCode}</span>
                                        </p>
                                        <p className="text-gray-600 text-sm mt-1.5 font-medium break-words">
                                            Mobile: <span className="text-gray-800">{addr.mobile}</span>
                                        </p>
                                    </div>

                                    <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                                        <button
                                            type="button"
                                            onClick={() => handleEditClick(addr)}
                                            className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-yellow-200 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteAddress(addr.id)}
                                            className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-200 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default AddressList;