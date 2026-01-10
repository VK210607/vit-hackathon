import { useState } from 'react';
import { Heart, ArrowLeft, Pill, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const DonateSupplies = () => {
  const navigate = useNavigate();

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
        <h1 className="font-serif text-3xl font-bold mb-2">Donate Supplies</h1>
        <p className="text-muted-foreground mb-8">Choose what you'd like to donate</p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
          <Card 
            className="elevated-card cursor-pointer group" 
            onClick={() => navigate('/donate/medicine')}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Pill className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Medicine</CardTitle>
              <CardDescription>Donate surplus medicines</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Donate Medicine</Button>
            </CardContent>
          </Card>

          <Card 
            className="elevated-card cursor-pointer group" 
            onClick={() => navigate('/donate/equipment')}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Stethoscope className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle>Medical Equipment</CardTitle>
              <CardDescription>Donate medical equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full accent-gradient">Donate Equipment</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DonateSupplies;
