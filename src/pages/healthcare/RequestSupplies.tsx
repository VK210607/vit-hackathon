import { useState } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type RequestType = Database['public']['Enums']['donation_type'];
type PriorityLevel = Database['public']['Enums']['priority_level'];
type BloodType = Database['public']['Enums']['blood_type'];

const RequestSupplies = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    requestType: '' as RequestType | '',
    itemName: '',
    quantity: 1,
    priority: 'medium' as PriorityLevel,
    bloodType: '' as BloodType | '',
    location: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.requestType || !formData.itemName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        toast.error('Profile not found');
        return;
      }

      const { error } = await supabase.from('requests').insert({
        requester_id: profile.id,
        request_type: formData.requestType as RequestType,
        item_name: formData.itemName,
        quantity: formData.quantity,
        priority: formData.priority,
        blood_type: formData.requestType === 'blood' ? (formData.bloodType as BloodType) : null,
        location: formData.location || null,
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast.success('Request submitted successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
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
        <h1 className="font-serif text-3xl font-bold mb-2">Request Supplies</h1>
        <p className="text-muted-foreground mb-8">Submit a request for needed resources</p>

        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>New Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="requestType">Request Type *</Label>
                <Select
                  value={formData.requestType}
                  onValueChange={(value) => setFormData({ ...formData, requestType: value as RequestType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood">Blood</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.requestType === 'blood' && (
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type *</Label>
                  <Select
                    value={formData.bloodType}
                    onValueChange={(value) => setFormData({ ...formData, bloodType: value as BloodType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="itemName">
                  {formData.requestType === 'blood' ? 'Purpose / Patient Info' : 'Item Name'} *
                </Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder={formData.requestType === 'blood' ? 'e.g., Surgery for patient' : 'e.g., Paracetamol 500mg'}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (units) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as PriorityLevel })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Delivery Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Ward 3, Building A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RequestSupplies;
