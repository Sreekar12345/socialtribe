import { DollarSign, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router';

export function InfluencerDashboard() {
  const navigate = useNavigate();

  const stats = {
    totalEarnings: '$3,240',
    pendingEarnings: '$850',
    activeGigs: 2,
    completedGigs: 8
  };

  const incomingRequests = [
    {
      id: '1',
      brand: 'EcoThreads',
      deliverable: 'Instagram Reel',
      budget: '$500',
      deadline: 'Apr 30, 2026',
      description: 'Showcase our new sustainable summer collection'
    },
    {
      id: '2',
      brand: 'FitGear Pro',
      deliverable: '2 Posts + Story',
      budget: '$650',
      deadline: 'May 5, 2026',
      description: 'Promote our new workout equipment line'
    }
  ];

  const activeCollaborations = [
    {
      id: '3',
      brand: 'Urban Minimalist',
      deliverable: '3 Stories',
      deadline: 'Apr 25, 2026',
      status: 'In Progress',
      payment: '$450'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-foreground mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">@sarahstyle</p>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card glass>
              <DollarSign className="w-5 h-5 text-green-500 mb-2" />
              <div className="text-2xl text-foreground mb-1">{stats.totalEarnings}</div>
              <div className="text-xs text-muted-foreground">Total Earnings</div>
            </Card>
            <Card glass>
              <Clock className="w-5 h-5 text-yellow-500 mb-2" />
              <div className="text-2xl text-foreground mb-1">{stats.pendingEarnings}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </Card>
            <Card glass>
              <TrendingUp className="w-5 h-5 text-blue-500 mb-2" />
              <div className="text-2xl text-foreground mb-1">{stats.activeGigs}</div>
              <div className="text-xs text-muted-foreground">Active Gigs</div>
            </Card>
            <Card glass>
              <CheckCircle2 className="w-5 h-5 text-purple-500 mb-2" />
              <div className="text-2xl text-foreground mb-1">{stats.completedGigs}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </Card>
          </div>

          {/* Incoming Requests */}
          <div>
            <h2 className="text-foreground mb-4">Incoming Requests</h2>
            <div className="space-y-3">
              {incomingRequests.map(request => (
                <Card key={request.id} glass>
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-foreground mb-1">{request.brand}</h3>
                        <p className="text-sm text-muted-foreground">{request.deliverable}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-foreground">{request.budget}</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Due: {request.deadline}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => navigate(`/deal/${request.id}`)}
                    >
                      Accept
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      Decline
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Active Collaborations */}
          <div>
            <h2 className="text-foreground mb-4">Active Collaborations</h2>
            <div className="space-y-3">
              {activeCollaborations.map(collab => (
                <Card key={collab.id} glass>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-foreground mb-1">{collab.brand}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{collab.deliverable}</p>
                      <div className="inline-block px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-500">
                        {collab.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-foreground mb-1">{collab.payment}</div>
                      <div className="text-xs text-muted-foreground">Due: {collab.deadline}</div>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate(`/deal/${collab.id}`)}
                  >
                    View Details
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Earnings Summary */}
          <Card glass>
            <h3 className="text-foreground mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gross Earnings</span>
                <span className="text-foreground">$1,200</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (10%)</span>
                <span className="text-red-400">-$120</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between">
                <span className="text-foreground">Net Earnings</span>
                <span className="text-foreground">$1,080</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
