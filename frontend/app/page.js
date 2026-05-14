import Banner from "./components/home/Banner";
import Categories from "./components/home/Categories";
import CatNavbar from "./components/Layouts/CatNavbar";
import DealsSection from "./components/home/Discount";
import CollectionsSection from "./components/home/FeaturedCards";
import Product from "./components/home/Product";
import Slider from "./components/home/Slider";
import TopRatedProducts from "./components/home/TopRated";
import ContactForm from "./components/Layouts/ContactForm";

export default function Home() {
  return (
   
    <div className="">
      <CatNavbar />
     <Banner />
      {/* <Slider /> */}
      <Categories />
<Product />
<CollectionsSection />
<TopRatedProducts />
<DealsSection />
<ContactForm />
    </div>
  );
}
