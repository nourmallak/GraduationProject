import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Layout/Navbar/Navbar";
import Footer from "../components/Layout/Footer/Footer";
import PageTitleSetter from "../PageTitleSetter";
import Loader from "../Loader/Loader";


export default function Root() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <PageTitleSetter />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
