"use client";

import React,
{
  useState
} from "react";

import {
  FaSearch
} from "react-icons/fa";

import {
  useRouter
} from "next/navigation";

function SearchBar() {

  const router =
    useRouter();

  const [searchQuery,
  setSearchQuery] =
    useState("");

  const handleSearch =
    () => {

      if (
!searchQuery.trim()
      ) return;

      router.push(

`/products?search=${searchQuery}`
      );
    };

  return (

    <div className="w-full md:max-w-[260px] lg:max-w-lg border border-primary-blue rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-primary-blue transition bg-white">

      <div className="flex items-center">

        <input

          type="text"

          placeholder="Search products..."

          value={searchQuery}

          onChange={(e) =>
setSearchQuery(
e.target.value
)
          }

          onKeyDown={(e) => {

            if (
e.key === "Enter"
            ) {

              handleSearch();
            }
          }}

          className="flex-1 px-3 lg:px-4 py-2 text-sm outline-none"
        />

        <button

          onClick={handleSearch}

          className="flex items-center justify-center px-4 lg:px-6 py-2.5 border-l bg-gradient-blue text-white hover:opacity-90 transition"
        >

          <FaSearch />

        </button>

      </div>

    </div>
  );
}

export default SearchBar;