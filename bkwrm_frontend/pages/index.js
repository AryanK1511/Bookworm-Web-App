import React from "react";
import HomePageBanner from "@/components/HomePageBanner/HomePageBanner";
import InfoBanner from "@/components/InfoBanner/InfoBanner";
import Footer from "@/components/Footer/Footer";

const Home = () => {
  return (
    <div>
      <HomePageBanner />
      <InfoBanner />
      <Footer />
    </div>
  );
}

export default Home