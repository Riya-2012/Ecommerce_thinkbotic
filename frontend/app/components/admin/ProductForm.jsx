"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  FaPlus, FaMinus, FaCloudUploadAlt, FaPalette,
  FaTimes, FaChevronDown, FaChevronUp, FaStar, FaRegStar,
} from "react-icons/fa";
import {
  MdInventory, MdLocalOffer, MdVerified, MdInfo,
  MdRateReview, MdQuestionAnswer,
} from "react-icons/md";
import toast from "react-hot-toast";
import api, { BASE_URL } from "@/app/lib/axios";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[#0f172a] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition placeholder-gray-400";
const textareaCls = inputCls + " resize-none min-h-[90px]";

const emptyReview = () => ({ name: "", date: "", rating: 0, title: "", body: "", verified: "true", helpful: "0" });
const emptyQA     = () => ({ askedBy: "", askedDate: "", question: "", answeredBy: "", answeredDate: "", answer: "" });
const emptyKV     = () => ({ key: "", value: "" });

// ─── Sub-components ───────────────────────────────────────────────────────────
function Section({ icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-600">{icon}</span>
          <span className="font-semibold text-[#0f172a] text-sm">{title}</span>
        </div>
        <span className="text-gray-400 text-xs">{open ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>
      {open && <div className="p-6">{children}</div>}
    </div>
  );
}

function Field({ label, required, error, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

function KVEditor({ field, data, onChange, onAdd, onRemove }) {
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input type="text" name="key" value={item.key}
            onChange={(e) => onChange(e, index, field)} placeholder="Key"
            className={inputCls + " flex-1"} />
          <input type="text" name="value" value={item.value}
            onChange={(e) => onChange(e, index, field)} placeholder="Value"
            className={inputCls + " flex-[2]"} />
          <div className="flex gap-1">
            {index === data.length - 1 && (
              <button type="button" onClick={() => onAdd(field)}
                className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition">
                <FaPlus size={11} />
              </button>
            )}
            {index > 0 && (
              <button type="button" onClick={() => onRemove(index, field)}
                className="w-8 h-8 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition">
                <FaMinus size={11} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button"
          onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)} className="text-xl transition-transform hover:scale-110">
          {star <= (hovered ?? value)
            ? <FaStar className="text-amber-400" />
            : <FaRegStar className="text-gray-300" />}
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-xs font-semibold text-amber-500">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  );
}

function ReviewCard({ review, index, onChange, onRemove, isLast, onAdd }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Review #{index + 1}</span>
        <div className="flex gap-1">
          {isLast && (
            <button type="button" onClick={onAdd}
              className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition">
              <FaPlus size={10} />
            </button>
          )}
          {index > 0 && (
            <button type="button" onClick={onRemove}
              className="w-7 h-7 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition">
              <FaTimes size={10} />
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Reviewer Name">
          <input type="text" value={review.name} onChange={(e) => onChange(index, "name", e.target.value)}
            placeholder="e.g. Rahul Sharma" className={inputCls} />
        </Field>
        <Field label="Date">
          <input type="date" value={review.date} onChange={(e) => onChange(index, "date", e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label="Rating">
        <StarRating value={review.rating} onChange={(val) => onChange(index, "rating", val)} />
      </Field>
      <Field label="Review Title">
        <input type="text" value={review.title} onChange={(e) => onChange(index, "title", e.target.value)}
          placeholder="e.g. Great product!" className={inputCls} />
      </Field>
      <Field label="Review Body">
        <textarea value={review.body} onChange={(e) => onChange(index, "body", e.target.value)}
          placeholder="Detailed review..." className={textareaCls} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Verified Purchase">
          <select value={review.verified} onChange={(e) => onChange(index, "verified", e.target.value)} className={inputCls}>
            <option value="true">Yes — Verified</option>
            <option value="false">No</option>
          </select>
        </Field>
        <Field label="Helpful Votes">
          <input type="number" min="0" value={review.helpful}
            onChange={(e) => onChange(index, "helpful", e.target.value)} placeholder="0" className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

function QACard({ qa, index, onChange, onRemove, isLast, onAdd }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">Q</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Question #{index + 1}</span>
        </div>
        <div className="flex gap-1">
          {isLast && (
            <button type="button" onClick={onAdd}
              className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition">
              <FaPlus size={10} />
            </button>
          )}
          {index > 0 && (
            <button type="button" onClick={onRemove}
              className="w-7 h-7 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition">
              <FaTimes size={10} />
            </button>
          )}
        </div>
      </div>
      <div className="space-y-3 pl-3 border-l-2 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Asked By">
            <input type="text" value={qa.askedBy} onChange={(e) => onChange(index, "askedBy", e.target.value)}
              placeholder="e.g. Priya K." className={inputCls} />
          </Field>
          <Field label="Asked On">
            <input type="date" value={qa.askedDate} onChange={(e) => onChange(index, "askedDate", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Question">
          <textarea value={qa.question} onChange={(e) => onChange(index, "question", e.target.value)}
            placeholder="e.g. Is this compatible with Android 14?" className={textareaCls + " min-h-[70px]"} />
        </Field>
      </div>
      <div className="space-y-3 pl-3 border-l-2 border-emerald-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">A</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Answer</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Answered By">
            <input type="text" value={qa.answeredBy} onChange={(e) => onChange(index, "answeredBy", e.target.value)}
              placeholder="e.g. Seller / Admin" className={inputCls} />
          </Field>
          <Field label="Answered On">
            <input type="date" value={qa.answeredDate} onChange={(e) => onChange(index, "answeredDate", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Answer">
          <textarea value={qa.answer} onChange={(e) => onChange(index, "answer", e.target.value)}
            placeholder="Provide a helpful answer..." className={textareaCls + " min-h-[70px]"} />
        </Field>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
//
// Props:
//   mode          — "add" | "edit" | "duplicate"
//   productId     — required for "edit" (the _id to PATCH)
//   initialData   — pre-fetched product object (for edit / duplicate)
//   onSuccess     — optional callback after save; defaults to router.push("/admin/products")
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductForm({ mode = "add", productId, initialData, onSuccess }) {
  const router = useRouter();

  // ── derive UI labels from mode ──────────────────────────────────────────
  const isEdit      = mode === "edit";
  const isDuplicate = mode === "duplicate";
  const isAdd       = mode === "add";

  const pageTitle    = isEdit ? "Edit Product" : isDuplicate ? "Duplicate Product" : "Add Product";
  const pageSubtitle = isEdit
    ? "Update the product details below"
    : isDuplicate
    ? "A copy of the original — modify as needed"
    : "Fill in the details to list a new product";
  const submitLabel  = isEdit ? "Update Product" : isDuplicate ? "Save as New Product" : "Save Product";

  // ── react-hook-form ─────────────────────────────────────────────────────
  const {
    register, handleSubmit, formState: { errors, isSubmitting },
    reset, setValue, watch,
  } = useForm({
    // Pre-fill RHF fields from initialData when available
    defaultValues: initialData
      ? {
          name:        initialData.name        || "",
          Brand:       initialData.Brand        || "",
          category:    initialData.category    || "",
          subCategory: initialData.subCategory || "",
          stock:       initialData.stock       ?? "",
          oldPrice:    initialData.oldPrice    ?? "",
          price:       initialData.price       ?? "",
          gst:         initialData.gst         ?? "",
          descriptions: initialData.descriptions || "",
        }
      : {},
  });

  // ── local state — initialised from initialData when provided ───────────
  const safeKV = (arr) =>
    Array.isArray(arr) && arr.length ? arr : [emptyKV()];

  const [formData, setFormData] = useState({
    discount:           initialData?.discount           || "",
    priceAlert:         initialData?.priceAlert         || "",
    stock:              initialData?.stock              ?? "",
    img:                null,                              // always null until user picks new file
    imageUrl:           "",
    productDescription: initialData?.productDescription || "",
    specifications:     safeKV(initialData?.specifications),
    warranty:           safeKV(initialData?.warranty),
    otherinfo:          safeKV(initialData?.otherinfo),
    otherinfoText:      initialData?.otherinfoText      || "",
    offers:             safeKV(initialData?.offers),
    metaTitle:          initialData?.metaTitle          || "",
    metaDescription:    initialData?.metaDescription    || "",
    metaKeywords:       initialData?.metaKeywords       || "",
  });

  // Existing server image (edit / duplicate) — shown as preview until user replaces it
  const [existingImgUrl, setExistingImgUrl] = useState(
    initialData?.img ? `${BASE_URL}/${initialData.img}` : null
  );
  const [mainImagePreview, setMainImagePreview] = useState(null); // new local upload preview

  // Color variants
  const [colorImages, setColorImages] = useState(
    initialData?.colorVariants?.length
      ? initialData.colorVariants.map((cv) => ({
          color:    cv.color || "",
          images:   [],                          // can't pre-load File objects from server
          previews: cv.images || [],             // existing server URLs shown as previews
          existing: cv.images || [],             // keep track of which are already saved
        }))
      : [{ color: "", images: [], previews: [], existing: [] }]
  );

  const [isSingleImage, setIsSingleImage] = useState(false);
  const [isColorWise,   setIsColorWise]   = useState(false);

  // Reviews & Q&A
  const [reviews, setReviews] = useState(
    initialData?.reviews?.length ? initialData.reviews : [emptyReview()]
  );
  const [qaList, setQaList] = useState(
    initialData?.qaList?.length ? initialData.qaList : [emptyQA()]
  );

  // ── auto-calculate discount ────────────────────────────────────────────
  const watchPrice    = watch("price");
  const watchOldPrice = watch("oldPrice");

  useEffect(() => {
    const price    = parseFloat(watchPrice);
    const oldPrice = parseFloat(watchOldPrice);
    if (oldPrice > 0 && price > 0 && oldPrice > price) {
      setFormData((prev) => ({
        ...prev,
        discount: Math.round(((oldPrice - price) / oldPrice) * 100).toString(),
      }));
    } else {
      setFormData((prev) => ({ ...prev, discount: "" }));
    }
  }, [watchPrice, watchOldPrice]);

  // ── handlers ──────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, index, field) => {
    const { name, value } = e.target;
    const updated = [...formData[field]];
    updated[index][name] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const handleAddField    = (field) => setFormData({ ...formData, [field]: [...formData[field], emptyKV()] });
  const handleRemoveField = (index, field) =>
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });

  const validateImage = async (fileList) => {
    if (!fileList || fileList.length === 0) return "Image is required";
    const file = fileList[0];
    const fileSizeKB = file.size / 1024;
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (fileSizeKB < 1 || fileSizeKB > 500) resolve("Image must be between 1–500 KB.");
        else resolve(true);
      };
      img.onerror = () => resolve("Invalid image file.");
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsSingleImage(true);
      setIsColorWise(false);
      const url = URL.createObjectURL(file);
      setMainImagePreview(url);
      setExistingImgUrl(null); // replaced
      setFormData((prev) => ({ ...prev, img: file, imageUrl: url }));
    } else {
      setIsSingleImage(false);
      setMainImagePreview(null);
    }
  };

  const handleColorImageChange = (idx, field, value) => {
    const updated = [...colorImages];
    if (field === "images") {
      updated[idx].images   = Array.from(value);
      updated[idx].previews = [
        ...updated[idx].existing,
        ...Array.from(value).map((f) => URL.createObjectURL(f)),
      ];
      const anySelected = updated.some((ci) => ci.images.length > 0);
      setIsColorWise(anySelected);
      if (anySelected) setIsSingleImage(false);
    } else {
      updated[idx][field] = value;
    }
    setColorImages(updated);
  };

  // Reviews
  const handleReviewChange = (index, field, value) => {
    const updated = [...reviews];
    updated[index][field] = value;
    setReviews(updated);
  };
  const addReview    = () => setReviews([...reviews, emptyReview()]);
  const removeReview = (i) => setReviews(reviews.filter((_, idx) => idx !== i));

  // Q&A
  const handleQAChange = (index, field, value) => {
    const updated = [...qaList];
    updated[index][field] = value;
    setQaList(updated);
  };
  const addQA    = () => setQaList([...qaList, emptyQA()]);
  const removeQA = (i) => setQaList(qaList.filter((_, idx) => idx !== i));

  // ── submit ─────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    const merged = { ...data, ...formData };
    const fd = new FormData();

    Object.entries(merged).forEach(([key, value]) => {
      if (key === "img") {
        if (formData.img) fd.append("img", formData.img);
        // if no new file: edit keeps existing img on server (backend should handle)
      } else if (Array.isArray(value) && value.length && typeof value[0] === "object") {
        fd.append(key, JSON.stringify(value));
      } else if (!["images", "imagesPreview"].includes(key)) {
        fd.append(key, value ?? "");
      }
    });

    colorImages.forEach(({ color, images, existing }) => {
      if (color) {
        images.forEach((imgFile) => fd.append("colorImages", imgFile));
        fd.append("colorNames", color);
        // tell backend which images already exist so it doesn't delete them
        fd.append("existingColorImages", JSON.stringify(existing));
      }
    });
    fd.append("colorImageCounts", JSON.stringify(colorImages.map((ci) => ci.images.length)));
    fd.append("reviews", JSON.stringify(reviews.filter((r) => r.body || r.rating > 0)));
    fd.append("qaList",  JSON.stringify(qaList.filter((q) => q.question)));

    try {
      if (isEdit) {
        await api.put(`api/admin/products/${productId}`, fd);
        toast.success("Product updated successfully!");
      } else {
        // both "add" and "duplicate" POST to the same endpoint
        await api.post("api/admin/productpage", fd);
        toast.success(isDuplicate ? "Product duplicated successfully!" : "Product added successfully!");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/products");
      }

      if (!isEdit) {
        // Only fully reset on add / duplicate — not on edit
        reset();
        setFormData({
          discount: "", priceAlert: "", stock: "", img: null, imageUrl: "",
          productDescription: "", otherinfoText: "",
          specifications: [emptyKV()], warranty: [emptyKV()],
          otherinfo: [emptyKV()], offers: [emptyKV()],
          metaTitle: "", metaDescription: "", metaKeywords: "",
        });
        setColorImages([{ color: "", images: [], previews: [], existing: [] }]);
        setMainImagePreview(null);
        setExistingImgUrl(null);
        setReviews([emptyReview()]);
        setQaList([emptyQA()]);
      }
    } catch {
      toast.error(isEdit ? "Failed to update product." : "Failed to save product.");
    }
  };

  // ── current image to show (new upload takes precedence over existing) ──
  const shownImage = mainImagePreview || existingImgUrl;

  // ── render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-[#0f172a]">{pageTitle}</h1>
            {/* Mode badge */}
            {isDuplicate && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-600 text-xs font-semibold">
                Duplicate
              </span>
            )}
            {isEdit && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-600 text-xs font-semibold">
                Editing
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">{pageSubtitle}</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-red-500 text-white font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-60">
            {isSubmitting
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <FaPlus size={12} />}
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── LEFT (2/3) ── */}
          <div className="xl:col-span-2 space-y-0">

            {/* Basic Info */}
            <Section icon={<MdInventory size={18} />} title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Field label="Product Name" required error={errors.name?.message}>
                    <input type="text" placeholder="e.g. Sony WH-1000XM5" className={inputCls}
                      {...register("name", { required: "Name is required" })} />
                  </Field>
                </div>
                <Field label="Brand">
                  <input type="text" placeholder="e.g. Sony" className={inputCls} {...register("Brand")} />
                </Field>
                <Field label="Category" required error={errors.category?.message}>
                  <input type="text" placeholder="e.g. Electronics" className={inputCls}
                    {...register("category", { required: "Category is required" })} />
                </Field>
                <Field label="Sub-Category" required error={errors.subCategory?.message}>
                  <input type="text" placeholder="e.g. Headphones" className={inputCls}
                    {...register("subCategory", { required: "Sub-Category is required" })} />
                </Field>
                <Field label="Stock" required error={errors.stock?.message}>
                  <input type="number" placeholder="0" className={inputCls}
                    value={formData.stock}
                    {...register("stock", { required: "Stock is required" })}
                    onChange={handleInputChange} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Short Description">
                    <textarea placeholder="Brief description..." className={textareaCls} {...register("descriptions")} />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Detailed Product Description">
                    <textarea placeholder="Full product description..." className={textareaCls + " min-h-[130px]"}
                      name="productDescription" value={formData.productDescription} onChange={handleInputChange} />
                  </Field>
                </div>
              </div>
            </Section>

            {/* Pricing */}
            <Section icon={<MdLocalOffer size={18} />} title="Pricing & GST">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Old Price (MRP)" required error={errors.oldPrice?.message}>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                    <input type="number" placeholder="0.00" className={inputCls + " pl-8"}
                      {...register("oldPrice", { required: "Old Price is required" })} />
                  </div>
                </Field>
                <Field label="Selling Price" required error={errors.price?.message}>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                    <input type="number" placeholder="0.00" className={inputCls + " pl-8"}
                      value={formData.price || ""}
                      {...register("price", { required: "Price is required" })}
                      onChange={handleInputChange} />
                  </div>
                  {watchPrice && !isNaN(Number(watchPrice)) && (
                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                      You receive: ₹{(Number(watchPrice) * 0.97).toFixed(2)} (after 3% fee)
                    </p>
                  )}
                </Field>
                <Field label="Discount (%)">
                  <input type="text" readOnly
                    value={formData.discount ? `${formData.discount}% OFF` : ""}
                    placeholder="Auto-calculated"
                    className={inputCls + " bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold cursor-not-allowed"} />
                </Field>
                <Field label="GST (%)" required error={errors.gst?.message}>
                  <input type="number" placeholder="e.g. 18" className={inputCls}
                    {...register("gst", { required: "GST is required" })} />
                </Field>
                <Field label="Price Alert">
                  <input type="text" name="priceAlert" value={formData.priceAlert}
                    onChange={handleInputChange} placeholder="e.g. Limited time offer!" className={inputCls} />
                </Field>
              </div>
            </Section>

            {/* Specifications */}
            <Section icon={<MdVerified size={18} />} title="Specifications">
              <KVEditor field="specifications" data={formData.specifications}
                onChange={handleArrayChange} onAdd={handleAddField} onRemove={handleRemoveField} />
            </Section>

            {/* Warranty */}
            <Section icon={<MdVerified size={18} />} title="Warranty">
              <KVEditor field="warranty" data={formData.warranty}
                onChange={handleArrayChange} onAdd={handleAddField} onRemove={handleRemoveField} />
            </Section>

            {/* Other Info */}
            <Section icon={<MdInfo size={18} />} title="Other Information" defaultOpen={false}>
              <div className="space-y-4">
                <KVEditor field="otherinfo" data={formData.otherinfo}
                  onChange={handleArrayChange} onAdd={handleAddField} onRemove={handleRemoveField} />
                <Field label="Plain Text Info">
                  <textarea name="otherinfoText" value={formData.otherinfoText}
                    onChange={handleInputChange} placeholder="Any additional info..." className={textareaCls} />
                </Field>
              </div>
            </Section>

            {/* Offers */}
            <Section icon={<MdLocalOffer size={18} />} title="Offers & Deals" defaultOpen={false}>
              <KVEditor field="offers" data={formData.offers}
                onChange={handleArrayChange} onAdd={handleAddField} onRemove={handleRemoveField} />
            </Section>

            {/* Reviews */}
            <Section icon={<MdRateReview size={18} />} title="Customer Reviews" defaultOpen={false}>
              <div className="space-y-4">
                <p className="text-xs text-gray-400">Pre-seed reviews shown on the product page.</p>
                {reviews.map((review, index) => (
                  <ReviewCard key={index} review={review} index={index}
                    onChange={handleReviewChange} onRemove={() => removeReview(index)}
                    isLast={index === reviews.length - 1} onAdd={addReview} />
                ))}
              </div>
            </Section>

            {/* Q&A */}
            <Section icon={<MdQuestionAnswer size={18} />} title="Questions & Answers" defaultOpen={false}>
              <div className="space-y-4">
                <p className="text-xs text-gray-400">Common questions with answers to help buyers decide.</p>
                {qaList.map((qa, index) => (
                  <QACard key={index} qa={qa} index={index}
                    onChange={handleQAChange} onRemove={() => removeQA(index)}
                    isLast={index === qaList.length - 1} onAdd={addQA} />
                ))}
              </div>
            </Section>

            {/* SEO */}
            <Section icon={<MdInfo size={18} />} title="SEO Settings" defaultOpen={false}>
              <div className="space-y-5">
                <Field label="SEO Title" hint="Recommended: 50–60 characters">
                  <input type="text" name="metaTitle" value={formData.metaTitle}
                    onChange={handleInputChange} placeholder="Page title for search engines" className={inputCls} />
                </Field>
                <Field label="SEO Description" hint="Recommended: 150–160 characters">
                  <textarea name="metaDescription" value={formData.metaDescription}
                    onChange={handleInputChange} placeholder="Brief summary for search results..." className={textareaCls} />
                </Field>
                <Field label="SEO Keywords" hint="Comma-separated keywords">
                  <input type="text" name="metaKeywords" value={formData.metaKeywords}
                    onChange={handleInputChange} placeholder="e.g. headphones, noise cancelling, sony" className={inputCls} />
                </Field>
              </div>
            </Section>
          </div>

          {/* ── RIGHT (1/3) ── */}
          <div className="space-y-6">

            {/* Main Image */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
                <span className="text-blue-600"><FaCloudUploadAlt size={18} /></span>
                <span className="font-semibold text-[#0f172a] text-sm">Main Product Image</span>
                {!isEdit && <span className="text-red-500 text-xs">*</span>}
              </div>
              <div className="p-6">
                <label htmlFor="mainImage"
                  className={`flex flex-col items-center justify-center w-full h-52 rounded-xl border-2 border-dashed cursor-pointer transition ${
                    shownImage ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {shownImage ? (
                    <div className="relative w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={shownImage} alt="Preview"
                        className="w-full h-full object-contain rounded-xl p-2" />
                      <button type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setMainImagePreview(null);
                          setExistingImgUrl(null);
                          setFormData((prev) => ({ ...prev, img: null, imageUrl: "" }));
                          setValue("img", null);
                          setIsSingleImage(false);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                      >
                        <FaTimes size={10} />
                      </button>
                      {/* Show "existing" badge when it's the saved image (not a new upload) */}
                      {existingImgUrl && !mainImagePreview && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/40 text-white text-[10px] font-semibold">
                          Current image
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <FaCloudUploadAlt size={32} />
                      <p className="text-sm font-medium">
                        {isEdit ? "Click to replace image" : "Click to upload"}
                      </p>
                      <p className="text-xs">PNG, JPG up to 500KB</p>
                    </div>
                  )}
                </label>
                <input id="mainImage" type="file" accept="image/*" className="hidden"
                  {...register("img", {
                    required: (!isEdit && !isColorWise) ? "Main image is required" : false,
                    validate: (!isEdit || formData.img) ? validateImage : undefined,
                  })}
                  onChange={handleFileChange}
                />
                {errors.img && <p className="text-xs text-red-500 font-medium mt-2">{errors.img.message}</p>}
              </div>
            </div>

            {/* Color Variants */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
                <span className="text-blue-600"><FaPalette size={16} /></span>
                <span className="font-semibold text-[#0f172a] text-sm">Color Variants</span>
              </div>
              <div className="p-6 space-y-4">
                {colorImages.map((ci, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Variant {idx + 1}</span>
                      {colorImages.length > 1 && (
                        <button type="button" disabled={isSingleImage}
                          onClick={() => setColorImages(colorImages.filter((_, i) => i !== idx))}
                          className="w-6 h-6 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition disabled:opacity-40">
                          <FaTimes size={10} />
                        </button>
                      )}
                    </div>
                    <input type="text" placeholder="Color name (e.g. Midnight Black)"
                      value={ci.color} onChange={(e) => handleColorImageChange(idx, "color", e.target.value)}
                      className={inputCls} />
                    <label className={`flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed cursor-pointer transition ${
                      ci.images.length ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
                      <span className="text-xs text-gray-400 font-medium">
                        {ci.images.length
                          ? `${ci.images.length} new file(s)`
                          : ci.existing?.length
                          ? `${ci.existing.length} saved — click to add more`
                          : "Upload images"}
                      </span>
                      <input type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => handleColorImageChange(idx, "images", e.target.files)} />
                    </label>
                    {ci.previews.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {ci.previews.map((src, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={i} src={src.startsWith("blob:") ? src : `${BASE_URL}/${src}`}
                            alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button type="button" disabled={isSingleImage}
                  onClick={() => setColorImages([...colorImages, { color: "", images: [], previews: [], existing: [] }])}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-blue-200 text-blue-500 text-sm font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                  <FaPlus size={11} /> Add Color Variant
                </button>
              </div>
            </div>

            {/* Mobile save */}
            <div className="xl:hidden">
              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-red-500 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-60">
                {isSubmitting
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <FaPlus size={12} />}
                {isSubmitting ? "Saving..." : submitLabel}
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}