import { Heart, Package, Send, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Profile {
  facility_name?: string;
  location?: string;
}

const HealthcareDashboard = ({ profile }: { profile: Profile }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-bold">Thodar</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{profile.facility_name || 'Healthcare Facility'}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 page-transition">
        <h1 className="font-serif text-3xl font-bold mb-2">Facility Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage donations and resource requests</p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
          <Card className="elevated-card cursor-pointer group" onClick={() => navigate('/healthcare/donate')}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Donate Supplies</CardTitle>
              <CardDescription>Donate surplus medicine or equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Make a Donation</Button>
            </CardContent>
          </Card>

          <Card className="elevated-card cursor-pointer group" onClick={() => navigate('/healthcare/request')}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Send className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle>Request Supplies</CardTitle>
              <CardDescription>Submit a request for needed resources</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full accent-gradient">Submit Request</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HealthcareDashboard;
