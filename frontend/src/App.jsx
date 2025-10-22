import "./App.css";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import AuthInitializer from "./components/common/AuthInitializer";
import LanguageInitializer from "./components/common/LanguageInitializer";
import AdminRoute from "./components/common/AdminRoute";
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Services from "./pages/Services";
import Contactus from "./pages/Contactus";
import TermsAndConditions from "./pages/TermsAndConditions";
import VisionMission from "./pages/VisionMission";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./components/common/Login";
import Signup from "./components/common/Signup";
import VerifyOTP from "./components/auth/VerifyOTP";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPasswordVerify from "./components/auth/ResetPasswordVerify";
import ResetPasswordNew from "./components/auth/ResetPasswordNew";
import OrderPage from "./pages/Order";
import RouteMiddleware from "./components/common/RouteMiddleware";
import Dashboard from "./pages/Dashboard";
import BotpressChat from "./components/common/BotpressChat";
import DeliveryConfirmation from "./pages/DeliveryConfirmation";

const MainFunction = () => {
  return (
    <AuthInitializer>
      <LanguageInitializer>
        <div>
          <RouteMiddleware />
          <Navbar />
          <Outlet />
          <Footer />
          <BotpressChat />
        </div>
      </LanguageInitializer>
    </AuthInitializer>
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
      { path: "/terms", element: <TermsAndConditions /> },
      { path: "/vision-mission", element: <VisionMission /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/verify-otp", element: <VerifyOTP /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password-verify", element: <ResetPasswordVerify /> },
  { path: "/reset-password-new", element: <ResetPasswordNew /> },
  {
    path: "/delivery-confirmation/:orderId",
    element: (
      <LanguageInitializer>
        <DeliveryConfirmation />
      </LanguageInitializer>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <LanguageInitializer>
          <Dashboard />
        </LanguageInitializer>
      </AdminRoute>
    ),
  },
]);

function App() {
  return (
    <div className="max-w-[1440px] mx-auto">
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1C1C1C",
            color: "#D4AF37",
            borderRadius: "8px",
            fontWeight: "500",
          },
          success: {
            iconTheme: {
              primary: "#D4AF37",
              secondary: "#1C1C1C",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
            style: {
              background: "#ef4444",
              color: "#ffffff",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
