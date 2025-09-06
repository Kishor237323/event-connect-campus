import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  BarChart3, 
  GraduationCap 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Students", href: "/students", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CampusEvents</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "transition-smooth",
                      isActive && "shadow-card"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            {/* Enhanced college name display */}
            <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-gradient-to-r from-primary/5 to-white shadow-sm text-primary font-semibold text-base tracking-wide">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-accent mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l9 4.5-9 4.5-9-4.5L12 3zm0 13.5v4.5m0-4.5l9-4.5m-9 4.5l-9-4.5" />
              </svg>
              <span className="truncate max-w-[180px]">{typeof window !== 'undefined' && localStorage.getItem('selectedCollegeId')}</span>
            </span>
            <Button size="sm" className="bg-gradient-primary shadow-glow">
              Admin Panel
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}