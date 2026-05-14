import { FaPhone, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaLinkedinIn } from "react-icons/fa6";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";
function Footer() {
  return (
    <div className=" shadow-2xl" >

      {/* MAIN FOOTER */}
      <div className="px-6 lg:px-12 py-12 shadow-md text-white"> 

        {/* GRID */}
        <div className="max-w-[1400px] mx-auto  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          
          <div className="lg:col-span-2 md:col-span-3">

            <Image src="/Logo.png" height={250} width={250} alt="logo" />

            <p className="mt-4 text-black max-w-md text-sm leading-relaxed">
              Thinkbotic Technology Pvt. Ltd. delivers innovative e-commerce and
              digital solutions. We focus on quality, performance, and user-friendly
              experiences to help businesses grow faster.
            </p>

            {/* Address*/}
            <p className="flex items-center gap-1 text-sm hover:text-primary-blue text-black transition mt-6">
                <IoLocationSharp className="text-primary-red"   size={22}/>
                E-14, 3rd Floor, Sector-3, Noida, <br /> Uttar Pradesh - 201301, India
              </p>
      
          </div>

     

           {/* QUICK LINKS */}
          <div >
            <h2 className="font-semibold text-lg text-primary-red mb-4">
              Quick Links
            </h2>

            <ul className="space-y-3 text-black text-sm">
              <li className="hover:text-primary-blue cursor-pointer transition">
                Home
              </li>
              <li className="hover:text-primary-blue cursor-pointer transition">
                Products
              </li>
              <li className="hover:text-primary-blue cursor-pointer transition">
                Cart
              </li>
              <li className="hover:text-primary-blue cursor-pointer transition">
                Login
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h2 className="font-semibold text-lg text-primary-red mb-4">
              Contact
            </h2>

            <div className="space-y-4 text-black text-sm">

              <p className="flex items-center gap-2 hover:text-primary-blue transition">
                <FaPhone className="text-primary-blue"   size={20}/>
                (+91) 888888888
              </p>

              <p className="flex items-center gap-2 hover:text-primary-blue transition">
                <IoIosMail className="text-primary-blue"   size={20}/>
                support@thinkbotic.in
              </p>

            </div>
                  <div className="flex gap-4 mt-6">

              {[FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-primary-red hover:bg-gradient-blue-red hover:text-primary-blue transition cursor-pointer"
                >
                  <Icon />
                </div>
              ))}

            </div>
          </div>
      

        </div>
      </div>

      {/* BOTTOM */}
      <div className=" bg-gradient-blue-red text-white text-center py-4 text-sm">
        © SRK Innovations - All Rights Reserved | Powered by Thinkbotic
      </div>

    </div>
  );
}

export default Footer;