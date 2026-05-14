"use client";

import {

  createContext,
  useContext,
  useEffect,
  useState,

} from "react";

import api from "../lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
// import { cookies } from "next/headers";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const response = await api.get(
          "/api/auth/user"
        );

        console.log(
          "User data:",
          response.data
        );

        setUser(response.data.userData);

      } catch (error) {

        console.error(
          "Error fetching user data:",
          error
        );

        setUser(null);

      } finally {

        setLoading(false);

      }
    };

    fetchUser();

  }, []);

 
  const logout = async () => {

    try {

      await api.post("/api/auth/logout");

      setUser(null);
      toast.success("Logout successful");

router.push("/signin");
    } catch (error) {

      console.log(error);

    }
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
};


export const useAuth = () =>
  useContext(AuthContext);