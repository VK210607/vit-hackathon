import { Heart, Pill, Stethoscope, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Profile {
  full_name?: string;
  location?: string;
}

const DonorDashboard = ({ profile }: { profile: Profile }) => {
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
            <span className="text-sm text-muted-foreground">Welcome, {profile.full_name || 'Donor'}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 page-transition">
        <h1 className="font-serif text-3xl font-bold mb-2">Donor Dashboard</h1>
        <p className="text-muted-foreground mb-8">Choose how you'd like to make a difference today</p>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="elevated-card cursor-pointer group" onClick={() => navigate('/donate/blood')}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle>Blood Donation</CardTitle>
              <CardDescription>Check eligibility and register for nearby camps</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigate('/donate/blood'); }}>Start Eligibility Check</Button>
            </CardContent>
          </Card>

          <Card className="elevated-card cursor-pointer group" onClick={() => navigate('/donate/medicine')}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Pill className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Medicine Donation</CardTitle>
              <CardDescription>Donate unused medicines to those in need</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate('/donate/medicine'); }}>Donate Medicine</Button>
            </CardContent>
          </Card>

          <Card className="elevated-card cursor-pointer group" onClick={() => navigate('/donate/equipment')}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Stethoscope className="h-6 w-6 text-success-foreground" />
              </div>
              <CardTitle>Medical Equipment</CardTitle>
              <CardDescription>Donate medical devices and equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate('/donate/equipment'); }}>Donate Equipment</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;
