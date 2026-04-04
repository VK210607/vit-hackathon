Thodar - Healthcare Logistics Platform 
(*Connecting Healthcare, Empowering Lives.*)

Thodar is a centralized web platform designed to streamline the logistics of healthcare donations. It connects Individual Donors, NGOs, and Healthcare Facilities (Hospitals) to ensure that vital resources like blood, medicines, and medical equipment reach those in need efficiently and safely.

 Project Overview:
The platform addresses the fragmentation in healthcare supply chains by providing a unified interface for:
1. Donors to pledge resources with confidence.
2. NGOs to verify, manage, and transport supplies.
3. Hospitals to request critical items and track their delivery in real-time.
It features a "Smart Verification" system (simulating government ID checks) and a robust "Trust Layer" where donations are vetted by NGOs before reaching hospitals, ensuring safety and compliance.

 Key Features:
  *Authentication & Security*:
   1. Role-Based Access Control: Distinct dashboards for Donors, NGOs, and Hospitals.
   2. Mock Government Verification:
    --> Donors: Aadhar ID verification.
    --> Hospitals: HFR (Health Facility Registry) ID verification.
    --> NGOs: NGO Unique ID verification.
   3. Secure Backend: Powered by Supabase Auth and Row Level Security (RLS).
  
  *Donor Ecosystem*:
    1. Smart Eligibility Checks:
     --> Blood: Auto-calculates eligibility based on last donation date (>90 days) and health conditions.
     --> Emergency Mode: High-priority alerts for rare blood types during critical shortages.
    2. Medicine & Equipment: Upload functionality with expiry date checks and condition reporting.
    3. Gamification: "Trust Scores" and "Impact Summaries" to encourage consistent donations.
    
    *NGO Logistics Hub*
     1. Inbound Management: View and approve pending donations within a 5km radius.
     2. Outbound Fulfillment: Receive supply requests from hospitals.
     3. Smart Matching:
      -->Inventory Match: Dispatch items directly from NGO storage.
      -->Direct Link: Connect a pending donor directly to a requesting hospital for faster delivery.
     4. Status Tracking: Real-time updates. 
    
    *Hospital Portal*:
     1. Resource Request: Simple form to request Blood, Medicines, or Equipment.
     2. Priority System: Flag requests as "Critical," "Medium," or "Low.
     3. "Live Tracking: Monitor the status of requested supplies.
     
    *Tech Stack*
     Frontend: React.js (Vite)
     Styling: Tailwind CSS (Glassmorphism UI), Lucide React (Icons)
     Backend: Supabase (PostgreSQL Database, Authentication, Real-time subscriptions)Routing: React Router DOM