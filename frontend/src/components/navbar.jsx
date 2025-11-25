import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authcontext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    // 1. Ubah container nav: Hapus bg-white shadow-lg, ganti tema RPG
    <nav className="bg-rpg-card border-b-4 border-rpg-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl">🧠</span>
              {/* 2. Ganti warna teks logo */}
              <span className="text-xl font-bold text-rpg-gold tracking-widest">Anti-Brainrot</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {/* 3. Update Link Styling: Hapus rounded, ganti warna text & hover */}
              <Link
                to="/dashboard"
                className={`px-4 py-2 font-bold border-2 transition-all ${
                  isActive('/dashboard')
                    ? 'bg-rpg-bg text-rpg-gold border-rpg-border translate-y-1'
                    : 'text-rpg-text border-transparent hover:bg-rpg-bg hover:text-rpg-gold hover:border-rpg-border'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/activities"
                className={`px-4 py-2 font-bold border-2 transition-all ${
                  isActive('/activities')
                    ? 'bg-rpg-bg text-rpg-gold border-rpg-border translate-y-1'
                    : 'text-rpg-text border-transparent hover:bg-rpg-bg hover:text-rpg-gold hover:border-rpg-border'
                }`}
              >
                Activities
              </Link>
              <Link
                to="/add-activity"
                className={`px-4 py-2 font-bold border-2 transition-all ${
                  isActive('/add-activity')
                    ? 'bg-rpg-bg text-rpg-gold border-rpg-border translate-y-1'
                    : 'text-rpg-text border-transparent hover:bg-rpg-bg hover:text-rpg-gold hover:border-rpg-border'
                }`}
              >
                Add Activity
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* 4. Ganti warna teks user */}
            <div className="text-sm text-rpg-text">
              👋 <span className="font-semibold text-rpg-gold">{user?.username}</span>
            </div>
            {/* 5. Tombol Logout Style RPG */}
            <button
              onClick={handleLogout}
              className="bg-rpg-danger text-white border-2 border-rpg-border shadow-pixel hover:translate-y-1 hover:shadow-pixel-active px-4 py-2 font-bold transition-all"
            >
              Flee
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;