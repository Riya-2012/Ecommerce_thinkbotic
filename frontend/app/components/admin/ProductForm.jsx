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
} from "react-icons/md";
import toast from "react-hot-toast";
import api, { BASE_URL } from "@/app/lib/axios";

// ─── Constants ────────────────────────────────────────────────────────────────
const IMAGE_MAX_KB   = 500;
const IMAGE_MIN_KB   = 1;
const IMAGE_MAX_W    = 4000;
const IMAGE_MAX_H    = 4000;
const ALLOWED_MIME   = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXT_RE = /\.(jpe?g|png|webp)$/i;

// SEO limits
const SEO_TITLE_MAX  = 60;
const SEO_DESC_MAX   = 160;
const SEO_KW_MAX     = 255;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[#0f172a] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition placeholder-gray-400";
const inputErrCls =
  "w-full px-4 py-2.5 rounded-xl border border-red-300 bg-red-50 text-[#0f172a] text-sm focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition placeholder-gray-400";
const textareaCls    = inputCls    + " resize-none min-h-[90px]";
const textareaErrCls = inputErrCls + " resize-none min-h-[90px]";

// emptyReview and emptyQA removed — reviews/Q&A managed by users
const emptyKV     = () => ({ key: "", value: "" });

// Validate a single image File — returns true or an error string
const validateImageFile = (file) =>
  new Promise((resolve) => {
    if (!ALLOWED_MIME.includes(file.type) || !ALLOWED_EXT_RE.test(file.name)) {
      return resolve("Only JPG, PNG, or WEBP files are allowed.");
    }
    const kb = file.size / 1024;
    if (kb < IMAGE_MIN_KB) return resolve(`Image is too small (min ${IMAGE_MIN_KB} KB).`);
    if (kb > IMAGE_MAX_KB) return resolve(`Image exceeds ${IMAGE_MAX_KB} KB limit.`);

    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (img.width > IMAGE_MAX_W || img.height > IMAGE_MAX_H) {
        return resolve(`Image dimensions must not exceed ${IMAGE_MAX_W}×${IMAGE_MAX_H} px.`);
      }
      resolve(true);
    };
    img.onerror = () => resolve("Invalid or corrupt image file.");
  });

// ─── Sub-components ───────────────────────────────────────────────────────────
function Section({ icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-primary-blue">{icon}</span>
          <span className="font-semibold text-[#0f172a] text-sm">{title}</span>
        </div>
        <span className="text-gray-400 text-xs">{open ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>
      {open && <div className="p-6">{children}</div>}
    </div>
  );
}

function Field({ label, required, error, children, hint, charCount }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {charCount !== undefined && (
            <span className={`text-xs font-mono ${charCount.over ? "text-red-500 font-semibold" : "text-gray-400"}`}>
              {charCount.current}/{charCount.max}
            </span>
          )}
        </div>
      )}
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

function CharCount({ value = "", max }) {
  const current = (value || "").length;
  return { current, max, over: current > max };
}

