"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Heart, 
  Users, 
  MapPin, 
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const stats = [
    { value: "50,000+", label: "Active Users" },
    { value: "2,500+", label: "Activities Listed" },
    { value: "1,200+", label: "Verified Providers" },
    { value: "32", label: "Counties Covered" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Every provider is verified with Garda vetting and insurance checks. Your family's safety is our top priority."
    },
    {
      icon: Heart,
      title: "Community Driven",
      description: "Built by Irish parents and activity providers, for Irish families. We understand local needs."
    },
    {
      icon: Users,
      title: "Inclusive Access",
      description: "Activities for every age, ability, and interest. Everyone deserves to find their passion."
    },
    {
      icon: MapPin,
      title: "Truly Local",
      description: "From Dublin to Donegal, Cork to Cavan. Supporting local businesses across all 32 counties."
    },
  ];

  const team = [
    {
      name: "Sarah O'Brien",
      role: "Co-Founder & CEO",
      bio: "Former PE teacher and mother of three. Passionate about making activities accessible to all Irish families.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
      name: "Conor Murphy",
      role: "Co-Founder & CTO",
      bio: "Tech entrepreneur and GAA coach. Building the technology to connect communities.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    },
    {
      name: "Aoife Kelly",
      role: "Head of Operations",
      bio: "10 years in event management. Ensuring every booking runs smoothly.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    },
    {
      name: "Liam Byrne",
      role: "Head of Partnerships",
      bio: "Former sports administrator. Connecting providers with families nationwide.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
  ];

  const milestones = [
    { year: "2022", event: "Activio founded in Dublin" },
    { year: "2023", event: "Expanded to all 32 counties" },
    { year: "2024", event: "Reached 50,000 active users" },
    { year: "2025", event: "Launched provider mobile app" },
    { year: "2026", event: "Introducing AI-powered recommendations" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-24 md:pb-0">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                Our Story
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
                Connecting Irish Families with Amazing Activities
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
                Activio was born from a simple idea: every child and adult deserves 
                easy access to activities that spark joy, build skills, and create lasting memories.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We believe that finding the right activity should be as easy as booking a 
                  restaurant. Whether you&apos;re a parent looking for your child&apos;s next 
                  passion, or an adult seeking a new hobby, Activio makes discovery 
                  and booking seamless.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  We&apos;re building the future of activity discovery in Ireland - a platform 
                  where quality providers thrive and families find exactly what they&apos;re 
                  looking for.
                </p>
                <div className="space-y-3">
                  {[
                    "Instant booking with real-time availability",
                    "Verified and vetted providers only",
                    "Activities across all 32 counties",
                    "Support for providers of all sizes"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-8">
                  <div className="w-full h-full rounded-2xl bg-card shadow-xl flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Award className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Award Winning Platform
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Best Family Tech Startup 2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything we do is guided by these core principles
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Passionate people building the future of activity discovery in Ireland
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image unoptimized
                      src={member.image}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Journey
              </h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
                {milestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className={`relative flex items-center gap-6 mb-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-12 md:pl-0`}>
                      <div className="bg-card rounded-xl p-4 shadow-sm border border-border inline-block">
                        <span className="text-primary font-bold">{milestone.year}</span>
                        <p className="text-foreground">{milestone.event}</p>
                      </div>
                    </div>
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-primary border-4 border-background" />
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-16 text-center text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of Irish families discovering amazing activities every day
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="rounded-full"
                  asChild
                >
                  <Link href="/discover">
                    Find Activities
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="rounded-full bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/pricing">
                    List Your Activity
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
