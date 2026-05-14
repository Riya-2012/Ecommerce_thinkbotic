"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { auth, firebase } from "@/app/lib/firebase";

import api from "@/app/lib/axios";

export default function SigninPage() {

  const router = useRouter();
const { setUser } = useAuth();
  const [formData, setFormData] = useState({

    phone: "",
    otp: "",

  });

  const [loading, setLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);

  const [confirmationResult, setConfirmationResult] =
    useState(null);

  /* HANDLE CHANGE */
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });
  };

  /* SEND OTP */
  const onPhoneSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      /* CLEAR OLD CAPTCHA */
      if (window.recaptchaVerifier) {

        window.recaptchaVerifier.clear();

      }

      /* CREATE CAPTCHA */
      window.recaptchaVerifier =
        new firebase.auth.RecaptchaVerifier(

          "recaptcha-container",

          {
            size: "invisible",
          }
        );

      const appVerifier =
        window.recaptchaVerifier;

      /* SEND OTP */
      const result =
        await auth.signInWithPhoneNumber(

          "+91" + formData.phone,

          appVerifier

        );

      setConfirmationResult(result);

      setShowOtp(true);

      toast.success("OTP Sent Successfully");

    } catch (error) {

      console.log(error);

      toast.error(error.message);

    } finally {

      setLoading(false);

    }
  };

  /* VERIFY OTP */
  const onOtpSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      if (!confirmationResult) {

        toast.error(
          "Please request OTP first"
        );

        return;
      }

      /* VERIFY OTP */
      const result =
        await confirmationResult.confirm(
          formData.otp
        );

      /* FIREBASE TOKEN */
      const idToken =
        await result.user.getIdToken();

      /* BACKEND LOGIN */
      const response = await api.post(

        "/api/auth/login",

        { idToken }

      );

      console.log(response.data);

      toast.success("Login Successful");
      setUser(response.data.userData);
      router.push("/");

    } catch (error) {

      console.log(error);

      toast.error(

        error.response?.data?.msg ||

        error.message ||

        "OTP Verification Failed"

      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen flex bg-gradient-blue-red overflow-hidden">

      {/* LEFT SIDE */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden items-center justify-center">

        <div className="absolute inset-0"></div>

        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-center px-10 mt-5 text-center">

          <h1 className="text-4xl font-bold text-white tracking-tight">

            Thinkbotic

          </h1>

          <p className="text-white/80 mt-4 text-lg max-w-md leading-relaxed">

            Build your account and explore premium shopping experiences with futuristic technology and modern design.

          </p>

          <div className="relative w-[500px] h-[500px] mt-6">

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

        <div className="absolute top-10 right-10 w-40 h-40 rounded-full blur-3xl"></div>

        <div className="absolute bottom-10 left-10 w-52 h-52 rounded-full blur-3xl"></div>

        {/* FORM CARD */}
        <div
          className="relative z-10 w-full max-w-2xl backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1"
          style={{
            boxShadow:
              "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
          }}
        >

          {/* HEADER */}
          <div className="text-center mb-8">

            <h2 className="text-4xl font-bold text-white">

              Login

            </h2>

            <p className="text-white mt-3">

              Join us and start your premium journey today.

            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={
              showOtp
                ? onOtpSubmit
                : onPhoneSubmit
            }
            className="space-y-5"
          >

            {/* PHONE */}
        {/* PHONE */}
{!showOtp && (

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

)}
{showOtp && (

  <p className="text-sm text-white text-center">

    OTP sent to +91 ******{formData.phone.slice(-4)}

  </p>

)}
            {/* OTP */}
            {showOtp && (

              <div className="relative">

                <input
                  type="text"
                  name="otp"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 outline-none transition-all"
                />

                <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm">

                  Enter OTP

                </label>

              </div>

            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-gradient-blue text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
            >

              {loading
                ? "Please Wait..."
                : showOtp
                ? "Verify OTP"
                : "Send OTP"}

            </button>

          </form>

          {/* CAPTCHA */}
          <div id="recaptcha-container"></div>

          {/* SIGNUP */}
          <div className="mt-6 text-center">

            <p className="text-white text-sm">

              Not an account?{" "}

              <Link
                href="/signup"
                className="text-primary-blue font-bold hover:text-primary-blue transition"
              >

                Signup

              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}