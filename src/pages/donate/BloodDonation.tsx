import { useState } from 'react';
import { ArrowLeft, Heart, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

const BloodDonation = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isFemale = profile?.gender === 'female';

  const [step, setStep] = useState<'eligibility' | 'result' | 'camps'>('eligibility');
  const [isEligible, setIsEligible] = useState(false);

  // Form state
  const [bloodType, setBloodType] = useState('');
  const [weight, setWeight] = useState('');
  const [medications, setMedications] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  
  // Toggle states
  const [recentIllness, setRecentIllness] = useState(false);
  const [isPregnant, setIsPregnant] = useState(false);
  const [hasRecentTattoo, setHasRecentTattoo] = useState(false);
  const [isDiabetic, setIsDiabetic] = useState(false);
  const [consumedAlcohol, setConsumedAlcohol] = useState(false);
  const [onPeriods, setOnPeriods] = useState(false);

  const getDaysSinceLastDonation = () => {
    if (!lastDonationDate) return Infinity;
    const lastDate = new Date(lastDonationDate);
    const today = new Date();
    const diffTime = today.getTime() - lastDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysUntilNextDonation = () => {
    const daysSince = getDaysSinceLastDonation();
    return Math.max(0, 90 - daysSince);
  };

  const checkEligibility = () => {
    const weightNum = parseInt(weight);
    const daysSinceDonation = getDaysSinceLastDonation();

    // Check all ineligibility conditions
    const ineligibleReasons = [];

    if (weightNum < 50) {
      ineligibleReasons.push('Weight must be at least 50 kg');
    }
    if (daysSinceDonation < 90) {
      ineligibleReasons.push(`Must wait ${90 - daysSinceDonation} more days since last donation`);
    }
    if (recentIllness) {
      ineligibleReasons.push('Recent illness in last 2 weeks');
    }
    if (isFemale && isPregnant) {
      ineligibleReasons.push('Currently pregnant');
    }
    if (hasRecentTattoo) {
      ineligibleReasons.push('Tattoo or piercing in last 6 months');
    }
    if (isDiabetic) {
      ineligibleReasons.push('Diabetic condition');
    }
    if (consumedAlcohol) {
      ineligibleReasons.push('Consumed alcohol in last 24 hours');
    }
    if (isFemale && onPeriods) {
      ineligibleReasons.push('Currently on periods');
    }

    const eligible = ineligibleReasons.length === 0;
    setIsEligible(eligible);
    setStep('result');
  };

  const canSubmit = bloodType && weight && parseInt(weight) >= 50;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-bold">Blood Donation</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl page-transition">
        {step === 'eligibility' && (
          <Card className="elevated-card">
            <CardHeader>
              <CardTitle className="font-serif">Eligibility Check</CardTitle>
              <CardDescription>Please answer these questions to check your eligibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Blood Type */}
              <div className="space-y-2">
                <Label>Blood Type *</Label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label>Weight (kg) * <span className="text-muted-foreground text-sm">(minimum 50 kg)</span></Label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter your weight"
                  min={0}
                />
                {weight && parseInt(weight) < 50 && (
                  <p className="text-destructive text-sm">Weight must be at least 50 kg to donate blood</p>
                )}
              </div>

              {/* Medications */}
              <div className="space-y-2">
                <Label>Current Medications</Label>
                <Input
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder="List any medications you're taking"
                />
              </div>

              {/* Last Donation Date */}
              <div className="space-y-2">
                <Label>Last Donation Date</Label>
                <Input
                  type="date"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                {lastDonationDate && getDaysSinceLastDonation() < 90 && (
                  <div className="bg-warning/20 border border-warning rounded-lg p-3 mt-2">
                    <p className="text-sm font-medium text-warning">
                      ⏰ {getDaysUntilNextDonation()} days remaining until your next eligible donation
                    </p>
                  </div>
                )}
              </div>

              {/* Health Toggle Questions */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Health Questions</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="illness" className="cursor-pointer">Any recent illness in the last 2 weeks?</Label>
                  <Switch id="illness" checked={recentIllness} onCheckedChange={setRecentIllness} />
                </div>

                {isFemale && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pregnant" className="cursor-pointer">Are you currently pregnant?</Label>
                    <Switch id="pregnant" checked={isPregnant} onCheckedChange={setIsPregnant} />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="tattoo" className="cursor-pointer">Tattoo or piercing in the last 6 months?</Label>
                  <Switch id="tattoo" checked={hasRecentTattoo} onCheckedChange={setHasRecentTattoo} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="diabetic" className="cursor-pointer">Are you diabetic?</Label>
                  <Switch id="diabetic" checked={isDiabetic} onCheckedChange={setIsDiabetic} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="alcohol" className="cursor-pointer">Consumed alcohol in the last 24 hours?</Label>
                  <Switch id="alcohol" checked={consumedAlcohol} onCheckedChange={setConsumedAlcohol} />
                </div>

                {isFemale && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor="periods" className="cursor-pointer">Are you currently on your periods?</Label>
                    <Switch id="periods" checked={onPeriods} onCheckedChange={setOnPeriods} />
                  </div>
                )}
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={checkEligibility}
                disabled={!canSubmit}
              >
                Check Eligibility
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'result' && (
          <Card className={`elevated-card ${isEligible ? 'border-success' : 'border-destructive'}`}>
            <CardContent className="pt-8 text-center">
              {isEligible ? (
                <>
                  <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                  <h2 className="font-serif text-2xl font-bold mb-2">You're Eligible!</h2>
                  <p className="text-muted-foreground mb-6">You can donate blood and save lives. Find a camp near you.</p>
                  <Button size="lg" onClick={() => setStep('camps')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Find Blood Camps
                  </Button>
                </>
              ) : (
                <>
                  <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                  <h2 className="font-serif text-2xl font-bold mb-2">Not Eligible</h2>
                  <p className="text-muted-foreground mb-6">
                    Unfortunately, you're not eligible to donate blood at this time. 
                    Please try again when your circumstances change.
                  </p>
                  <Button variant="outline" onClick={() => setStep('eligibility')}>
                    Review Answers
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {step === 'camps' && (
          <div className="space-y-6">
            <Card className="elevated-card">
              <CardHeader>
                <CardTitle className="font-serif">Blood Donation Camps</CardTitle>
                <CardDescription>Find and register for blood donation camps near {profile?.location || 'you'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  No active camps found in your area. Check back later!
                </p>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BloodDonation;
