import React, { useState } from "react";
import { COLORS } from "../constants/Colors";
import { apiFetch } from "../api/client";

interface LoginProps {
  onLogin: (userId: number) => void;
  onBackToLogin: () => void;
}
const Register: React.FC<LoginProps> = ({ onLogin, onBackToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isErrorStatus, setIsErrorStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");
    setIsErrorStatus(false);

    if (password !== confirmPassword) {
      setIsErrorStatus(true);
      setStatusMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiFetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsErrorStatus(false);
        setStatusMessage("Registration successful. Redirecting to login...");
        setTimeout(() => onBackToLogin(), 700);
      } else {
        const error = await response.text();
        setIsErrorStatus(true);
        setStatusMessage(error || "Registration failed.");
      }
    } catch (err) {
      setIsErrorStatus(true);
      setStatusMessage("Error connecting to server.");
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
        <h3
          className="card-title text-center mb-3"
          style={{ letterSpacing: "0.1em", color: COLORS.mainFontColor }}
        >
          Initialize Account
        </h3>
        <p className="text-center mb-2 login-subtext">
          Create your account to start paper trading.
        </p>
        <p className="text-center mb-3 login-microcopy">
          Credentials are encrypted in transit.
        </p>
        {statusMessage && (
          <div
            className={`mb-3 ${isErrorStatus ? "login-error-banner" : "login-success-banner"}`}
            aria-live="polite"
          >
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Identity Field */}
          <div className="mb-3">
            <label
              className="form-label small text-uppercase fw-bold"
              style={{ color: COLORS.secondaryTextColor }}
            >
              Set Username
            </label>
            <input
              type="text"
              className="search-bar"
              placeholder="NEW_IDENTITY"
              autoComplete="username"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              required
            />
          </div>
          <div className="mb-3">
            <label
              className="form-label small text-uppercase fw-bold"
              style={{ color: COLORS.secondaryTextColor }}
            >
              SET PASSWORD
            </label>
            <div className="login-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                className="search-bar"
                placeholder="••••••••"
                autoComplete="new-password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                style={{ paddingRight: "66px" }}
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

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label
              className="form-label small text-uppercase fw-bold"
              style={{ color: COLORS.secondaryTextColor }}
            >
              CONFIRM PASSWORD
            </label>
            <div className="login-password-wrap">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="search-bar"
                placeholder="••••••••"
                autoComplete="new-password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                style={{ paddingRight: "66px" }}
                required
              />
              <button
                type="button"
                className="login-toggle-password"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div className="login-actions">
            <button
              type="submit"
              className="btn-sleek btn-sleek-green w-100 mb-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "CREATING..." : "CREATE ACCESS"}
            </button>
            <button
              type="button"
              className="btn-sleek btn-sleek-dark w-100"
              onClick={onBackToLogin}
            >
              RETURN TO TERMINAL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
