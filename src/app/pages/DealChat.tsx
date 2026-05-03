import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useNavigate, useParams } from 'react-router';
import { influencers } from '../data/influencers';
import { inr } from '../utils/money';
import { calculatePrice, formatDeliverablesSummary, type DeliverableKey } from '../utils/pricing';

export function DealChat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const deliverables: DeliverableKey[] = ['reel'];
  const finalOffer = calculatePrice(influencers[0]?.price ?? 0, deliverables);
  const deliverableSummary = formatDeliverablesSummary(deliverables);

  const deal = {
    brand: 'EcoThreads',
    influencer: '@sarahstyle',
    deliverable: deliverableSummary,
    finalOffer: inr(finalOffer),
    deadline: 'Apr 30, 2026',
    status: 'negotiating',
  };

  const messages = [
    {
      id: '1',
      sender: 'brand',
      text: "Hi! We'd love to collaborate with you for our summer collection launch.",
      time: '2:30 PM',
    },
    {
      id: '2',
      sender: 'influencer',
      text: "Thanks for reaching out! I'd be happy to discuss this. What deliverables did you have in mind?",
      time: '2:45 PM',
    },
    {
      id: '3',
      sender: 'brand',
      text: "We're looking for an Instagram Reel showcasing our sustainable fabrics.",
      time: '3:00 PM',
    },
    {
      id: '4',
      sender: 'influencer',
      text: "That works for me! Could we extend the deadline to May 5th? I have a few shoots scheduled.",
      time: '3:15 PM',
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-foreground">{deal.brand}</h2>
            <p className="text-xs text-muted-foreground">{deal.deliverable}</p>
          </div>
        </div>
      </header>

      {/* Deal Summary */}
      <div className="px-6 py-4 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-md mx-auto">
          <Card glass>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Final Offer</div>
                <div className="text-foreground">{deal.finalOffer}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Deadline</div>
                <div className="text-foreground">{deal.deadline}</div>
              </div>
              <div className="col-span-2">
                <div className="text-muted-foreground mb-1">Deliverable</div>
                <div className="text-foreground">{deal.deliverable}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'influencer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  msg.sender === 'influencer'
                    ? 'bg-white text-black'
                    : 'bg-secondary text-foreground'
                } rounded-2xl px-4 py-3`}
              >
                <p className="text-sm">{msg.text}</p>
                <div
                  className={`text-xs mt-1 ${
                    msg.sender === 'influencer' ? 'text-black/60' : 'text-muted-foreground'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deal Confirmation */}
      <div className="px-6 py-4 border-t border-border bg-gradient-to-t from-white/5 to-transparent">
        <div className="max-w-md mx-auto space-y-3">
          <Card glass>
            <h3 className="text-foreground mb-3">Finalize Deal</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Final Offer</span>
                <span className="text-foreground">{deal.finalOffer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deliverables</span>
                <span className="text-foreground">{deal.deliverable}</span>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => navigate(`/payment/${id}`)}
            >
              Confirm Deal
            </Button>
          </Card>
        </div>
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-border bg-background">
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-secondary border border-border rounded-full px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            onClick={handleSend}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
