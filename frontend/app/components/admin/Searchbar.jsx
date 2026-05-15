"use client";

import { FaSearch } from "react-icons/fa";

import { FaFilter } from "react-icons/fa6";

import { RiResetLeftLine } from "react-icons/ri";

export default function Searchbar({

  search,

  setSearch,

  placeholder = "Search...",

  showFilter = true,

  onFilter,

  onReset,

}) {

  return (

    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6">

      {/* SEARCH */}

      <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm w-full lg:max-w-[650px]">

        <FaSearch
          size={16}
          className="text-gray-400"
        />

        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="outline-none w-full text-sm bg-transparent"
        />

      </div>

      {/* ACTIONS */}

      {showFilter && (

        <div className="flex items-center gap-4">

          {/* FILTER */}

          <button
            onClick={onFilter}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-blue text-white font-medium hover:opacity-90 transition"
          >

            <FaFilter />

            Filter

          </button>

          {/* RESET */}

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-red text-white font-medium hover:opacity-90 transition"
          >

            <RiResetLeftLine />

            Reset

          </button>

        </div>

      )}

    </div>

  );
}