function KVEditor({ field, data, onChange, onAdd, onRemove, errors: kvErrors = {} }) {
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1 flex flex-col gap-1">
            <input type="text" name="key" value={item.key}
              onChange={(e) => onChange(e, index, field)} placeholder="Key"
              className={kvErrors[`${field}_${index}_key`] ? inputErrCls : inputCls} />
            {kvErrors[`${field}_${index}_key`] && (
              <p className="text-xs text-red-500">⚠ {kvErrors[`${field}_${index}_key`]}</p>
            )}
          </div>
          <div className="flex-[2] flex flex-col gap-1">
            <input type="text" name="value" value={item.value}
              onChange={(e) => onChange(e, index, field)} placeholder="Value"
              className={kvErrors[`${field}_${index}_value`] ? inputErrCls : inputCls} />
            {kvErrors[`${field}_${index}_value`] && (
              <p className="text-xs text-red-500">⚠ {kvErrors[`${field}_${index}_value`]}</p>
            )}
          </div>
          <div className="flex gap-1 pt-0.5">
            {index === data.length - 1 && (
              <button type="button" onClick={() => onAdd(field)}
                className="w-8 h-8 rounded-lg bg-blue-100 text-primary-blue hover:bg-blue-200 flex items-center justify-center transition">
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

function StarRating({ value, onChange, error }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button"
            onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(star)} className="text-xl transition-transform hover:scale-110">
            {star <= (hovered ?? value)
              ? <FaStar className="text-amber-400" />
              : <FaRegStar className={error ? "text-red-300" : "text-gray-300"} />}
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-xs font-semibold text-amber-500">
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">⚠ {error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductForm({ mode = "add", productId, initialData, onSuccess }) {
  const router = useRouter();

  const isEdit      = mode === "edit";
  const isDuplicate = mode === "duplicate";

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
    reset, setValue, watch, trigger,
  } = useForm({
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

  const safeKV = (arr) =>
    Array.isArray(arr) && arr.length ? arr : [emptyKV()];

  const [formData, setFormData] = useState({
    discount:           initialData?.discount           || "",
    priceAlert:         initialData?.priceAlert         || "",
    stock:              initialData?.stock              ?? "",
    img:                null,
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

  const [existingImgUrl, setExistingImgUrl] = useState(
    initialData?.img ? `${BASE_URL}/${initialData.img}` : null
  );
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const [colorImages, setColorImages] = useState(
    initialData?.colorVariants?.length
      ? initialData.colorVariants.map((cv) => ({
          color: cv.color || "", images: [],
          previews: cv.images || [], existing: cv.images || [],
        }))
      : [{ color: "", images: [], previews: [], existing: [] }]
  );

  const [isSingleImage, setIsSingleImage] = useState(false);
  const [isColorWise,   setIsColorWise]   = useState(false);

  // reviews and quesAns are managed by users — state removed

  // ── custom validation error maps (for non-RHF fields) ─────────────────
  const [kvErrors,    setKvErrors]    = useState({});
  const [colorErrors, setColorErrors] = useState({});
  const [imageError,  setImageError]  = useState("");

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
    // Clear error on change
    const errKey = `${field}_${index}_${name}`;
    if (kvErrors[errKey]) setKvErrors((prev) => { const n = { ...prev }; delete n[errKey]; return n; });
  };

  const handleAddField    = (field) => setFormData({ ...formData, [field]: [...formData[field], emptyKV()] });
  const handleRemoveField = (index, field) =>
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) { setIsSingleImage(false); setMainImagePreview(null); return; }
    const result = await validateImageFile(file);
    if (result !== true) { setImageError(result); return; }
    setImageError("");
    setIsSingleImage(true);
    setIsColorWise(false);
    const url = URL.createObjectURL(file);
    setMainImagePreview(url);
    setExistingImgUrl(null);
    setFormData((prev) => ({ ...prev, img: file, imageUrl: url }));
  };

  const handleColorImageChange = async (idx, field, value) => {
    const updated = [...colorImages];
    if (field === "images") {
      const files  = Array.from(value);
      const errMap = { ...colorErrors };

      // Validate each file
      const validations = await Promise.all(files.map((f) => validateImageFile(f)));
      const badIdx = validations.findIndex((r) => r !== true);
      if (badIdx !== -1) {
        errMap[`color_${idx}_images`] = validations[badIdx];
        setColorErrors(errMap);
        return;
      }
      delete errMap[`color_${idx}_images`];
      setColorErrors(errMap);

      updated[idx].images   = files;
      updated[idx].previews = [
        ...updated[idx].existing,
        ...files.map((f) => URL.createObjectURL(f)),
      ];
      const anySelected = updated.some((ci) => ci.images.length > 0);
      setIsColorWise(anySelected);
      if (anySelected) setIsSingleImage(false);
    } else {
      updated[idx][field] = value;
      if (colorErrors[`color_${idx}_color`]) {
        setColorErrors((prev) => { const n = { ...prev }; delete n[`color_${idx}_color`]; return n; });
      }
    }
    setColorImages(updated);
  };

  // reviews + Q&A handlers removed — managed by users

  // ── Validate non-RHF sections ─────────────────────────────────────────
  /**
   * Returns { isValid: bool, errorMap: {}, errorSummary: string[] }
   */
  const validateCustomSections = async () => {
    const newKvErrors    = {};
    const newColorErrors = {};
    const summary        = [];

    // ── Image ──────────────────────────────────────────────────────────
    const needsImage = !isEdit && !isDuplicate && !existingImgUrl && !isColorWise;
    if (needsImage && !formData.img) {
      setImageError("Main product image is required.");
      summary.push("Main product image is required.");
    } else if (formData.img) {
      const imgResult = await validateImageFile(formData.img);
      if (imgResult !== true) {
        setImageError(imgResult);
        summary.push(`Image: ${imgResult}`);
      } else {
        setImageError("");
      }
    }

    // ── Color variants ────────────────────────────────────────────────
    colorImages.forEach((ci, idx) => {
      if (ci.images.length > 0 && !ci.color.trim()) {
        newColorErrors[`color_${idx}_color`] = "Color name is required when images are uploaded.";
        summary.push(`Color Variant ${idx + 1}: Color name is required.`);
      }
      if (ci.color.trim() && ci.images.length === 0 && !ci.existing?.length) {
        newColorErrors[`color_${idx}_images`] = "Please upload at least one image for this color.";
        summary.push(`Color Variant ${idx + 1}: At least one image is required.`);
      }
    });

    // ── KV editors — check for orphaned keys (key without value) ──────
    ["specifications", "warranty", "otherinfo", "offers"].forEach((section) => {
      formData[section].forEach((item, idx) => {
        if (item.key.trim() && !item.value.trim()) {
          newKvErrors[`${section}_${idx}_value`] = "Value is required when key is set.";
          summary.push(`${section.charAt(0).toUpperCase() + section.slice(1)} row ${idx + 1}: Value missing.`);
        }
        if (!item.key.trim() && item.value.trim()) {
          newKvErrors[`${section}_${idx}_key`] = "Key is required when value is set.";
          summary.push(`${section.charAt(0).toUpperCase() + section.slice(1)} row ${idx + 1}: Key missing.`);
        }
      });
    });

    // reviews + Q&A validation removed — managed by users

    // ── SEO character limits ──────────────────────────────────────────
    if (formData.metaTitle.length > SEO_TITLE_MAX) {
      summary.push(`SEO Title exceeds ${SEO_TITLE_MAX} characters.`);
    }
    if (formData.metaDescription.length > SEO_DESC_MAX) {
      summary.push(`SEO Description exceeds ${SEO_DESC_MAX} characters.`);
    }
    if (formData.metaKeywords.length > SEO_KW_MAX) {
      summary.push(`SEO Keywords exceeds ${SEO_KW_MAX} characters.`);
    }

    setKvErrors(newKvErrors);
    setColorErrors(newColorErrors);

    const isValid =
      summary.length === 0 &&
      Object.keys(newKvErrors).length    === 0 &&
      Object.keys(newColorErrors).length === 0;

    return { isValid, summary };
  };

  // ── submit ─────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    // 1. Trigger RHF validation
    const rhfValid = await trigger();

    // 2. Validate custom sections
    const { isValid: customValid, summary } = await validateCustomSections();

    if (!rhfValid || !customValid) {
      // Scroll to first visible error
      setTimeout(() => {
        const firstErr = document.querySelector("[data-error='true'], .text-red-500");
        if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);

      // Toast summary
      const rhfMessages = Object.values(errors).map((e) => e?.message).filter(Boolean);
      const allMessages = [...rhfMessages, ...summary];
      const unique      = [...new Set(allMessages)];

      if (unique.length === 1) {
        toast.error(unique[0]);
      } else if (unique.length > 0) {
        toast.error(
          <div className="text-sm">
            <p className="font-semibold mb-1">Please fix {unique.length} error{unique.length > 1 ? "s" : ""}:</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              {unique.slice(0, 5).map((msg, i) => <li key={i}>{msg}</li>)}
              {unique.length > 5 && <li className="text-gray-400">…and {unique.length - 5} more</li>}
            </ul>
          </div>,
          { duration: 6000 }
        );
      }
      return;
    }

    const merged = { ...data, ...formData };
    const fd = new FormData();

    // Fields that map to Number in the Mongoose schema — never send "" for these
    const NUMBER_FIELDS = new Set(["price", "oldPrice", "gst", "stock", "discount", "rating", "ratingCount", "ratingTotal"]);
    const SKIP_KEYS     = new Set(["images", "imagesPreview", "imageUrl"]);

    Object.entries(merged).forEach(([key, value]) => {
      if (key === "img") {
        if (formData.img) fd.append("img", formData.img);
        return;
      }
      if (SKIP_KEYS.has(key)) return;

      if (Array.isArray(value) && value.length && typeof value[0] === "object") {
        fd.append(key, JSON.stringify(value));
        return;
      }

      if (NUMBER_FIELDS.has(key)) {
        // Only append if we actually have a valid number; skip empty/null/NaN
        const num = Number(value);
        if (value !== "" && value !== null && value !== undefined && !isNaN(num)) {
          fd.append(key, num);
        }
        return;
      }

      // All other fields — send as-is (empty string is fine for text fields)
      fd.append(key, value ?? "");
    });

    colorImages.forEach(({ color, images, existing }) => {
      if (color) {
        images.forEach((imgFile) => fd.append("colorImages", imgFile));
        fd.append("colorNames", color);
        fd.append("existingColorImages", JSON.stringify(existing));
      }
    });
    fd.append("colorImageCounts", JSON.stringify(colorImages.map((ci) => ci.images.length)));

    // reviews and quesAns are managed by users — not sent from admin form

    try {
      if (isEdit) {
        await api.put(`/api/admin/productpage/${productId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
      } else {
        await api.post("/api/admin/productpage", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(isDuplicate ? "Product duplicated successfully!" : "Product added successfully!");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/products");
      }

      if (!isEdit) {
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
        setKvErrors({});
        setColorErrors({});
        setImageError("");
      }
    } catch {
      toast.error(isEdit ? "Failed to update product." : "Failed to save product.");
    }
  };

  const shownImage = mainImagePreview || existingImgUrl;

  // ── render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-[#0f172a]">{pageTitle}</h1>
            {isDuplicate && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-primary-blue text-xs font-semibold">Duplicate</span>
            )}
            {isEdit && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-600 text-xs font-semibold">Editing</span>
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
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-blue-red text-white font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-60">
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
                    <input
                      type="text" placeholder="e.g. Sony WH-1000XM5"
                      className={errors.name ? inputErrCls : inputCls}
                      {...register("name", {
                        required:  "Product name is required",
                        minLength: { value: 2,   message: "Minimum 2 characters required" },
                        maxLength: { value: 200, message: "Maximum 200 characters allowed" },
                        validate:  (v) => v.trim().length > 0 || "Name cannot contain only spaces",
                      })}
                    />
                  </Field>
                </div>

                <Field label="Brand" error={errors.Brand?.message}>
                  <input type="text" placeholder="e.g. Sony"
                    className={errors.Brand ? inputErrCls : inputCls}
                    {...register("Brand", {
                      minLength: { value: 2, message: "Brand name too short" },
                      maxLength: { value: 100, message: "Brand name too long" },
                      validate:  (v) => !v || v.trim().length > 0 || "Invalid brand",
                    })}
                  />
                </Field>

                <Field label="Category" required error={errors.category?.message}>
                  <input type="text" placeholder="e.g. Electronics"
                    className={errors.category ? inputErrCls : inputCls}
                    {...register("category", {
                      required:  "Category is required",
                      minLength: { value: 2,   message: "Category too short" },
                      maxLength: { value: 100, message: "Category too long" },
                      validate:  (v) => v.trim().length > 0 || "Invalid category",
                    })}
                  />
                </Field>

                <Field label="Sub-Category" required error={errors.subCategory?.message}>
                  <input type="text" placeholder="e.g. Headphones"
                    className={errors.subCategory ? inputErrCls : inputCls}
                    {...register("subCategory", {
                      required:  "Sub-category is required",
                      minLength: { value: 2,   message: "Sub-category too short" },
                      maxLength: { value: 100, message: "Sub-category too long" },
                      validate:  (v) => v.trim().length > 0 || "Invalid sub-category",
                    })}
                  />
                </Field>

                <Field label="Stock" required error={errors.stock?.message}>
                  <input type="number" placeholder="0"
                    className={errors.stock ? inputErrCls : inputCls}
                    {...register("stock", {
                      required: "Stock is required",
                      min:      { value: 0,      message: "Stock cannot be negative" },
                      max:      { value: 999999, message: "Stock value too large" },
                      validate: (v) => !isNaN(v) || "Invalid stock value",
                    })}
                    onChange={handleInputChange}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Short Description" error={errors.descriptions?.message}
                    charCount={CharCount({ value: watch("descriptions"), max: 500 })}>
                    <textarea placeholder="Brief description..."
                      className={errors.descriptions ? textareaErrCls : textareaCls}
                      {...register("descriptions", {
                        maxLength: { value: 500, message: "Short description exceeds 500 characters" },
                        validate:  (v) => !v || v.trim().length > 0 || "Invalid description",
                      })}
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Detailed Product Description" error={errors.productDescription?.message}
                    charCount={CharCount({ value: watch("productDescription"), max: 3000 })}>
                    <textarea placeholder="Full product description..."
                      className={(errors.productDescription ? textareaErrCls : textareaCls) + " min-h-[130px]"}
                      {...register("productDescription", {
                        maxLength: { value: 3000, message: "Detailed description exceeds 3000 characters" },
                        validate:  (v) => !v || v.trim().length > 0 || "Invalid description",
                      })}
                    />
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
                    <input type="number" placeholder="0.00"
                      className={(errors.oldPrice ? inputErrCls : inputCls) + " pl-8"}
                      {...register("oldPrice", {
                        required:    "Old Price is required",
                        min:         { value: 1,          message: "Old price must be greater than 0" },
                        max:         { value: 10_000_000, message: "Price value too large" },
                        validate:    (v) => !isNaN(v) || "Invalid price",
                      })}
                    />
                  </div>
                </Field>

                <Field label="Selling Price" required error={errors.price?.message}>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                    <input type="number" placeholder="0.00"
                      className={(errors.price ? inputErrCls : inputCls) + " pl-8"}
                      {...register("price", {
                        required: "Selling price is required",
                        min:      { value: 1,          message: "Price must be greater than 0" },
                        max:      { value: 10_000_000, message: "Price value too large" },
                        validate: (v) => {
                          if (isNaN(v)) return "Invalid price";
                          const old = Number(watchOldPrice);
                          if (old && Number(v) > old) return "Selling price cannot exceed MRP";
                          return true;
                        },
                      })}
                      onChange={handleInputChange}
                    />
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
                    className={inputCls + " bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold cursor-not-allowed"}
                  />
                </Field>

                <Field label="GST (%)" required error={errors.gst?.message}>
                  <input type="number" placeholder="e.g. 18"
                    className={errors.gst ? inputErrCls : inputCls}
                    {...register("gst", {
                      required: "GST is required",
                      min:      { value: 0,   message: "GST cannot be negative" },
                      max:      { value: 100, message: "GST cannot exceed 100%" },
                      validate: (v) => !isNaN(v) || "Invalid GST value",
                    })}
                  />
                </Field>

                <Field label="Price Alert">
                  <input type="text" name="priceAlert" value={formData.priceAlert}
                    onChange={handleInputChange}
                    placeholder="e.g. Limited time offer!"
                    maxLength={100}
                    className={inputCls}
                  />
                </Field>
              </div>
            </Section>

            {/* Specifications */}
            <Section icon={<MdVerified size={18} />} title="Specifications">
              <KVEditor field="specifications" data={formData.specifications}
                onChange={handleArrayChange} onAdd={handleAddField} onRemove={handleRemoveField}
                errors={kvErrors} />
            </Section>

            {/* Warranty */}
            <Section icon={<MdVerified size={18} />} title="Warranty">
              <KVEditor field="warranty" data={formData.warranty}
                onChange={handleArrayChange} onAdd={handleAddField} onRemove={handleRemoveField}
                errors={kvErrors} />
            </Section>

            {/* Other Info */}
            <Section icon={<MdInfo size={18} />} title="Other Information" defaultOpen={false}>
              <div className="space-y-4">
                <KVEditor field="otherinfo" data={formData.otherinfo}
                  onChange={handleArrayChange} onAdd={handleAddField} onRemove={handleRemoveField}
                  errors={kvErrors} />
                <Field label="Plain Text Info">
                  <textarea name="otherinfoText" value={formData.otherinfoText}
                    onChange={handleInputChange} placeholder="Any additional info..."
                    maxLength={1000} className={textareaCls} />
                </Field>
              </div>
            </Section>

            {/* Offers */}
            <Section icon={<MdLocalOffer size={18} />} title="Offers & Deals" defaultOpen={false}>
              <KVEditor field="offers" data={formData.offers}
                onChange={handleArrayChange} onAdd={handleAddField} onRemove={handleRemoveField}
                errors={kvErrors} />
            </Section>

            {/* Reviews & Q&A removed — managed by users */}

            {/* SEO */}
            <Section icon={<MdInfo size={18} />} title="SEO Settings" defaultOpen={false}>
              <div className="space-y-5">
                <Field label="SEO Title"
                  hint={`Recommended: 50–${SEO_TITLE_MAX} characters`}
                  error={formData.metaTitle.length > SEO_TITLE_MAX ? `Exceeds ${SEO_TITLE_MAX} character limit` : undefined}
                  charCount={CharCount({ value: formData.metaTitle, max: SEO_TITLE_MAX })}>
                  <input type="text" name="metaTitle" value={formData.metaTitle}
                    onChange={handleInputChange} placeholder="Page title for search engines"
                    className={formData.metaTitle.length > SEO_TITLE_MAX ? inputErrCls : inputCls} />
                </Field>

                <Field label="SEO Description"
                  hint={`Recommended: 150–${SEO_DESC_MAX} characters`}
                  error={formData.metaDescription.length > SEO_DESC_MAX ? `Exceeds ${SEO_DESC_MAX} character limit` : undefined}
                  charCount={CharCount({ value: formData.metaDescription, max: SEO_DESC_MAX })}>
                  <textarea name="metaDescription" value={formData.metaDescription}
                    onChange={handleInputChange} placeholder="Brief summary for search results..."
                    className={formData.metaDescription.length > SEO_DESC_MAX ? textareaErrCls : textareaCls} />
                </Field>

                <Field label="SEO Keywords"
                  hint="Comma-separated keywords"
                  error={formData.metaKeywords.length > SEO_KW_MAX ? `Exceeds ${SEO_KW_MAX} character limit` : undefined}
                  charCount={CharCount({ value: formData.metaKeywords, max: SEO_KW_MAX })}>
                  <input type="text" name="metaKeywords" value={formData.metaKeywords}
                    onChange={handleInputChange} placeholder="e.g. headphones, noise cancelling, sony"
                    className={formData.metaKeywords.length > SEO_KW_MAX ? inputErrCls : inputCls} />
                </Field>
              </div>
            </Section>
          </div>

          {/* ── RIGHT (1/3) ── */}
          <div className="space-y-6">

            {/* Main Image */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
                <span className="text-primary-blue"><FaCloudUploadAlt size={18} /></span>
                <span className="font-semibold text-[#0f172a] text-sm">Main Product Image</span>
                {!isEdit && <span className="text-red-500 text-xs">*</span>}
              </div>
              <div className="p-6">
                <label htmlFor="mainImage"
                  className={`flex flex-col items-center justify-center w-full h-52 rounded-xl border-2 border-dashed cursor-pointer transition ${
                    imageError
                      ? "border-red-300 bg-red-50"
                      : shownImage
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
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
                          setImageError("");
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                      >
                        <FaTimes size={10} />
                      </button>
                      {existingImgUrl && !mainImagePreview && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/40 text-white text-[10px] font-semibold">
                          Current image
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <FaCloudUploadAlt size={32} className={imageError ? "text-red-400" : ""} />
                      <p className="text-sm font-medium">
                        {isEdit ? "Click to replace image" : "Click to upload"}
                      </p>
                      <p className="text-xs">PNG, JPG, WEBP · 1–{IMAGE_MAX_KB} KB · max {IMAGE_MAX_W}×{IMAGE_MAX_H}px</p>
                    </div>
                  )}
                </label>

                <input id="mainImage" type="file" accept="image/*" className="hidden"
                  onChange={handleFileChange} />

                {imageError && (
                  <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {imageError}
                  </p>
                )}
              </div>
            </div>

            {/* Color Variants */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
                <span className="text-primary-blue"><FaPalette size={16} /></span>
                <span className="font-semibold text-[#0f172a] text-sm">Color Variants</span>
              </div>
              <div className="p-6 space-y-4">
                {colorImages.map((ci, idx) => (
                  <div key={idx}
                    className={`rounded-xl border bg-gray-50 p-4 space-y-3 ${
                      colorErrors[`color_${idx}_color`] || colorErrors[`color_${idx}_images`]
                        ? "border-red-200"
                        : "border-gray-100"
                    }`}
                  >
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

                    <div className="flex flex-col gap-1">
                      <input type="text" placeholder="Color name (e.g. Midnight Black)"
                        value={ci.color}
                        onChange={(e) => handleColorImageChange(idx, "color", e.target.value)}
                        className={colorErrors[`color_${idx}_color`] ? inputErrCls : inputCls}
                      />
                      {colorErrors[`color_${idx}_color`] && (
                        <p className="text-xs text-red-500">⚠ {colorErrors[`color_${idx}_color`]}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className={`flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed cursor-pointer transition ${
                        colorErrors[`color_${idx}_images`]
                          ? "border-red-300 bg-red-50"
                          : ci.images.length
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}>
                        <span className="text-xs text-gray-400 font-medium">
                          {ci.images.length
                            ? `${ci.images.length} new file(s) selected`
                            : ci.existing?.length
                            ? `${ci.existing.length} saved — click to add more`
                            : "Upload images (JPG/PNG/WEBP, max 500 KB each)"}
                        </span>
                        <input type="file" accept="image/*" multiple className="hidden"
                          onChange={(e) => handleColorImageChange(idx, "images", e.target.files)} />
                      </label>
                      {colorErrors[`color_${idx}_images`] && (
                        <p className="text-xs text-red-500">⚠ {colorErrors[`color_${idx}_images`]}</p>
                      )}
                    </div>

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
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-blue-red text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-60">
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