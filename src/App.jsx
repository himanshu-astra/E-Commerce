import "./App.css";
import Auth from "./Auth";
import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import {
  gloabalAxiosWithInterceptor as axios,
  axiosWithoutInterceptor,
} from "./axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./ProductList";

export const AccessTokenContext = createContext(null);

// https://dribbble.com/shots/18808576-App-sign-up-page-Untitled-UI

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const interceptorId = axios.interceptors.request.use(
      async (config) => {
        if (token) {
          const decoded = jwt_decode(token);
          const expiresOnEpoch = decoded.exp;
          const todaysTime = Date.now();
          let newToken = token;

          if (todaysTime > expiresOnEpoch) {
            const config = {
              url: " https://api.escuelajs.co/api/v1/auth/refresh-token",
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              validateStatus: null,
              data: {
                refreshToken: localStorage.getItem("refreshToken"),
              },
            };
            const response = await axiosWithoutInterceptor.request(config);
            const newAccessToken = response.data.access_token;
            setToken(newAccessToken);
            newToken = newAccessToken;
          }
          config.headers["Authorization"] = "Bearer " + newToken;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, [token]);

  return (
    <BrowserRouter>
      <AccessTokenContext.Provider value={{ token, setToken }}>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<ProductList />} />
        </Routes>
      </AccessTokenContext.Provider>
    </BrowserRouter>
  );
}

export default App;

// SignUp, SignIn => Authentication.
// Products shown to users.
// Filter products/Search Products.
// Add to card, Remove from cart.
// WishList.
// Payment System (Razorpay/Stripe/Paypal).
