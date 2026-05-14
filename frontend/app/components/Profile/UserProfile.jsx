"use client"
import { useAuth } from '@/app/context/AuthContext'
import api from '@/app/lib/axios';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa'

function UserProfile() {
  const {user,setUser}= useAuth();
const {

  register,

  handleSubmit,

  reset,

  watch,

} = useForm();
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
        user.phone || "",

      gender:
        user.gender || "",

    });

  }

}, [user, reset]);

   const onSubmit = async (data) => {
        try {
            const response = await api.put(
                `api/auth/update/${user._id}`,
                data,
               
            );
            setUser(response.data);
            toast.success("User updated successfully");
        } catch (error) {
            console.error("There was an error updating the user!", error);
            if (error.response) {
                console.error("Headers:", error.response.headers);
            } else {
                console.error("Error message:", error.message);
            }
            toast.error("Error updating user");
        }
    };

  return (
    <div className="space-y-8">
   
         {/*  PROFILE FORM */}
         <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
   
          
           {/* FORM */}
           <div className="p-6 sm:p-8">
   
             {/* SECTION TITLE */}
             <div className="mb-8">
   
               <h3 className="text-2xl font-bold text-primary-red">
                 Personal Information
               </h3>
   
               <p className="text-gray-500 text-sm mt-1">
                 Update your profile details here.
               </p>
   
             </div>
   
          <form  onSubmit={handleSubmit(onSubmit)}>

               {/* FORM GRID */}
             <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
   
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
                      {...register("username")}
                   />
   
                 </div>
   
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
                      {...register("firstname")}
                   />
   
                 </div>
   
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
                      {...register("lastname")}
                     className="profileInput"
                     placeholder="Last Name"
                   />
   
                 </div>
   
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
                      {...register("email")}
                     className="profileInput"
                     placeholder="Email"
                   />
   
                 </div>
   
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
                      {...register("phone")}
                     className="profileInput"
                     placeholder="Phone Number"
                   />
   
                 </div>
   
               </div>
   
             </div>
   
             {/* GENDER */}
             <div className="mt-6">
   
               <label className="profileLabel">
                 Gender
               </label>
   
               <div className="flex flex-wrap gap-4 mt-3">
   
                 {["Male", "Female", "Other"].map((item) => (
                   <label
                     key={item}
                     className="flex items-center gap-2 cursor-pointer border border-gray-200 rounded-xl px-5 py-3 hover:border-primary-blue transition"
                   >
   
                    <input

  type="radio"

  value={item}

  {...register("gender")}

  className="accent-primary-blue"

/>
   
                     <span className="text-sm font-medium">
                       {item}
                     </span>
   
                   </label>
                 ))}
   
               </div>
   
             </div>
   
            
             {/* SAVE BUTTON */}
             <div className="mt-10 flex justify-end">
   
               <button type='submit' className="px-8 py-3 bg-gradient-blue-red text-white rounded-2xl font-bold shadow-md hover:shadow-xl hover:scale-[1.02] transition">
   
                 Save Changes
   
               </button>
   
             </div>
          </form>
   
           </div>
   
         </div>
   
       </div>
  )
}

export default UserProfile
