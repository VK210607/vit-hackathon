import { Heart, FileCheck, ClipboardList, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Profile {
  ngo_name?: string;
  ngo_coordinator?: string;
}

const NgoDashboard = ({ profile }: { profile: Profile }) => {
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
            <span className="text-sm text-muted-foreground">{profile.ngo_name || 'NGO'}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 page-transition">
        <h1 className="font-serif text-3xl font-bold mb-2">NGO Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage donations and coordinate resource distribution</p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
          <Card className="elevated-card cursor-pointer group">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Donation Applications</CardTitle>
              <CardDescription>Review and approve incoming donations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Applications</Button>
            </CardContent>
          </Card>

          <Card className="elevated-card cursor-pointer group">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ClipboardList className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle>Supply Requests</CardTitle>
              <CardDescription>Manage requests from healthcare facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full accent-gradient">View Requests</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NgoDashboard;
