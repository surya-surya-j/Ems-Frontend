import axios from "axios";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthsContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); 
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleonSubmit = async (e) => {
    e.preventDefault();
    try {
      const responce = await axios.post(
        "https://ems-backend-beige.vercel.app/api/auth/login",
        {
          email,
          password,
        }
      );
      if (responce.data.success) {
        login(responce.data.user);
        localStorage.setItem("token", responce.data.token);
        if (responce.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
        console.log(responce.data.user);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Server Error");
      }
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
      <h2 className="font-Pacific text-3xl text-white">
        Employee Management System
      </h2>
      <div className="border shadow p-6 w-80 bg-white">
        <h2 className="text-2xl font-bold mb-4 ">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleonSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="px-3 py-2 border w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="px-3 py-2 border w-full"
              required
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label className="inline-flex items-center ">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-teal-600">
              Forgot Password?
            </a>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
