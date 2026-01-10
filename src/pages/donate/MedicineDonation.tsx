import { useState } from 'react';
import { ArrowLeft, Pill, Upload, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TIME_SLOTS = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
];

const MedicineDonation = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<'details' | 'schedule' | 'success'>('details');
  const [loading, setLoading] = useState(false);

  // Form state
  const [medicineName, setMedicineName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Schedule state
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'self_drop'>('pickup');
  const [scheduledDate, setScheduledDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isExpiryValid = () => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiry > today;
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!profile?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('donations').insert({
        donor_id: profile.id,
        donation_type: 'medicine',
        item_name: medicineName,
        quantity: parseInt(quantity),
        expiry_date: expiryDate,
        delivery_type: deliveryType,
        scheduled_date: scheduledDate,
        time_slot: timeSlot,
        notes,
        location: profile.location,
        status: 'pending',
      });

      if (error) throw error;

      setStep('success');
      toast({
        title: 'Donation Submitted',
        description: 'Your medicine donation has been submitted successfully!',
      });
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit donation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = medicineName && quantity && isExpiryValid();
  const canSubmit = scheduledDate && timeSlot;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-bold">Medicine Donation</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl page-transition">
        {step === 'details' && (
          <Card className="elevated-card">
            <CardHeader>
              <CardTitle className="font-serif">Medicine Details</CardTitle>
              <CardDescription>Provide information about the medicine you want to donate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Medicine Image</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img src={imagePreview} alt="Medicine" className="max-h-48 mx-auto rounded-lg" />
                      <Button variant="outline" size="sm" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload medicine image</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Medicine Name */}
              <div className="space-y-2">
                <Label>Medicine Name *</Label>
                <Input
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="Enter medicine name"
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Number of units"
                  min={1}
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label>Expiry Date *</Label>
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                {expiryDate && !isExpiryValid() && (
                  <p className="text-destructive text-sm">Medicine must not be expired</p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information about the medicine"
                />
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={() => setStep('schedule')}
                disabled={!canProceed}
              >
                Continue to Schedule
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'schedule' && (
          <Card className="elevated-card">
            <CardHeader>
              <CardTitle className="font-serif">Schedule Donation</CardTitle>
              <CardDescription>Choose how and when you'd like to donate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Delivery Type */}
              <div className="space-y-3">
                <Label>Delivery Method</Label>
                <RadioGroup value={deliveryType} onValueChange={(v) => setDeliveryType(v as 'pickup' | 'self_drop')}>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="font-medium">Pickup</div>
                      <div className="text-sm text-muted-foreground">We'll collect from your location</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="self_drop" id="self_drop" />
                    <Label htmlFor="self_drop" className="flex-1 cursor-pointer">
                      <div className="font-medium">Self Drop</div>
                      <div className="text-sm text-muted-foreground">Drop at nearest collection center</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Select Date *
                </Label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                />
                <p className="text-sm text-muted-foreground">Choose a date within the next 7 days</p>
              </div>

              {/* Time Slot */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Select Time Slot *
                </Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('details')}>
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleSubmit}
                  disabled={!canSubmit || loading}
                >
                  {loading ? 'Submitting...' : 'Submit Donation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'success' && (
          <Card className="elevated-card border-success">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <Pill className="h-8 w-8 text-success" />
              </div>
              <h2 className="font-serif text-2xl font-bold mb-2">Donation Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your generosity. You'll be notified once your donation is approved.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MedicineDonation;
