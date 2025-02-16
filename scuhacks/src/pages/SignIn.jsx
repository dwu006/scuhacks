import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    console.log("Sign-in button clicked!"); // 🔍 Debugging Log

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data); // 🔍 Debugging Log

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT
        navigate("/garden"); // Redirect to the dashboard
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Sign In</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                console.log("Email updated:", e.target.value); // 🔍 Debugging Log
                setEmail(e.target.value);
              }}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                console.log("Password updated:", e.target.value); // 🔍 Debugging Log
                setPassword(e.target.value);
              }}
              required
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;


