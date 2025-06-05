import React, { useState } from "react";
import Particles from "../compenents/particles";
import Emailform from "./components/emailform";
import Usernameform from "./components/usernameform";
import Passwordform from "./components/Passwordform";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
   const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload =
      mode === "signup"
        ? { email, username, password }
        : { email, password };

    try {
      const response = await fetch(`http://localhost:8080/users/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      

      // Handle success (e.g., store token, redirect)
      localStorage.setItem("token", data.token);
      localStorage.setItem("username",username);
      
      alert(`${mode === "signup" ? "Signup" : "Login"} successful!`);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="relative w-screen h-screen bg-black">
      


    {/* Centered Login Form */}
    <div className="relative w-screen h-screen bg-black">
      <Particles />

      <div className="relative z-10 flex flex-col justify-center items-center h-full px-6">
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg max-w-md w-full p-10 text-gray-300">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-800 bg-opacity-50 rounded-full p-1">
              <button
                onClick={() => setMode("login")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  mode === "login"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  mode === "signup"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-100">
            {mode === "login" ? "Welcome Back" : "Create an Account"}
          </h2>

          {error && (
            <p className="mb-4 text-sm text-red-400 text-center">{error}</p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Emailform value={email} onChange={(e) => setEmail(e.target.value)} />
            {mode === "signup" && (
              <Usernameform value={username} onChange={(e) => setUsername(e.target.value)} />
            )}
            <Passwordform value={password} onChange={(e) => setPassword(e.target.value)} />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-600 rounded-lg font-semibold text-lg tracking-wide hover:brightness-110 active:brightness-90 transition"
            >
              {loading
                ? "Processing..."
                : mode === "login"
                ? "Sign In"
                : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-indigo-400 font-semibold hover:underline"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>

    </div>
  );
}
