import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  BarChart3, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import campusHero from "@/assets/campus-hero.jpg";

const features = [
  {
    icon: Calendar,
    title: "Event Management",
    description: "Create, manage, and track campus events with powerful administrative tools",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Student Engagement",
    description: "Monitor student participation and engagement across all campus activities",
    color: "text-success"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Generate comprehensive reports and insights on event performance",
    color: "text-accent"
  }
];

const stats = [
  { label: "Active Events", value: "24", change: "+12%" },
  { label: "Registered Students", value: "1,847", change: "+18%" },
  { label: "Attendance Rate", value: "87%", change: "+5%" },
  { label: "Average Rating", value: "4.7", change: "+0.3" }
];

import { useState } from "react";
import { CollegeNameModal } from "@/components/CollegeNameModal";
import { RoleSelectModal } from "@/components/RoleSelectModal";

const Index = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "student" | null>(null);
  const [collegeName, setCollegeName] = useState<string | null>(null);

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role: "admin" | "student") => {
    setSelectedRole(role);
    setShowRoleModal(false);
    setShowCollegeModal(true);
  };

  const handleCollegeSubmit = (name: string) => {
    setCollegeName(name);
    setShowCollegeModal(false);
    // Save to localStorage for Dashboard/event form
    localStorage.setItem('selectedCollegeId', name);
    if (selectedRole === "student") {
      window.location.href = "/student";
    } else {
      window.location.href = "/dashboard";
    }
  };


  return (
    <>
      <RoleSelectModal isOpen={showRoleModal} onSelect={handleRoleSelect} />
      <CollegeNameModal isOpen={showCollegeModal} onSubmit={handleCollegeSubmit} />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={campusHero} 
            alt="Campus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <GraduationCap className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Campus Event Management
              <span className="block text-accent">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Streamline event creation, boost student engagement, and track performance 
              with our comprehensive campus event management platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow" onClick={handleGetStarted}>
  Get Started
  <ArrowRight className="ml-2 h-5 w-5" />
</Button>
<CollegeNameModal isOpen={showCollegeModal} onSubmit={handleCollegeSubmit} />
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center shadow-card bg-gradient-card">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground mb-2">{stat.label}</div>
                  <div className="flex items-center justify-center text-success text-sm">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Campus Events
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From creation to analytics, our platform provides all the tools 
              needed to run successful campus events
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-elegant hover:shadow-glow transition-smooth">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 text-primary-foreground`} />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="mr-2 h-4 w-4 text-success" />
                    Easy to use and implement
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Campus Events?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of universities already using our platform to create amazing campus experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-primary shadow-glow">
                  Start Managing Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/reports">
                <Button size="lg" variant="outline">
                  View Analytics Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center mt-8 space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent fill-current" />
                ))}
              </div>
              <span className="text-muted-foreground">4.9/5 from 200+ universities</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </>);
};

export default Index;
