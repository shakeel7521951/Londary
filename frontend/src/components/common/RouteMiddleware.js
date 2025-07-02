// RouteMiddleware.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteMiddleware = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    console.log("Route changed to:", location.pathname);

    window.scrollTo(0, 0);
  }, [location]);

  return children;
};

export default RouteMiddleware;
