import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import { useAuth, Role } from '../../context/AuthContext';

export function RoleSelect() {
  const nav = useNavigate();
  const { setRole } = useAuth();

  const pick = (r: Role) => {
    setRole(r);
    nav('/auth');
  };

  return (
    <div className="flex flex-col min-h-full px-6 pt-14 pb-8">
      <button onClick={() => nav('/')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="mt-16">
        <h1 className="text-white text-3xl tracking-tight">Who are you?</h1>
        <p className="mt-2 text-white/50">Pick one. You can switch later.</p>
      </div>

      <div className="mt-10 space-y-3">
        <RoleCard
          icon={Briefcase}
          title="I'm a Brand"
          desc="Hire verified creators in minutes."
          onClick={() => pick('brand')}
        />
        <RoleCard
          icon={Sparkles}
          title="I'm an Influencer"
          desc="Get paid for content you already make."
          onClick={() => pick('influencer')}
        />
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, desc, onClick }: { icon: any; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-5 bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all flex items-center gap-4"
    >
      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="text-white">{title}</div>
        <div className="text-xs text-white/50 mt-0.5">{desc}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-white/40" />
    </button>
  );
}
