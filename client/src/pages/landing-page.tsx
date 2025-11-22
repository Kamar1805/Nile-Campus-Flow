import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Lock, Activity, Car, QrCode, ArrowRight, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import logoUrl from "@assets/download_1763844316538.png";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Automated gate access control with real-time monitoring and comprehensive audit trails for campus safety.",
    },
    {
      icon: Zap,
      title: "Reduced Congestion",
      description: "Streamline vehicle entry and exit processes, significantly reducing wait times during peak hours.",
    },
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Live traffic data and analytics dashboard for security personnel and administrators.",
    },
    {
      icon: QrCode,
      title: "QR & RFID Access",
      description: "Contactless vehicle authorization using QR codes or RFID tags for seamless campus access.",
    },
    {
      icon: Car,
      title: "Vehicle Management",
      description: "Centralized database of registered vehicles with automated tracking and management.",
    },
    {
      icon: Lock,
      title: "Access Control",
      description: "Role-based permissions for students, staff, visitors, and security officers.",
    },
  ];

  const stats = [
    { value: "99%", label: "System Uptime" },
    { value: "2s", label: "Average Gate Processing" },
    { value: "24/7", label: "Real-Time Monitoring" },
    { value: "100%", label: "Digital Records" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Nile University" className="h-10 sm:h-12 w-auto object-contain" />
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-foreground">CampusFlow</h1>
                <p className="text-xs text-muted-foreground">Smart Vehicle Authorization</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("features")}
                className="hidden md:inline-flex"
                data-testid="button-features"
              >
                Features
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("about")}
                className="hidden md:inline-flex"
                data-testid="button-about"
              >
                About
              </Button>
              <ThemeToggle />
              <Button onClick={() => setLocation("/login")} data-testid="button-login">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 anim-duration-1000">
            <div className="inline-block">
              <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-top-2 anim-duration-700">
                Nile University of Nigeria
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
              Smart Vehicle Entry
              <br />
              <span className="text-primary">Authorization System</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Revolutionizing campus mobility with automated gate access, real-time monitoring, and seamless traffic management for the Nile University community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={() => setLocation("/login")}
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 hover-elevate active-elevate-2"
                data-testid="button-get-started"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("features")}
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 hover-elevate active-elevate-2"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
            <div
              className="mt-12 cursor-pointer animate-bounce"
              onClick={() => scrollToSection("stats")}
              data-testid="button-scroll-down"
            >
              <ChevronDown className="h-8 w-8 mx-auto text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary/10),transparent)]" />
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 p-6 rounded-lg hover-elevate active-elevate-2 transition-all duration-300 hover:scale-105"
                data-testid={`stat-${index}`}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Comprehensive Campus Solution
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern technology designed to enhance security, reduce congestion, and improve the overall campus experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover-elevate active-elevate-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                data-testid={`feature-card-${index}`}
              >
                <CardHeader>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                About CampusFlow
              </h2>
              <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p>
                  CampusFlow is Nile University's Smart Vehicle Entry/Exit Authorization System (SVEAS), designed to address the persistent challenges of traffic congestion and limited visibility into real-time movement conditions across campus.
                </p>
                <p>
                  Our solution integrates automated gate access control, real-time traffic monitoring, and comprehensive analytics to ensure smooth mobility for students, staff, and visitors while maintaining the highest security standards.
                </p>
                <p>
                  With support for RFID tags and QR codes, centralized vehicle management, and role-based access control, CampusFlow represents the future of campus transportation management.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setLocation("/login")}
                className="hover-elevate active-elevate-2"
                data-testid="button-start-now"
              >
                Start Using CampusFlow
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <Card className="p-8 hover-elevate transition-all duration-300">
                <CardHeader>
                  <img src={logoUrl} alt="Nile University" className="h-24 w-auto mx-auto mb-6 object-contain" />
                  <CardTitle className="text-center text-2xl">Nile University of Nigeria</CardTitle>
                  <CardDescription className="text-center text-base">
                    Honors United Universities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">System Objectives:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>Real-time traffic notifications across campus</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>Centralized monitoring dashboard for administrators</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>Reduce congestion at campus entry points</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>Digital database for driver and vehicle information</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Ready to Experience Seamless Campus Mobility?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Join the Nile University community in revolutionizing campus transportation.
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/login")}
            className="text-base sm:text-lg px-8 py-6 hover-elevate active-elevate-2"
            data-testid="button-cta"
          >
            Access CampusFlow Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Nile University" className="h-8 w-auto object-contain" />
              <div className="text-sm text-muted-foreground">
                © 2024 Nile University of Nigeria. All rights reserved.
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              CampusFlow - Smart Vehicle Authorization System
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
