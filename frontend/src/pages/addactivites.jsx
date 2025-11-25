import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activitiesAPI } from '../services/api';
import bgMain from '../assets/648115.jpg'; // Background Gua

const AddActivity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    platform: 'Instagram',
    category: 'brainrot',
    duration: '',
    description: '',
    mood: 'neutral',
    date: new Date().toISOString().split('T')[0],
  });
  
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'Facebook', 'Other'];
  const categories = [
    { value: 'brainrot', label: 'Brainrot (Cursed)', color: 'bg-rpg-danger text-white' },
    { value: 'productive', label: 'Productive (XP)', color: 'bg-rpg-success text-white' },
    { value: 'neutral', label: 'Neutral (NPC)', color: 'bg-gray-500 text-white' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File scroll is too heavy (Max 5MB)');
        return;
      }
      setScreenshot(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (screenshot) {
            data.append('screenshot', screenshot);
        }
        await activitiesAPI.create(data);
        navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Quest creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen py-8 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${bgMain})` }}
    >
      <div className="absolute inset-0 bg-rpg-bg/90 z-0"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-up">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rpg-gold mb-2 tracking-widest drop-shadow-md">
            NEW QUEST ENTRY
          </h1>
          <p className="text-rpg-text opacity-80">Be honest, hero. The gods are watching.</p>
        </div>

        <div className="bg-rpg-card border-4 border-rpg-border shadow-pixel p-8 relative">
          <div className="absolute top-2 left-2 w-2 h-2 bg-rpg-border"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-rpg-border"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-rpg-border"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-rpg-border"></div>

          {error && (
            <div className="bg-rpg-danger text-white border-2 border-rpg-border p-3 mb-6 font-bold shadow-pixel">⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Realm (Platform)</label>
              <select name="platform" value={formData.platform} onChange={handleChange} className="input-field cursor-pointer">
                {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-rpg-text mb-3 uppercase">Quest Type</label>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-3 border-2 font-bold transition-all ${
                      formData.category === cat.value
                        ? `${cat.color} border-rpg-border shadow-pixel-active translate-y-1`
                        : 'bg-rpg-bg text-gray-400 border-rpg-border hover:bg-opacity-80'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Duration (Minutes)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="input-field" placeholder="45" min="1" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Quest Details (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="3" placeholder="Describe your battle..." />
            </div>

            <div>
              <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" required />
            </div>

            {/* Upload Bukti */}
            <div>
              <label className="block text-sm font-bold text-rpg-text mb-2 uppercase">Attach Evidence (Optional)</label>
              <div className={`border-4 border-dashed border-rpg-border bg-rpg-bg p-6 text-center cursor-pointer hover:bg-[#353b5c] transition-colors relative ${preview ? 'border-rpg-gold' : ''}`}>
                <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {preview ? (
                  <div className="relative z-10">
                    <img src={preview} alt="Evidence Preview" className="mx-auto max-h-48 border-2 border-rpg-border shadow-pixel" />
                    <p className="text-rpg-gold text-xs mt-2 font-bold uppercase">Click to replace scroll</p>
                  </div>
                ) : (
                  <div className="pointer-events-none">
                    <div className="text-4xl mb-2 animate-bounce">📜</div>
                    <p className="text-rpg-text font-bold uppercase">Drop Screenshot Scroll Here</p>
                    <p className="text-xs text-gray-500 mt-1">Max 5MB (JPG, PNG)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 py-3 bg-rpg-muted text-white border-2 border-rpg-border font-bold hover:bg-gray-600 shadow-pixel active:translate-y-1 transition-all">RETREAT</button>
              <button type="submit" disabled={loading} className="flex-1 btn-primary">{loading ? 'SCRIBING...' : 'COMPLETE LOG'}</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddActivity;