"use client"
import { useForm } from 'react-hook-form';
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useSearchParams } from "next/navigation";
function page() {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      productName: "",
      productCategory: "",
      name: "",
      email: "",
      mobile: "",
      altMobile: "",
      quantity: "",
      description: "",

    },
  });
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const heading =
    type === "custom"
      ? "Customization Request"
      : "Bulk Order Inquiry";

  const description =
    type === "custom"
      ? "Tell us your customization requirements."
      : "Get the best pricing for large quantity orders.";

const badgeText =
  type === "custom"
    ? "CUSTOMIZATION"
    : "BULK ORDER";


  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/*  HERO SECTION */}
      {/* <div className="relative overflow-hidden bg-gradient-blue-red py-16 px-4 lg:px-10">


    <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl"></div>

    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl"></div>

    <div className="relative z-10 max-w-[1400px] mx-auto text-center text-white">

      <h1 className="text-4xl lg:text-5xl font-bold">
        {heading}
      </h1>

      <p className="mt-4 text-white/80 max-w-2xl mx-auto">
        {description}
      </p>

    </div>
  </div> */}

      {/*  FORM SECTION */}
      <div className="max-w-5xl mx-auto px-4 lg:px-10 py-12">

        <form className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* HEADER */}
          <div className="relative bg-gray-50 border-b border-gray-100 px-8 py-6">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-primary-blue/10 flex items-center justify-center text-primary-blue text-xl">
                <FaMapMarkerAlt />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0f172a]">
                  Product Inquiry Form
                </h2>

                <p className="text-gray-500 text-sm">
                  Fill in your details and requirements
                </p>
                <div className="absolute top-6 right-6">

  <span
    className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide shadow-sm ${
      type === "custom"
        ? "bg-primary-red text-white"
        : "bg-primary-blue text-white"
    }`}
  >
    {badgeText}
  </span>

</div>
        
              </div>
<div>
  
</div>
            </div>
  </div>

          {/* FORM BODY */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PRODUCT NAME */}
            <div>
              <label className="label">Product Name *</label>

              <input
                {...register("productName", { required: true })}
                className="input"
                placeholder="Enter Product Name"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="label">Product Category *</label>

              <input
                {...register("productCategory", { required: true })}
                className="input"
                placeholder="Electronics / Fashion"
              />
            </div>

            {/* NAME */}
            <div>
              <label className="label">Your Name *</label>

              <input
                {...register("name", { required: true })}
                className="input"
                placeholder="John Doe"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="label">Email Address *</label>

              <input
                {...register("email", { required: true })}
                className="input"
                placeholder="john@example.com"
              />
            </div>

            {/* MOBILE */}
            <div>
              <label className="label">Mobile Number *</label>

              <input
                {...register("mobile", { required: true })}
                className="input"
                placeholder="9999999999"
              />
            </div>

            {/* ALT MOBILE */}
            <div>
              <label className="label">Alternative Mobile</label>

              <input
                {...register("altMobile")}
                className="input"
                placeholder="Optional"
              />
            </div>

            {/* QUANTITY */}
            <div className="md:col-span-2">
              <label className="label">Required Quantity *</label>

              <input
                type="number"
                {...register("quantity", { required: true })}
                className="input"
                placeholder="Enter Quantity"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="label">
                Describe Your Requirements *
              </label>

              <textarea
                rows={5}
                {...register("description", { required: true })}
                className="input resize-none"
                placeholder={
                  type === "custom"
                    ? "Explain customization details..."
                    : "Mention quantity, delivery, packaging..."
                }
              />
            </div>

          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-100 bg-gray-50 px-8 py-6 flex justify-between items-center flex-wrap gap-4">

            <p className="text-sm text-gray-500">
              Our team will contact you within 24 hours.
            </p>

            <button
              type="submit"
              className="px-8 py-3 bg-gradient-blue-red text-white rounded-2xl font-bold shadow-md hover:shadow-xl hover:scale-[1.02] transition"
            >
              Submit Inquiry
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default page
