import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Check, X, AlertTriangle, Package, Pill, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Request = Database['public']['Tables']['requests']['Row'];
type RequestStatus = Database['public']['Enums']['request_status'];

const SupplyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<(Request & { requester_name?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          profiles:requester_id (full_name, facility_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const requestsWithNames = data?.map((r: any) => ({
        ...r,
        requester_name: r.profiles?.facility_name || r.profiles?.full_name || 'Unknown',
      })) || [];

      setRequests(requestsWithNames);
    } catch (error: any) {
      toast.error('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: RequestStatus) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Request ${status}`);
      fetchRequests();
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/10 text-red-600';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'low':
        return 'bg-green-500/10 text-green-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'approved':
        return 'bg-green-500/10 text-green-600';
      case 'rejected':
        return 'bg-red-500/10 text-red-600';
      case 'dispatched':
        return 'bg-blue-500/10 text-blue-600';
      case 'delivered':
        return 'bg-primary/10 text-primary';
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
        <h1 className="font-serif text-3xl font-bold mb-2">Supply Requests</h1>
        <p className="text-muted-foreground mb-8">Manage requests from healthcare facilities</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No supply requests yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="elevated-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(request.request_type)}
                      <CardTitle className="text-lg">{request.item_name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {request.priority}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requester:</span>
                      <span>{request.requester_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{request.request_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span>{request.quantity} units</span>
                    </div>
                    {request.blood_type && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Blood Type:</span>
                        <span>{request.blood_type}</span>
                      </div>
                    )}
                    {request.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{request.location}</span>
                      </div>
                    )}
                    {request.notes && (
                      <div className="mt-2 p-2 bg-muted rounded-md">
                        <span className="text-muted-foreground text-xs">Notes:</span>
                        <p className="text-sm">{request.notes}</p>
                      </div>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1"
                        onClick={() => updateStatus(request.id, 'approved')}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => updateStatus(request.id, 'rejected')}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {request.status === 'approved' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1"
                        onClick={() => updateStatus(request.id, 'dispatched')}
                      >
                        Mark Dispatched
                      </Button>
                    </div>
                  )}

                  {request.status === 'dispatched' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1"
                        onClick={() => updateStatus(request.id, 'delivered')}
                      >
                        Mark Delivered
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

export default SupplyRequests;
