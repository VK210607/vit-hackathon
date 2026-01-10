import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'individual' | 'healthcare_facility' | 'ngo';
type Gender = 'male' | 'female' | 'other';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Individual fields
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [aadhar, setAadhar] = useState('');
  const [location, setLocation] = useState('');
  
  // Healthcare facility fields
  const [facilityName, setFacilityName] = useState('');
  const [hfrId, setHfrId] = useState('');
  const [hfContactNumber, setHfContactNumber] = useState('');
  const [hfLocation, setHfLocation] = useState('');
  
  // NGO fields
  const [ngoName, setNgoName] = useState('');
  const [ngoId, setNgoId] = useState('');
  const [ngoCoordinator, setNgoCoordinator] = useState('');
  const [ngoContactNumber, setNgoContactNumber] = useState('');
  const [ngoLocation, setNgoLocation] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep(2);
    }
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    let profileData: Record<string, unknown> = { role };

    if (role === 'individual') {
      profileData = {
        ...profileData,
        full_name: fullName,
        age: parseInt(age),
        phone_number: phoneNumber,
        gender,
        aadhar,
        location,
      };
    } else if (role === 'healthcare_facility') {
      profileData = {
        ...profileData,
        facility_name: facilityName,
        hfr_id: hfrId,
        contact_number: hfContactNumber,
        location: hfLocation,
      };
    } else if (role === 'ngo') {
      profileData = {
        ...profileData,
        ngo_name: ngoName,
        ngo_id: ngoId,
        ngo_coordinator: ngoCoordinator,
        contact_number: ngoContactNumber,
        location: ngoLocation,
      };
    }

    const { error } = await signUp(email, password, profileData);

    setLoading(false);

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration successful!",
        description: "You can now sign in to your account.",
      });
      navigate('/login');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`w-3 h-3 rounded-full transition-all ${
            s === step
              ? 'bg-primary w-8'
              : s < step
              ? 'bg-primary'
              : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );

  const renderRoleCard = (roleType: UserRole, title: string, description: string, icon: React.ReactNode) => (
    <button
      onClick={() => handleRoleSelect(roleType)}
      className="elevated-card p-6 text-left hover:border-primary/50 transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-serif font-bold">Thodar</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join our community of care</p>
        </div>

        {renderStepIndicator()}

        {/* Step 1: Email */}
        {step === 1 && (
          <Card className="glass-card animate-fade-up">
            <form onSubmit={handleEmailSubmit}>
              <CardHeader>
                <CardTitle>What's your email?</CardTitle>
                <CardDescription>We'll use this to create your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Step 2: Role Selection */}
        {step === 2 && (
          <div className="animate-fade-up">
            <Card className="glass-card mb-4">
              <CardHeader>
                <CardTitle>Choose your role</CardTitle>
                <CardDescription>How will you be using Thodar?</CardDescription>
              </CardHeader>
            </Card>
            
            <div className="space-y-4">
              {renderRoleCard(
                'individual',
                'Individual Donor',
                'Donate blood, medicine, or equipment to help those in need',
                <Heart className="h-6 w-6" />
              )}
              {renderRoleCard(
                'healthcare_facility',
                'Healthcare Facility',
                'Hospitals, clinics, and medical centers that can donate or request supplies',
                <CheckCircle className="h-6 w-6" />
              )}
              {renderRoleCard(
                'ngo',
                'NGO / Organization',
                'Coordinate donations and manage resource distribution',
                <CheckCircle className="h-6 w-6" />
              )}
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        )}

        {/* Step 3: Role-specific fields */}
        {step === 3 && (
          <Card className="glass-card animate-fade-up">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Complete your profile</CardTitle>
                <CardDescription>
                  {role === 'individual' && 'Tell us about yourself'}
                  {role === 'healthcare_facility' && 'Healthcare facility details'}
                  {role === 'ngo' && 'Organization details'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Individual Fields */}
                {role === 'individual' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          min="18"
                          max="120"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhar">Aadhar Number</Label>
                      <Input
                        id="aadhar"
                        value={aadhar}
                        onChange={(e) => setAadhar(e.target.value)}
                        maxLength={12}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, State"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Healthcare Facility Fields */}
                {role === 'healthcare_facility' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="facilityName">Facility Name</Label>
                      <Input
                        id="facilityName"
                        value={facilityName}
                        onChange={(e) => setFacilityName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hfrId">HFR ID</Label>
                      <Input
                        id="hfrId"
                        value={hfrId}
                        onChange={(e) => setHfrId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hfLocation">Location</Label>
                      <Input
                        id="hfLocation"
                        value={hfLocation}
                        onChange={(e) => setHfLocation(e.target.value)}
                        placeholder="City, State"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hfContactNumber">Contact Number</Label>
                      <Input
                        id="hfContactNumber"
                        type="tel"
                        value={hfContactNumber}
                        onChange={(e) => setHfContactNumber(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {/* NGO Fields */}
                {role === 'ngo' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="ngoName">NGO Name</Label>
                      <Input
                        id="ngoName"
                        value={ngoName}
                        onChange={(e) => setNgoName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ngoId">NGO ID</Label>
                      <Input
                        id="ngoId"
                        value={ngoId}
                        onChange={(e) => setNgoId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ngoCoordinator">Coordinator Name</Label>
                      <Input
                        id="ngoCoordinator"
                        value={ngoCoordinator}
                        onChange={(e) => setNgoCoordinator(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ngoLocation">Location</Label>
                      <Input
                        id="ngoLocation"
                        value={ngoLocation}
                        onChange={(e) => setNgoLocation(e.target.value)}
                        placeholder="City, State"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ngoContactNumber">Contact Number</Label>
                      <Input
                        id="ngoContactNumber"
                        type="tel"
                        value={ngoContactNumber}
                        onChange={(e) => setNgoContactNumber(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Password Fields */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Register;
