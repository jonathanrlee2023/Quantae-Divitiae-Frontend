import React, { useState } from "react";
import { COLORS } from "../constants/Colors";
import { MetalText } from "../components/shared/MetalText";
import { setAccessToken } from "../auth/token";
import { apiFetch } from "../api/client";

interface LoginProps {
  onLogin: (userId: number) => void;
  onGoToRegister: () => void;
  onBackToLanding: () => void;
}

const Login: React.FC<LoginProps> = ({
  onLogin,
  onGoToRegister,
  onBackToLanding,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await apiFetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof data?.access_token === "string" && data.access_token) {
          setAccessToken(data.access_token);
        }
        onLogin(data.user_id);
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Could not connect to the backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 login-container">
      <div
        className="card p-4 login-card"
        style={{
          width: "380px",
          border: `1px solid ${COLORS.borderColor}`,
          boxShadow: `0 4px 8px ${COLORS.loginShadowColor}`,
        }}
      >
        <MetalText
          children="QUANTAE DIVITIAE"
          className="card-title text-center mb-3"
          fontSize="2rem"
        />
        <p className="text-center mb-2 login-subtext">
          Sign in to continue to your dashboard.
        </p>
        {errorMessage && (
          <div className="mb-3 login-error-banner" aria-live="polite">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label
              className="form-label small text-uppercase fw-bold"
              style={{ color: COLORS.secondaryTextColor }}
            >
              Username
            </label>
            <input
              type="text"
              className="search-bar"
              placeholder="ENTER USERNAME"
              value={username}
              autoComplete="username"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              style={{ borderRadius: "4px" }}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              className="form-label small text-uppercase fw-bold"
              style={{ color: COLORS.secondaryTextColor }}
            >
              Password
            </label>
            <div className="login-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                className="search-bar"
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                style={{ borderRadius: "4px", paddingRight: "66px" }}
                required
              />
              <button
                type="button"
                className="login-toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>
          <div className="text-center login-actions">
            <button
              type="submit"
              className="btn-sleek btn-sleek-green w-100 mb-3"
              disabled={isSubmitting}
              style={{
                fontSize: "11px",
                height: "35px",
                letterSpacing: "0.05em",
              }}
            >
              {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
            </button>
            <button
              type="button"
              className="btn-sleek btn-sleek-dark w-100 mb-3"
              style={{
                fontSize: "11px",
                height: "35px",
                letterSpacing: "0.05em",
              }}
              onClick={onGoToRegister}
            >
              CREATE ACCOUNT
            </button>
            <button
              type="button"
              className="btn-sleek btn-sleek-dark w-100 mt-2"
              style={{
                fontSize: "11px",
                height: "35px",
                letterSpacing: "0.05em",
              }}
              onClick={onBackToLanding}
            >
              BACK TO HOMEPAGE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
