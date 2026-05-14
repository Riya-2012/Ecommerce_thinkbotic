"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import toast from "react-hot-toast";

import api from "@/app/lib/axios";

import { useRouter } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    gender: "",
    email: "",
    phone: "",
   
  });

const router = useRouter();
  const [loading, setLoading] = useState(false);

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


 const handleSubmit = async (e) => {

  e.preventDefault();

  setLoading(true);

  try {

    const response = await api.post(

      "/api/auth/signUp",

      formData

    );

    console.log(response.data);

    toast.success("Account created successfully");

   
    setFormData({

      username: "",
      firstname: "",
      lastname: "",
      gender: "",
      email: "",
      phone: "",
   

    });

  
    router.push("/");

  } catch (error) {

    console.log(error);

    toast.error(

      error.response?.data?.msg ||

      "Something went wrong"

    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="min-h-screen flex bg-gradient-blue-red overflow-hidden">

      {/*LEFT SIDE */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden  items-center justify-center">

        {/* OVERLAY */}
        <div className="absolute inset-0 "></div>

        {/* GLOW */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] rounded-full blur-3xl"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center px-10 mt-5 text-center">

          <h1 className="text-4xl font-bold  text-white tracking-tight">
            Thinkbotic
          </h1>

          <p className="text-white/80 mt-4 text-lg max-w-md leading-relaxed">
            Build your account and explore premium shopping experiences with
            futuristic technology and modern design.
          </p>

          {/* IMAGE */}
          <div className="relative w-[500px] h-[500px] mt-6 ">

            <DotLottieReact
      src="/ecomm_cart.lottie"
      loop
      autoplay
      
    />
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 relative">

      
        <div className="absolute top-10 right-10 w-40 h-40  rounded-full blur-3xl"></div>

        <div className="absolute bottom-10 left-10 w-52 h-52  rounded-full blur-3xl"></div>

        {/* FORM CARD */}
        <div className="relative z-10 w-full max-w-2xl  backdrop-blur-xl  rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1"  style={{boxShadow : "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px"}}>

          {/* HEADER */}
          <div className="text-center mb-8">

            <h2 className="text-4xl font-bold text-white">
              Create Account
            </h2>

            <p className="text-white mt-3">
              Join us and start your premium journey today.
            </p>

          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* USERNAME */}
            <div className="relative">

              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full px-4 pt-5 pb-2 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10 outline-none transition-all"
              />

              <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm">
                Username
              </label>

            </div>

        
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div className="relative">

                <input
                  type="text"
                  name="firstname"
                  required
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 outline-none transition-all"
                />

                <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm">
                  First Name
                </label>

              </div>

              <div className="relative">

                <input
                  type="text"
                  name="lastname"
                  required
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 outline-none transition-all"
                />

                <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm">
                  Last Name
                </label>

              </div>

            </div>

        
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* GENDER */}
              <div className="relative">

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 outline-none transition-all text-gray-600"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

              </div>

              {/* PHONE */}
              <div className="relative">

                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 outline-none transition-all"
                />

                <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm">
                  Phone Number
                </label>

              </div>

            </div>

            {/* EMAIL */}
            <div className="relative">

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full px-4 pt-5 pb-2 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 outline-none transition-all"
              />

              <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm">
                Email Address

              </label>

            </div>

            {/* PASSWORD */}
            {/* <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full px-4 pt-6 pb-2 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:border-primary-red focus:ring-4 focus:ring-primary-red/10 outline-none transition-all"
              />

              <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
                Password
              </label>

            
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-blue transition"
              >
                {showPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>

            </div> */}

            {/* TERMS */}
            {/* <div className="flex items-center gap-2 text-sm text-gray-500">

              <input
                type="checkbox"
                className="accent-primary-blue w-4 h-4"
              />

              <p>
                I agree to the{" "}
                <span className="text-primary-blue cursor-pointer">
                  Terms & Conditions
                </span>
              </p>

            </div> */}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-gradient-blue text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

          </form>

          {/* LOGIN */}
          <div className="mt-6 text-center">
            <p className="text-white text-sm">
              Already have an account?{" "}

              <Link
                href="/signin"
                className="text-primary-blue font-bold hover:text-primary-blue transition"
              >
                Login
              </Link>

            </p>
          </div>

        </div>
      </div>
    </div>
  );
}