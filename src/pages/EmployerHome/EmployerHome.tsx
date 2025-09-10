import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  Users,
  Target,
  BarChart3,
  CheckCircle,
  Star,
  Play,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";

export default function EmployerHome() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "HR Director",
      company: "TechCorp",
      avatar: "https://i.pravatar.cc/150?img=1",
      content:
        "Workify helped us reduce our hiring time by 60%. The quality of candidates is exceptional.",
      logo: "https://images.unsplash.com/photo-1655825172059-3f96f4994810?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsb2dvJTIwY29tcGFueSUyMHRlY2glMjBicmFuZHxlbnwwfDJ8fHwxNzU3NDc5ODIxfDA&ixlib=rb-4.1.0&q=85",
    },
    {
      name: "Michael Rodriguez",
      role: "Founder",
      company: "StartupX",
      avatar: "https://i.pravatar.cc/150?img=2",
      content:
        "As a startup, we needed top talent fast. Workify delivered exactly what we needed.",
      logo: "https://images.unsplash.com/photo-1668903678362-0fbcb9108d53?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxsb2dvJTIwc3RhcnR1cCUyMGNvbXBhbnklMjBicmFuZHxlbnwwfDJ8fHwxNzU3NDc5ODIxfDA&ixlib=rb-4.1.0&q=85",
    },
    {
      name: "Emily Johnson",
      role: "VP of Operations",
      company: "GlobalCorp",
      avatar: "https://i.pravatar.cc/150?img=3",
      content:
        "The analytics and insights have transformed how we approach recruitment strategy.",
      logo: "https://images.unsplash.com/photo-1753978546915-5dafd18b1e9b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsb2dvJTIwY29ycG9yYXRlJTIwY29tcGFueSUyMGJ1c2luZXNzfGVufDB8Mnx8fDE3NTc0Nzk4MjF8MA&ixlib=rb-4.1.0&q=85",
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Quality Candidates",
      description:
        "Access to pre-screened, high-quality candidates ready to make an impact",
    },
    {
      icon: Zap,
      title: "Fast Hiring",
      description:
        "Reduce time-to-hire by 60% with our streamlined recruitment process",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Data-driven insights to optimize your recruitment strategy",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Post Your Job",
      description: "Create compelling job postings with our intuitive builder",
    },
    {
      number: "02",
      title: "Review Candidates",
      description:
        "Browse through qualified candidates matched to your requirements",
    },
    {
      number: "03",
      title: "Make Your Hire",
      description: "Connect with top talent and build your dream team",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small businesses",
      features: [
        "5 job postings",
        "Basic candidate matching",
        "Email support",
        "Standard analytics",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for growing companies",
      features: [
        "Unlimited job postings",
        "Advanced candidate matching",
        "Priority support",
        "Advanced analytics",
        "Team collaboration",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Custom integrations",
        "Dedicated account manager",
        "Advanced reporting",
        "Custom workflows",
        "SLA guarantee",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl float-animation"></div>
          <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl float-animation-delayed"></div>

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231967d2' fill-opacity='0.03'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 main-layout">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <Badge className="bg-[#1967d2]/10 text-[#1967d2] border-[#1967d2]/20 px-4 py-2">
                  🚀 Trusted by 10,000+ Companies
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Find Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1967d2] to-blue-600">
                    Dream Team
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Connect with top-tier talent and build exceptional teams. Our
                  AI-powered platform matches you with the perfect candidates in
                  record time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#1967d2] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 h-14 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 pulse-on-hover"
                >
                  Start Hiring Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-4 h-14 text-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">500K+</div>
                  <div className="text-sm text-gray-600">Candidates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in-up delay-300">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1573497701175-00c200fd57f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxvZmZpY2UlMjB3b3Jrc3BhY2UlMjBwcm9mZXNzaW9uYWxzJTIwdGVhbSUyMGNvbGxhYm9yYXRpb258ZW58MHwwfHxibHVlfDE3NTc0Nzk4MjF8MA&ixlib=rb-4.1.0&q=85"
                  alt="Modern office workspace with diverse professionals collaborating - Christina @ wocintechchat.com on Unsplash"
                  className="w-full h-96 object-cover"
                  style={{ width: "100%", height: "400px" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl float-animation">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">1,247 Active Jobs</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl float-animation-delayed">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-[#1967d2]" />
                  <span className="text-sm font-medium">98% Match Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 bg-white">
        <div className="main-layout">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Top Companies Choose Workify
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your hiring process with our cutting-edge platform
              designed for modern businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm"
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#1967d2] to-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 bg-[#1967d2]/20 rounded-2xl mx-auto blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="main-layout">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1967d2] to-blue-600 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#1967d2] to-blue-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl shadow-lg">
                          {step.number}
                        </div>
                        <div className="absolute inset-0 w-16 h-16 bg-[#1967d2]/20 rounded-full mx-auto blur-xl"></div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-white">
        <div className="main-layout">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-[#1967d2]/10 text-[#1967d2] border-[#1967d2]/20 mb-4">
                  Advanced Analytics
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Make Data-Driven Hiring Decisions
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Get deep insights into your recruitment process with our
                  comprehensive analytics dashboard. Track performance, optimize
                  strategies, and make informed decisions.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">
                    Real-time recruitment metrics
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">
                    Candidate quality scoring
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">
                    Time-to-hire optimization
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-[#1967d2] hover:bg-[#1557b8] text-white font-semibold px-8 py-4"
              >
                Explore Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1587401511935-a7f87afadf2f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBpbnRlcmZhY2UlMjBhbmFseXRpY3MlMjBtZXRyaWNzJTIwVUl8ZW58MHwwfHxibHVlfDE3NTc0Nzk4MjF8MA&ixlib=rb-4.1.0&q=85"
                  alt="Modern dashboard interface showing analytics and metrics - KOBU Agency on Unsplash"
                  className="w-full h-80 object-cover"
                  style={{ width: "100%", height: "320px" }}
                />
              </div>
            </div>
          </div>

          {/* Second Feature Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-24">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1620287341056-49a2f1ab2fdc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw4fHxwcm9maWxlcyUyMHJlc3VtZXMlMjBjYW5kaWRhdGVzJTIwaW50ZXJmYWNlJTIwVUl8ZW58MHwwfHx8MTc1NzQ3OTgyMXww&ixlib=rb-4.1.0&q=85"
                  alt="User interface showing candidate profiles and resumes - Justin Morgan on Unsplash"
                  className="w-full h-80 object-cover"
                  style={{ width: "100%", height: "320px" }}
                />
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <Badge className="bg-green-100 text-green-800 border-green-200 mb-4">
                  Smart Matching
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Find Perfect Candidates Instantly
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Our AI-powered matching algorithm analyzes skills, experience,
                  and cultural fit to connect you with the most qualified
                  candidates for your roles.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-[#1967d2]" />
                  <span className="text-gray-700">
                    95% accuracy in candidate matching
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-[#1967d2]" />
                  <span className="text-gray-700">
                    Pre-screened quality candidates
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-[#1967d2]" />
                  <span className="text-gray-700">
                    60% faster hiring process
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#1967d2] text-[#1967d2] hover:bg-[#e0eeff] font-semibold px-8 py-4"
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
