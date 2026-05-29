"use client";

import React from "react";

function Pagination({

  currentPage,

  totalPages,

  onPageChange,
}) {

  return (

    <div className="flex items-center justify-center gap-2 mt-6 mb-10 flex-wrap">

      {/* PREVIOUS BUTTON */}

      <button

        disabled={currentPage === 1}

        onClick={() =>
          onPageChange(currentPage - 1)
        }

        className="px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm disabled:opacity-40"
      >

        Prev

      </button>

      {/* PAGE NUMBERS */}

      {[...Array(totalPages)].map((_, i) => {

        const page = i + 1;

        return (

          <button

            key={page}

            onClick={() =>
              onPageChange(page)
            }

            className={`

              w-10 h-10 rounded-xl font-semibold transition

              ${
                currentPage === page

                  ? "bg-gradient-blue-red text-white"

                  : "bg-white border border-gray-200 text-gray-700 hover:border-primary-blue hover:text-primary-blue"
              }
            `}
          >

            {page}

          </button>
        );
      })}

      {/* NEXT BUTTON */}

      <button

        disabled={currentPage === totalPages}

        onClick={() =>
          onPageChange(currentPage + 1)
        }

        className="px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm disabled:opacity-40"
      >

        Next

      </button>

    </div>
  );
}

export default Pagination;
