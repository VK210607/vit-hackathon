import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BloodDonation from "./pages/donate/BloodDonation";
import MedicineDonation from "./pages/donate/MedicineDonation";
import EquipmentDonation from "./pages/donate/EquipmentDonation";
import DonateSupplies from "./pages/healthcare/DonateSupplies";
import RequestSupplies from "./pages/healthcare/RequestSupplies";
import DonationApplications from "./pages/ngo/DonationApplications";
import SupplyRequests from "./pages/ngo/SupplyRequests";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/donate/blood" element={<BloodDonation />} />
            <Route path="/donate/medicine" element={<MedicineDonation />} />
            <Route path="/donate/equipment" element={<EquipmentDonation />} />
            <Route path="/healthcare/donate" element={<DonateSupplies />} />
            <Route path="/healthcare/request" element={<RequestSupplies />} />
            <Route path="/ngo/applications" element={<DonationApplications />} />
            <Route path="/ngo/requests" element={<SupplyRequests />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
