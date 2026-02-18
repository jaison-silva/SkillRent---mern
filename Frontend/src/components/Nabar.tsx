import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logOut } from '../features/auth/authSlice';
import { User, LogOut, MessageSquare, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
            SkillRent
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-gray-600 hover:text-blue-600 font-medium">Browse</Link>
            
            {user ? (
              // Authenticated View
              <div className="flex items-center space-x-6">
                <Link to="/post-skill" className="flex items-center text-gray-600 hover:text-blue-600">
                  <PlusCircle className="w-5 h-5 mr-1" />
                  <span>Post a Skill</span>
                </Link>
                <Link to="/messages" className="text-gray-600 hover:text-blue-600">
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <Link to="/profile" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              // Unauthenticated View
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
                <Link 
                  to="/auth/signup/:provider" 
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Join as Provider
                </Link>
                <Link 
                  to="/auth/signup/:user" 
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Join as User
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;