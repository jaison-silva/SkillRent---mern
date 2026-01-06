import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await api.get("/users/home");
        setMessage(res.data?.message || "Welcome");
      } catch (err: unknown) {
        console.log(err)
        setError("Unauthorized. Please login again.");
        setTimeout(() => navigate("/login"), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Home</h2>
      <p>{message}</p>
    </div>
  );
};

export default Home;
