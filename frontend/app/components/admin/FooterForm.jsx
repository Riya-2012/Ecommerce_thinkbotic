"use client";

import {
  useState,
  useEffect,
} from "react";

import api from "@/app/lib/axios";

import {
  useRouter,
} from "next/navigation";

import toast from "react-hot-toast";

export default function FooterForm({

  mode = "add",

  initialData = null,

  footerId = null,

}) {

  const router =
    useRouter();

  const [loading,
  setLoading] =
    useState(false);

  const [formData,
  setFormData] =
    useState({

      companyDescription: "",

      address: "",

      phone: "",

      email: "",

      copyright: "",

      quickLinks: [

        {
          label: "",
          link: "",
        },
      ],

      socials: [

        {
          platform: "",
          link: "",
        },
      ],

    });

  // PREFILL EDIT DATA

  useEffect(() => {

    if (
      mode === "edit" &&
      initialData
    ) {

      setFormData({

        companyDescription:
          initialData.companyDescription ||

          "",

        address:
          initialData.address ||

          "",

        phone:
          initialData.phone ||

          "",

        email:
          initialData.email ||

          "",

        copyright:
          initialData.copyright ||

          "",

        quickLinks:
          initialData.quickLinks ||

          [],

        socials:
          initialData.socials ||

          [],

      });
    }

  }, [initialData]);

  // INPUT CHANGE

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setFormData({

        ...formData,

        [name]: value,

      });
    };

  // QUICK LINKS

  const handleQuickLink =
    (
      index,
      field,
      value
    ) => {

      const updated =
        [...formData.quickLinks];

      updated[index][field] =
        value;

      setFormData({

        ...formData,

        quickLinks:
          updated,

      });
    };

  // SOCIALS

  const handleSocial =
    (
      index,
      field,
      value
    ) => {

      const updated =
        [...formData.socials];

      updated[index][field] =
        value;

      setFormData({

        ...formData,

        socials:
          updated,

      });
    };

  // ADD FIELD

  const addQuickLink =
    () => {

      setFormData({

        ...formData,

        quickLinks: [

          ...formData.quickLinks,

          {
            label: "",
            link: "",
          },

        ],

      });
    };

  const addSocial =
    () => {

      setFormData({

        ...formData,

        socials: [

          ...formData.socials,

          {
            platform: "",
            link: "",
          },

        ],

      });
    };

  // SUBMIT

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const payload = {

          ...formData,

          quickLinks:
            JSON.stringify(
              formData.quickLinks
            ),

          socials:
            JSON.stringify(
              formData.socials
            ),

        };

        if (
          mode === "add"
        ) {

          await api.post(

            "api/admin/landingpage/footer",

            payload
          );

          toast.success(
            "Footer added"
          );

        } else {

          await api.put(

            `/api/admin/landingpage/footer/${footerId}`,

            payload
          );

          toast.success(
            "Footer updated"
          );
        }

        router.push(
          "/admin/footer"
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Something went wrong"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <div className="p-6">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-[#0f172a]">

          {mode === "add"

            ? "Add Footer"

            : "Edit Footer"}

        </h1>

      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8"
      >

        {/* DESCRIPTION */}

        <div>

          <label className="font-medium text-sm">

            Company Description

          </label>

          <textarea
            rows={5}
            name="companyDescription"
            value={
              formData.companyDescription
            }
            onChange={
              handleChange
            }
            className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none"
          />

        </div>

        {/* GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>

            <label className="font-medium text-sm">

              Phone

            </label>

            <input
              type="text"
              name="phone"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none"
            />

          </div>

          <div>

            <label className="font-medium text-sm">

              Email

            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none"
            />

          </div>

        </div>

        {/* ADDRESS */}

        <div>

          <label className="font-medium text-sm">

            Address

          </label>

          <textarea
            rows={3}
            name="address"
            value={
              formData.address
            }
            onChange={
              handleChange
            }
            className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none"
          />

        </div>

        {/* COPYRIGHT */}

        <div>

          <label className="font-medium text-sm">

            Copyright

          </label>

          <input
            type="text"
            name="copyright"
            value={
              formData.copyright
            }
            onChange={
              handleChange
            }
            className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none"
          />

        </div>

        {/* QUICK LINKS */}

        <div>

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-xl font-bold">

              Quick Links

            </h2>

            <button
              type="button"
              onClick={
                addQuickLink
              }
              className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm"
            >

              Add Link

            </button>

          </div>

          <div className="space-y-4">

            {formData.quickLinks.map(
              (item, index) => (

                <div
                  key={index}
                  className="grid grid-cols-2 gap-4"
                >

                  <input
                    type="text"
                    placeholder="Label"
                    value={
                      item.label
                    }
                    onChange={(
                      e
                    ) =>
                      handleQuickLink(
                        index,
                        "label",
                        e.target.value
                      )
                    }
                    className="border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Link"
                    value={
                      item.link
                    }
                    onChange={(
                      e
                    ) =>
                      handleQuickLink(
                        index,
                        "link",
                        e.target.value
                      )
                    }
                    className="border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />

                </div>

              )
            )}

          </div>

        </div>

        {/* SOCIALS */}

        <div>

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-xl font-bold">

              Social Links

            </h2>

            <button
              type="button"
              onClick={
                addSocial
              }
              className="bg-primary-red text-white px-4 py-2 rounded-lg text-sm"
            >

              Add Social

            </button>

          </div>

          <div className="space-y-4">

            {formData.socials.map(
              (item, index) => (

                <div
                  key={index}
                  className="grid grid-cols-2 gap-4"
                >

                  <input
                    type="text"
                    placeholder="Platform"
                    value={
                      item.platform
                    }
                    onChange={(
                      e
                    ) =>
                      handleSocial(
                        index,
                        "platform",
                        e.target.value
                      )
                    }
                    className="border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Link"
                    value={
                      item.link
                    }
                    onChange={(
                      e
                    ) =>
                      handleSocial(
                        index,
                        "link",
                        e.target.value
                      )
                    }
                    className="border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />

                </div>

              )
            )}

          </div>

        </div>

        {/* SUBMIT */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-blue-red text-white px-8 py-3 rounded-xl font-semibold"
          >

            {loading

              ? "Saving..."

              : mode === "add"

              ? "Add Footer"

              : "Update Footer"}

          </button>

        </div>

      </form>

    </div>
  );
}