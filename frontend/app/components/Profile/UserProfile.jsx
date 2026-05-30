
"use client";

import { useAuth } from "@/app/context/AuthContext";
import api from "@/app/lib/axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  FaEnvelope,
  FaPhone,
  FaUser,
} from "react-icons/fa";

function UserProfile() {

  const { user, setUser } =
    useAuth();

  const {

    register,

    handleSubmit,

    reset,

    formState: {
      errors,
    },

  } = useForm();

  // PREFILL USER DATA

  useEffect(() => {

    if (user) {

      reset({

        username:
          user.username || "",

        firstname:
          user.firstname || "",

        lastname:
          user.lastname || "",

        email:
          user.email || "",

        phone:
          user.phone
            ?.replace("+91", "") || "",

        gender:
          user.gender || "",
      });
    }

  }, [user, reset]);

  // SUBMIT

  const onSubmit =
    async (data) => {

      try {

        const updatedData = {

          ...data,

          phone:
            data.phone.startsWith("+91")

              ? data.phone

              : `+91${data.phone}`,
        };

        const response =
          await api.put(

            `api/auth/update/${user._id}`,

            updatedData
          );

        setUser(
          response.data
        );

        toast.success(
          "User updated successfully"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Error updating user"
        );
      }
    };

  return (

    <div className="space-y-8">

      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-6 sm:p-8">

          {/* TITLE */}

          <div className="mb-8">

            <h3 className="text-2xl font-bold text-primary-red">

              Personal Information

            </h3>

            <p className="text-gray-500 text-sm mt-1">

              Update your profile details here.

            </p>

          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
          >

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

              {/* USERNAME */}

              <div>

                <label className="profileLabel">

                  Username

                </label>

                <div className="profileInputWrapper">

                  <FaUser className="profileIcon" />

                  <input

                    type="text"

                    className="profileInput"

                    placeholder="Username"

                    {...register("username", {

                      required:
                        "Username is required",

                      pattern: {

                        value:
                          /^[A-Za-z0-9_]+$/,

                        message:
                          "Only letters, numbers and underscore allowed",
                      },

                      minLength: {

                        value: 3,

                        message:
                          "Minimum 3 characters",
                      },
                    })}
                  />

                </div>

                {errors.username && (

                  <p className="text-red-500 text-sm mt-1">

                    {
                      errors.username
                        .message
                    }

                  </p>
                )}

              </div>

              {/* FIRST NAME */}

              <div>

                <label className="profileLabel">

                  First Name

                </label>

                <div className="profileInputWrapper">

                  <FaUser className="profileIcon" />

                  <input

                    type="text"

                    className="profileInput"

                    placeholder="First Name"

                    {...register("firstname", {

                      required:
                        "First name is required",

                      pattern: {

                        value:
                          /^[A-Za-z ]+$/,

                        message:
                          "Only letters allowed",
                      },

                      minLength: {

                        value: 2,

                        message:
                          "Minimum 2 characters",
                      },
                    })}
                  />

                </div>

                {errors.firstname && (

                  <p className="text-red-500 text-sm mt-1">

                    {
                      errors.firstname
                        .message
                    }

                  </p>
                )}

              </div>

              {/* LAST NAME */}

              <div>

                <label className="profileLabel">

                  Last Name

                </label>

                <div className="profileInputWrapper">

                  <FaUser className="profileIcon" />

                  <input

                    type="text"

                    className="profileInput"

                    placeholder="Last Name"

                    {...register("lastname", {

                      required:
                        "Last name is required",

                      pattern: {

                        value:
                          /^[A-Za-z ]+$/,

                        message:
                          "Only letters allowed",
                      },
                    })}
                  />

                </div>

                {errors.lastname && (

                  <p className="text-red-500 text-sm mt-1">

                    {
                      errors.lastname
                        .message
                    }

                  </p>
                )}

              </div>

              {/* EMAIL */}

              <div>

                <label className="profileLabel">

                  Email Address

                </label>

                <div className="profileInputWrapper">

                  <FaEnvelope className="profileIcon" />

                  <input

                    type="email"

                    className="profileInput"

                    placeholder="Email"

                    {...register("email", {

                      required:
                        "Email is required",

                      pattern: {

                        value:
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                        message:
                          "Invalid email",
                      },
                    })}
                  />

                </div>

                {errors.email && (

                  <p className="text-red-500 text-sm mt-1">

                    {
                      errors.email
                        .message
                    }

                  </p>
                )}

              </div>

              {/* PHONE */}

              <div>

                <label className="profileLabel">

                  Phone Number

                </label>

                <div className="profileInputWrapper">

                  <FaPhone className="profileIcon" />

                  <input

                    type="text"

                    className="profileInput"

                    placeholder="Phone Number"

                    {...register("phone", {

                      required:
                        "Phone number is required",

                      pattern: {

                        value:
                          /^[0-9]{10}$/,

                        message:
                          "Phone must be 10 digits",
                      },
                    })}
                  />

                </div>

                {errors.phone && (

                  <p className="text-red-500 text-sm mt-1">

                    {
                      errors.phone
                        .message
                    }

                  </p>
                )}

              </div>

            </div>

            {/* GENDER */}

            <div className="mt-6">

              <label className="profileLabel">

                Gender

              </label>

              <div className="flex flex-wrap gap-4 mt-3">

                {[
                  "Male",
                  "Female",
                  "Other",
                ].map((item) => (

                  <label
                    key={item}
                    className="flex items-center gap-2 cursor-pointer border border-gray-200 rounded-xl px-5 py-3 hover:border-primary-blue transition"
                  >

                    <input

                      type="radio"

                      value={item}

                      {...register("gender", {

                        required:
                          "Please select gender",
                      })}

                      className="accent-primary-blue"
                    />

                    <span className="text-sm font-medium">

                      {item}

                    </span>

                  </label>
                ))}

              </div>

              {errors.gender && (

                <p className="text-red-500 text-sm mt-2">

                  {
                    errors.gender
                      .message
                  }

                </p>
              )}

            </div>

            {/* BUTTON */}

            <div className="mt-10 flex justify-end">

              <button

                type="submit"

                className="px-8 py-3 bg-gradient-blue-red text-white rounded-2xl font-bold shadow-md hover:shadow-xl hover:scale-[1.02] transition"
              >

                Save Changes

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default UserProfile;

