import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DonorDashboard from '@/components/dashboards/DonorDashboard';
import HealthcareDashboard from '@/components/dashboards/HealthcareDashboard';
import NgoDashboard from '@/components/dashboards/NgoDashboard';

const Dashboard = () => {
  const { profile, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  switch (profile.role) {
    case 'individual':
      return <DonorDashboard profile={profile} />;
    case 'healthcare_facility':
      return <HealthcareDashboard profile={profile} />;
    case 'ngo':
      return <NgoDashboard profile={profile} />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Unknown role. Please contact support.</p>
        </div>
      );
  }
};

export default Dashboard;
