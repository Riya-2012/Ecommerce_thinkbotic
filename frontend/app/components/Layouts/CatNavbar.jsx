"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  FaChevronDown,
} from "react-icons/fa";

import api from "@/app/lib/axios";

import {
  usePathname,
  useRouter
} from "next/navigation";


export default function StickyCategoryNav() {

  const [show,
    setShow] =
    useState(false);
  const router = useRouter();
  const [open,
    setOpen] =
    useState(false);

  const [categories, setCategories] =
    useState([]);


  // SCROLL

  useEffect(() => {

    const handleScroll =
      () => {

        setShow(
          window.scrollY > 200
        );
      };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  const pathname =
    usePathname();

  const handleTodayDeals =
    () => {

      // ALREADY ON HOME PAGE

      if (pathname === "/") {

        const section =

          document.getElementById(
            "today-deals"
          );

        if (section) {

          section.scrollIntoView({

            behavior: "smooth",
          });
        }
      }

      // OTHER PAGE

      else {

        router.push(
          "/"
        );

        setTimeout(() => {

          const section =

            document.getElementById(
              "today-deals"
            );

          if (section) {

            section.scrollIntoView({

              behavior: "smooth",
            });
          }

        }, 500);
      }
    };

  // FETCH PRODUCTS

  useEffect(() => {

    const fetchProducts =
      async () => {

        try {

          const res =
            await api.get(
              "/api/comman/products"
            );

          const products =
            res.data.data || [];

          // GROUP PRODUCTS

          const grouped =
            {};

          products.forEach(
            (product) => {

              const category =
                product.category;

              if (
                !grouped[
                category
                ]
              ) {

                grouped[
                  category
                ] = [];
              }

              // ADD PRODUCT NAME

              grouped[
                category
              ].push({

                name:
                  product.name,

                id:
                  product._id,

              });
            }
          );

          // REMOVE DUPLICATES

          Object.keys(grouped)
            .forEach((key) => {

              grouped[key] =
                grouped[key].filter(

                  (
                    item,
                    index,
                    self
                  ) =>

                    index ===

                    self.findIndex(
                      (p) =>
                        p.name ===
                        item.name
                    )
                );
            });

          // CONVERT ARRAY

          const formatted =
            Object.keys(
              grouped
            ).map(
              (key) => ({

                title: key,

                items:
                  grouped[
                  key
                  ],

              })
            );

          setCategories(
            formatted
          );

        } catch (error) {

          console.log(error);

        }
      };

    fetchProducts();

  }, []);

  return (

    <div
      className={`w-full z-50 transition-all duration-500 ${show
          ? "fixed top-0 opacity-100 translate-y-0"
          : "fixed -top-20 opacity-0"
        }`}
    >

      <div className="bg-white/90 backdrop-blur-md shadow-sm">

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

          {/* CATEGORY BUTTON */}

          <div className="relative">

            <button
              onClick={() =>
                setOpen(!open)
              }

              className="flex items-center gap-2 text-sm font-medium text-primary-blue"
            >

              Shop by Categories

              <FaChevronDown
                size={12}
                className={`transition ${open
                    ? "rotate-180"
                    : ""
                  }`}
              />

            </button>

            {/* MEGA MENU */}

            <div
              className={`absolute left-0 mt-4 transition-all duration-300 z-50 ${open
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-2"
                }`}
            >

              <div className="bg-white shadow-2xl rounded-2xl w-[95vw] md:w-[600px] lg:w-[700px] p-4 md:p-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                  {categories.slice(0,3).map(
                    (
                      section,
                      i
                    ) => (

                      <div
                        key={i}
                      >

                        {/* CATEGORY */}

                        <Link
                          href={`/products?category=${encodeURIComponent(section.title)}`}
                        >

                          <h3 className="font-semibold text-primary-blue mb-3 hover:underline cursor-pointer">

                            {
                              section.title
                            }

                          </h3>

                        </Link>

                        {/* SUBCATEGORY */}

                        <ul className="space-y-2">

                          {section.items.map(
                            (
                              item,
                              idx
                            ) => (
                              <li key={idx}>

                                <Link
                                  href={`/products/${item.id}`}
                                  className="text-sm text-gray-500 hover:text-primary-blue"
                                >

                                  {item.name}

                                </Link>

                              </li>
                            )
                          )}

                        </ul>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* CENTER LINKS */}

          <div className="hidden md:flex gap-6 text-sm">

            <Link
              className="hover:text-primary-blue text-primary-red font-semibold"
              href="/"
            >

              Home

            </Link>


            <Link
              className="hover:text-primary-blue text-primary-red font-semibold"
              href="/products"
            >

              Shop

            </Link>

            <Link href="/user" >
              <p className="hover:text-primary-blue cursor-pointer text-primary-red font-semibold">
                Setting
              </p>
            </Link>

            <Link className="hover:text-primary-blue cursor-pointer text-primary-red font-semibold" href="/cart">

              Cart

            </Link>

          </div>

          {/* BUTTON */}

          <div >

            <button
              onClick={
                handleTodayDeals
              }
              className="bg-gradient-blue-red text-white px-4 py-2 rounded-full text-sm"
            >

              Today Deals

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}