import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserProfileQuery } from "../../redux/features/usersApi";
import {
  setCredentials,
  logout,
  selectIsAuthenticated,
} from "../../redux/features/authSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Only fetch profile if user is authenticated (has token in store)
  const {
    data: userProfile,
    error,
    isError,
  } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (userProfile?.success && userProfile?.user) {
      // Update user data in store if profile fetch is successful
      dispatch(
        setCredentials({
          user: userProfile.user,
          token: null, // Token is already in cookies
        })
      );
    } else if (isError && error?.status === 401) {
      // If token is invalid, logout user and clear localStorage
      localStorage.removeItem("token");
      dispatch(logout());
    }
  }, [userProfile, isError, error, dispatch]);

  return children;
};

export default AuthInitializer;
