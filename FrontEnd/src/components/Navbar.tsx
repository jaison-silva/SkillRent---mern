import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Home, Shield, Search } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
        <Link to="/home" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="SkillRent Logo" className="w-8 h-8 rounded-lg group-hover:rotate-12 transition-transform" />
          <span className="text-xl font-bold text-white hidden sm:block">SkillRent</span>
        </Link>

        {user && (
          <div className="flex items-center gap-2 sm:gap-6">
            <Link
              to="/home"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:block">Home</span>
            </Link>

            <Link
              to="/explore"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:block">Explore</span>
            </Link>

            {user.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden md:block">Admin</span>
              </Link>
            )}

            <Link
              to="/profile"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium"
            >
              <User className="w-4 h-4" />
              <span className="hidden md:block">{user.name}</span>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </motion.button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
