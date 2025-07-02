import "./App.css";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Services from "./pages/Services";
import Contactus from "./pages/Contactus";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Login from "./components/common/Login";
import Signup from "./components/common/Signup";
import OrderPage from "./pages/Order";
import RouteMiddleware from "./components/common/RouteMiddleware";

const MainFunction = () => {
  return (
    <div>
      <RouteMiddleware />
      <Navbar />
      <Outlet />``
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
      { path: "/services", element: <Services /> },
      { path: "/book-now", element: <OrderPage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]); 

function App() {
  return <RouterProvider router={router} />;
}

export default App;
