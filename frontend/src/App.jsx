import "./App.css";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Contactus from "./pages/Contactus";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Services from "./pages/Services";

const MainFunction = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <MainFunction />,
    children: [
      { path: "", element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/about", element: <Aboutus /> },
      { path: "/contact", element: <Contactus /> },
      { path: "/contact", element: <Contactus /> },
      { path: "/services", element: <Services /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
