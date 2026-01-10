import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Check, X, Package, Pill, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Donation = Database['public']['Tables']['donations']['Row'];
type DonationStatus = Database['public']['Enums']['donation_status'];

const DonationApplications = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<(Donation & { donor_name?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          profiles:donor_id (full_name, facility_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const donationsWithNames = data?.map((d: any) => ({
        ...d,
        donor_name: d.profiles?.full_name || d.profiles?.facility_name || 'Unknown',
      })) || [];

      setDonations(donationsWithNames);
    } catch (error: any) {
      toast.error('Failed to load donations');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: DonationStatus) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Donation ${status}`);
      fetchDonations();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blood':
        return <Droplet className="h-4 w-4" />;
      case 'medicine':
        return <Pill className="h-4 w-4" />;
      case 'equipment':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'approved':
        return 'bg-green-500/10 text-green-600';
      case 'collected':
        return 'bg-blue-500/10 text-blue-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-bold">Thodar</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 page-transition">
        <h1 className="font-serif text-3xl font-bold mb-2">Donation Applications</h1>
        <p className="text-muted-foreground mb-8">Review and approve incoming donations</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : donations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No donation applications yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <Card key={donation.id} className="elevated-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(donation.donation_type)}
                      <CardTitle className="text-lg capitalize">{donation.donation_type} Donation</CardTitle>
                    </div>
                    <Badge className={getStatusColor(donation.status)}>{donation.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Donor:</span>
                      <span>{donation.donor_name}</span>
                    </div>
                    {donation.item_name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Item:</span>
                        <span>{donation.item_name}</span>
                      </div>
                    )}
                    {donation.quantity && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span>{donation.quantity}</span>
                      </div>
                    )}
                    {donation.blood_type && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Blood Type:</span>
                        <span>{donation.blood_type}</span>
                      </div>
                    )}
                    {donation.expiry_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expiry:</span>
                        <span>{new Date(donation.expiry_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {donation.scheduled_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Scheduled:</span>
                        <span>{new Date(donation.scheduled_date).toLocaleDateString()} {donation.time_slot}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery:</span>
                      <span className="capitalize">{donation.delivery_type?.replace('_', ' ') || 'N/A'}</span>
                    </div>
                  </div>

                  {donation.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1"
                        onClick={() => updateStatus(donation.id, 'approved')}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => updateStatus(donation.id, 'collected')}
                      >
                        Mark Collected
                      </Button>
                    </div>
                  )}

                  {donation.status === 'approved' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1"
                        onClick={() => updateStatus(donation.id, 'collected')}
                      >
                        Mark Collected
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => updateStatus(donation.id, 'dispatched')}
                      >
                        Dispatch
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DonationApplications;
