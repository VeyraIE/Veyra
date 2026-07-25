"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  MapPin,
  Shield,
  Camera,
  Calendar,
  CreditCard,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const steps = [
  { id: 1, title: "Business Info", icon: Building2 },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Verification", icon: Shield },
  { id: 4, title: "Photos", icon: Camera },
  { id: 5, title: "Schedule", icon: Calendar },
  { id: 6, title: "Payment", icon: CreditCard },
];

export default function ProviderOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    county: "",
    eircode: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const businessTypes = [
    "Sports Club",
    "Fitness Studio",
    "Dance School",
    "Swimming School",
    "Martial Arts",
    "Music School",
    "Art Studio",
    "Tutoring Center",
    "Summer Camp",
    "Outdoor Activities",
    "Wellness Center",
    "Other"
  ];

  const counties = [
    "Dublin", "Cork", "Galway", "Limerick", "Waterford",
    "Kerry", "Clare", "Wicklow", "Kildare", "Meath",
    "Louth", "Wexford", "Donegal", "Mayo", "Tipperary",
    "Kilkenny", "Sligo", "Carlow", "Cavan", "Laois",
    "Leitrim", "Longford", "Monaghan", "Offaly", "Roscommon",
    "Westmeath", "Antrim", "Armagh", "Derry", "Down", "Fermanagh", "Tyrone"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-primary/10 text-primary border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Provider Onboarding
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                List Your Activity on Activio
              </h1>
              <p className="text-muted-foreground">
                Join thousands of providers reaching families across Ireland
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          currentStep > step.id
                            ? 'bg-primary text-primary-foreground'
                            : currentStep === step.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <step.icon className="h-5 w-5" />
                        )}
                      </div>
                      <span className={`text-xs mt-2 hidden md:block ${
                        currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div 
                        className={`h-0.5 w-8 md:w-16 mx-2 ${
                          currentStep > step.id ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              {/* Step 1: Business Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Tell us about your business
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Basic information about your activity or organization
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Business Name *
                      </label>
                      <Input
                        placeholder="e.g., Dublin Swimming Academy"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Business Type *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {businessTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setFormData({ ...formData, businessType: type })}
                            className={`p-3 rounded-xl border text-sm transition-colors ${
                              formData.businessType === type
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Tell families about your activities, experience, and what makes you special..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <Input
                          placeholder="+353 1 234 5678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          placeholder="info@yourbusiness.ie"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Website (optional)
                      </label>
                      <Input
                        placeholder="https://www.yourbusiness.ie"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Where are you located?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Help families find you with accurate location details
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Street Address *
                      </label>
                      <Input
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          County *
                        </label>
                        <select
                          value={formData.county}
                          onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="">Select County</option>
                          {counties.map((county) => (
                            <option key={county} value={county}>{county}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Eircode
                        </label>
                        <Input
                          placeholder="D01 AB12"
                          value={formData.eircode}
                          onChange={(e) => setFormData({ ...formData, eircode: e.target.value })}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="h-48 bg-muted rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Map preview will appear here</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Verification */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Safety & Verification
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Build trust with families by verifying your credentials
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">Garda Vetting</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Upload your Garda vetting documentation to display the verified badge on your profile.
                          </p>
                          <Button variant="outline" size="sm" className="rounded-full">
                            Upload Document
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">Insurance Certificate</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Provide proof of public liability insurance for your activities.
                          </p>
                          <Button variant="outline" size="sm" className="rounded-full">
                            Upload Certificate
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">Qualifications & Certifications</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Add your coaching badges, qualifications, and certifications.
                          </p>
                          <Button variant="outline" size="sm" className="rounded-full">
                            Add Qualifications
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Photos */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Add Photos
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Great photos help families choose your activities
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Cover Photo
                      </label>
                      <div className="h-48 border-2 border-dashed border-border rounded-xl flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="text-center">
                          <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload cover photo</p>
                          <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x600px</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Gallery Photos
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div 
                            key={i}
                            className="aspect-square border-2 border-dashed border-border rounded-xl flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
                          >
                            <Camera className="h-6 w-6 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Schedule */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Set Your Schedule
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Define your business hours and availability
                    </p>
                  </div>

                  <div className="space-y-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl">
                        <div className="w-28 font-medium text-foreground">{day}</div>
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            type="time"
                            defaultValue="09:00"
                            className="rounded-lg w-28"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            defaultValue="18:00"
                            className="rounded-lg w-28"
                          />
                        </div>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          Closed
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Payment */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Payment Setup
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Connect your payment account to receive bookings
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Stripe Connect</h3>
                        <p className="text-sm text-muted-foreground">Secure payment processing</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your Stripe account to receive payments directly. Funds are transferred to your bank account within 2-3 business days.
                    </p>
                    <Button className="rounded-full">
                      Connect Stripe Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-2">Platform Fees</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 5% platform fee per booking</li>
                      <li>• Stripe processing fee: 1.4% + €0.25</li>
                      <li>• No monthly subscription required</li>
                      <li>• Cancel anytime</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                {currentStep < steps.length ? (
                  <Button onClick={handleNext} className="rounded-full">
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button className="rounded-full" asChild>
                    <Link href="/provider/dashboard">
                      Complete Setup
                      <CheckCircle2 className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Help */}
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Need help? <Link href="/about" className="text-primary hover:underline">Contact our support team</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
