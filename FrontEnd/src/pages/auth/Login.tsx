import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../api/auth.api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginApi({ email, password });
      navigate("/home");
    } catch (err) {
      console.log(err)
      setError("Invalid emailllll or password");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: "15px" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ marginTop: "15px" }}>
        <button onClick={() => navigate("/register/user")}>
          Register as User
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate("/register/provider")}>
          Register as Provider
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default Login;
