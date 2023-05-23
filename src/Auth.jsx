import { useState, useContext } from "react";
import { AccessTokenContext } from "./App";

const Auth = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const tokenContext = useContext(AccessTokenContext);
  const setAccessToken = tokenContext.setToken;

  const handleFormUpdate = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async (e) => {
    //{
    //   email: "john@mail.com",
    //   password: "changeme",
    // }

    e.preventDefault();
    const response = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });
    const jsonResponse = await response.json();
    const accessToken = jsonResponse.access_token;
    const refreshToken = jsonResponse.refresh_token;

    // Refresh Token, keep it in a HttpOnly browser cookie.
    document.cookie = `refreshToken=${refreshToken}; SameSite=None; Secure;`;

    // Set Access token in memory. (React State)
    setAccessToken(accessToken);
  };

  return (
    <form>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input name="email" type="email" onChange={handleFormUpdate} />
        <input name="password" type="password" onChange={handleFormUpdate} />
      </div>
      <button onClick={loginUser}>Login</button>
    </form>
  );
};

export default Auth;
