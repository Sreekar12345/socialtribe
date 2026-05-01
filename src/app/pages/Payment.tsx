import { useState } from 'react';
import { ArrowLeft, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router';

export function Payment() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  const deal = {
    brand: 'EcoThreads',
    influencer: '@sarahstyle',
    deliverable: 'Instagram Reel',
    influencerPayment: 500,
    platformFee: 50,
    total: 550
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setComplete(true);
      setTimeout(() => {
        navigate('/brand/dashboard');
      }, 2000);
    }, 2000);
  };

  if (complete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your collaboration with {deal.influencer} is now confirmed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-foreground">Payment</h2>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Deal Summary */}
          <Card glass>
            <h3 className="text-foreground mb-4">Deal Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Brand</span>
                <span className="text-foreground">{deal.brand}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Influencer</span>
                <span className="text-foreground">{deal.influencer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deliverable</span>
                <span className="text-foreground">{deal.deliverable}</span>
              </div>
            </div>
          </Card>

          {/* Payment Breakdown */}
          <Card glass>
            <h3 className="text-foreground mb-4">Payment Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Influencer Payment</span>
                <span className="text-foreground">${deal.influencerPayment}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (10%)</span>
                <span className="text-foreground">${deal.platformFee}</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between">
                <span className="text-foreground">Total Amount</span>
                <span className="text-foreground text-xl">${deal.total}</span>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <form onSubmit={handlePayment} className="space-y-6">
            <Card glass className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-foreground" />
                <h3 className="text-foreground">Payment Method</h3>
              </div>
              <Input
                label="Card Number"
                placeholder="4242 4242 4242 4242"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry"
                  placeholder="MM/YY"
                  required
                />
                <Input
                  label="CVC"
                  placeholder="123"
                  required
                />
              </div>
              <Input
                label="Cardholder Name"
                placeholder="John Doe"
                required
              />
            </Card>

            {/* Security Notice */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">
                Your payment information is encrypted and secure. Funds will be held in escrow until the influencer delivers the agreed content.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={processing}
            >
              {processing ? 'Processing...' : `Pay $${deal.total}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
