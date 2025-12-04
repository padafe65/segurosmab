import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        {children}
      </div>
      <Footer />
    </>
  );
}
