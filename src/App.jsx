import "./App.css";
import Auth from "./Auth";
import { createContext, useState } from "react";

export const AccessTokenContext = createContext(null);

// https://dribbble.com/shots/18808576-App-sign-up-page-Untitled-UI

function App() {
  const [token, setToken] = useState(null);

  return (
    <AccessTokenContext.Provider value={{ token, setToken }}>
      <Auth />
    </AccessTokenContext.Provider>
  );
}

export default App;

// SignUp, SignIn => Authentication.
// Products shown to users.
// Filter products/Search Products.
// Add to card, Remove from cart.
// WishList.
// Payment System (Razorpay/Stripe/Paypal).
