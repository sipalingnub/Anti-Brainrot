import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authcontext'; // Import dari file yang baru dibuat di folder yang sama

// Menggunakan placeholder image online untuk background sementara agar kode bisa berjalan di preview
const bgLogin = "https://images.unsplash.com/photo-1614726365723-498aa67c5f7b?q=80&w=1932&auto=format&fit=crop"; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      {/* Overlay agak gelap */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="max-w-md w-full relative z-10 animate-fade-up">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🏰</div>
          <h1 className="text-4xl font-bold text-rpg-gold mb-2 tracking-widest drop-shadow-md font-pixel">
            ANTI-BRAINROT
          </h1>
          <p className="text-rpg-text opacity-90 text-shadow font-bold font-pixel">Save your brain, hero!</p>
        </div>

        <div className="bg-rpg-card/95 backdrop-blur-sm border-4 border-rpg-border shadow-pixel p-8 relative">
          {/* Dekorasi Baut */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-rpg-border"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-rpg-border"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-rpg-border"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-rpg-border"></div>

          <h2 className="text-2xl font-bold text-rpg-gold mb-6 text-center uppercase tracking-wide border-b-2 border-rpg-border pb-4 font-pixel">
            Identify Thyself
          </h2>
          
          {error && (
            <div className="bg-rpg-danger text-white border-2 border-rpg-border px-4 py-3 mb-4 font-bold text-sm font-pixel">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-pixel">
            <div>
              <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Email Scroll</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field" 
                placeholder="hero@guild.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Secret Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary mt-4">
              {loading ? 'Opening Gate...' : 'ENTER REALM'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400 font-pixel">
            New here?{' '}
            <Link to="/register" className="text-rpg-gold hover:underline font-bold">Join the Guild</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
