import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function ProfileSetup() {
  const nav = useNavigate();
  const { role, setProfile } = useAuth();

  const isInfluencer = role === 'influencer';
  const dest = isInfluencer ? '/influencer/home' : '/budget';

  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [category, setCategory] = useState('');
  const [followers, setFollowers] = useState('');
  const [price, setPrice] = useState('');

  const cats = ['Fitness', 'Food', 'Fashion', 'Travel', 'Beauty', 'Tech'];
  const industries = ['DTC', 'SaaS', 'Fashion', 'Food', 'Beauty', 'Other'];

  const finish = () => {
    setProfile(isInfluencer ? { category, followers, price } : { brandName, industry });
    nav(dest);
  };

  return (
    <div className="flex flex-col min-h-full px-6 pt-14 pb-8">
      <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="mt-12">
        <div className="text-xs uppercase tracking-widest text-white/40">One last step</div>
        <h1 className="mt-2 text-white text-3xl tracking-tight">
          {isInfluencer ? 'Your creator profile' : 'Your brand'}
        </h1>
      </div>

      <div className="mt-8 space-y-5">
        {isInfluencer ? (
          <>
            <div>
              <label className="text-xs uppercase tracking-widest text-white/40">Category</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {cats.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      category === c ? 'bg-white text-black border-white' : 'bg-white/[0.03] text-white/70 border-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <Text label="Followers" value={followers} onChange={setFollowers} placeholder="48000" type="number" />
            <Text label="Price per post ($)" value={price} onChange={setPrice} placeholder="280" type="number" />
          </>
        ) : (
          <>
            <Text label="Brand name" value={brandName} onChange={setBrandName} placeholder="Acme Co." />
            <div>
              <label className="text-xs uppercase tracking-widest text-white/40">Industry</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {industries.map((c) => (
                  <button
                    key={c}
                    onClick={() => setIndustry(c)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      industry === c ? 'bg-white text-black border-white' : 'bg-white/[0.03] text-white/70 border-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1" />

      <button
        onClick={finish}
        className="mt-8 w-full py-3.5 rounded-2xl bg-white text-black flex items-center justify-center gap-2 transition-all"
      >
        Continue <ArrowRight className="w-4 h-4" />
      </button>
      <button onClick={() => nav(dest)} className="mt-3 w-full py-2 text-white/50 text-sm">
        Skip for now
      </button>
    </div>
  );
}

function Text({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-white/40">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-white/30 text-sm"
      />
    </div>
  );
}
