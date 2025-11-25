import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgLogin from '../assets/1248273.png'; // Sama dengan Login

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dailyLimit: 120,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Secret Keys do not match!");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        dailyLimit: formData.dailyLimit
      };

      await axios.post('http://localhost:5000/api/auth/register', payload);
      alert("Character Created! Please Enter the Realm.");
      navigate('/login'); 

    } catch (err) {
      console.error("Error Register:", err);
      const msg = err.response?.data?.msg || err.response?.data?.message || "Failed to join guild";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="max-w-md w-full relative z-10 animate-fade-up">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">📜</div>
          <h1 className="text-4xl font-bold text-rpg-gold mt-4 mb-2 tracking-widest drop-shadow-md">
            NEW RECRUIT
          </h1>
          <p className="text-rpg-text opacity-90 text-shadow font-bold">Sign the contract to begin your quest!</p>
        </div>

        <div className="bg-rpg-card/95 backdrop-blur-sm border-4 border-rpg-border shadow-pixel p-8 relative">
          <div className="absolute top-2 left-2 w-2 h-2 bg-rpg-border"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-rpg-border"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-rpg-border"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-rpg-border"></div>

          <h2 className="text-xl font-bold text-rpg-gold mb-6 text-center uppercase tracking-wide border-b-2 border-rpg-border pb-4">
            Character Creation
          </h2>
          
          {error && (
            <div className="bg-rpg-danger text-white border-2 border-rpg-border px-4 py-3 mb-4 font-bold text-sm shadow-sm">⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Hero Name</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-field" placeholder="Sir_Lags_Alot" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Owl Post (Email)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="hero@guild.com" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Secret Key</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="••••••" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Confirm Key</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field" placeholder="••••••" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Daily Mana Limit (Minutes)</label>
              <input type="number" name="dailyLimit" value={formData.dailyLimit} onChange={handleChange} className="input-field" min="1" required />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary mt-6">
              {loading ? 'Forging Character...' : 'SIGN CONTRACT'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already part of the guild? <Link to="/login" className="text-rpg-gold hover:underline font-bold">Enter Realm Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;