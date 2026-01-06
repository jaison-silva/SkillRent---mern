import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyOtpApi } from "../../api/otp.api";
import { registerUserApi, registerProviderApi } from "../../api/auth.api";

const RegisterOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, name, password, role } = location.state;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!email || !password || !role) {
    navigate("/register/user");
    return null;
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyOtpApi({
        email,
        otp,
        purpose: "verification",
      });

      if (role === "user") {
        await registerUserApi({
          name,
          email,
          password,
        });
      } else if (role === "provider") {
        await registerProviderApi({
          name,
          email,
          password,
        });
      }

      navigate("/login");
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Verify OTP</h2>
      <p>OTP sent to {email}</p>

      <form onSubmit={handleVerifyOtp}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify & Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterOtp;
