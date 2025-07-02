import HeaderSlides from "../components/services/HeaderSlides";
import VIPConcierge from "../components/services/VIPConcierge";
import Services from "../components/services/Services";

const ServicesPage = () => {
  return (
    <div className="bg-[#f8f5f2]">
      <HeaderSlides />
      <Services />
      <VIPConcierge />
    </div>
  );
};

export default ServicesPage;
