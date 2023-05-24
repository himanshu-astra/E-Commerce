import { useState, useContext } from "react";
import { AccessTokenContext } from "./App";
import { gloabalAxiosWithInterceptor as axios } from "./axios";

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
    e.preventDefault();

    const config = {
      url: "https://api.escuelajs.co/api/v1/auth/login",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: "john@mail.com",
        password: "changeme",
      },
    };

    const response = await axios.request(config);
    const jsonResponse = await response.data;
    const accessToken = jsonResponse.access_token;
    const refreshToken = jsonResponse.refresh_token;

    // Refresh Token, keep it in a HttpOnly browser cookie.
    localStorage.setItem("refreshToken", refreshToken);
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
