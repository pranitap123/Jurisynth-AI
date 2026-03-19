import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaScaleBalanced, FaArrowRight } from "react-icons/fa6";
import { GoogleLogin } from "@react-oauth/google";

function AuthPage() {

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("advocate");

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "http://localhost:5000/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const endpoint = isLogin
      ? `${API_URL}/login`
      : `${API_URL}/register`;

    const payload = isLogin
      ? { email, password }
      : { name, email, password, role };

    try {

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (!isLogin) {

        setIsLogin(true);
        setSuccessMsg("Account created successfully! Please log in.");
        setPassword("");

      } else {

        localStorage.setItem("loggedInUserName", data.name);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userId", data._id);

        window.location.href = "/dashboard";
      }

    } catch (err) {

      setError(err.message);

    } finally {

      setIsLoading(false);

    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {

    try {

      const response = await fetch(`${API_URL}/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: credentialResponse.credential
        }),
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google authentication failed");
      }

      localStorage.setItem("loggedInUserName", data.name);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userId", data._id);

      window.location.href = "/dashboard";

    } catch (err) {

      setError(err.message);

    }
  };

  return (
    <div className="auth-page-layout">

      <div className="auth-branding-panel">

        <Link to="/" className="branding-logo">
          <FaScaleBalanced style={{ color: "var(--primary-color)", marginRight: "10px" }} />
          Jurisynth
        </Link>

        <div className="branding-content">
          <FaScaleBalanced className="branding-icon" />
          <h2>The AI advantage for modern legal teams.</h2>
          <p>
            Join thousands of legal professionals automating summaries,
            tracking contradictions, and organizing cases securely.
          </p>
        </div>

      </div>

      <div className="auth-form-panel">

        <div className="auth-card">

          <h2>{isLogin ? "Welcome back" : "Create an account"}</h2>

          {error && <div className="auth-alert error">{error}</div>}
          {successMsg && <div className="auth-alert success">{successMsg}</div>}

          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
            />
          </div>

          <div className="auth-divider">
            <span>OR EMAIL</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>

            {!isLogin && (

              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>User Role</label>

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="advocate">Lawyer</option>
                    <option value="user">Client</option>
                  </select>

                </div>
              </>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="name@firm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Create Account"}

              {!isLoading && <FaArrowRight style={{ marginLeft: "8px" }} />}
            </button>

          </form>

          <div className="auth-toggle">

            <p>
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccessMsg(null);
                }}
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AuthPage;