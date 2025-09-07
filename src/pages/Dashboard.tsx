import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateEventModal } from "@/components/CreateEventModal";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  Plus,
  ArrowRight,
  MapPin,
  Star,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreateEventRequest } from "@/types";


import { useEvents } from "@/hooks/useEventService";
import { useDashboardStats } from "@/hooks/useDataService";
import { useEventRegistrations } from "@/hooks/useEventRegistrations";
import { EventRegistrationCount } from "@/components/EventRegistrationCount";
import { Loader2 } from "lucide-react";

const statsConfig = [
  {
    title: "Total Events",
    key: "total_events",
    icon: Calendar,
    color: "text-primary"
  },
  {
    title: "Registered Students",
    key: "total_registrations",
    icon: Users,
    color: "text-success"
  },
  {
    title: "Attendance Rate",
    key: "average_attendance_rate",
    icon: TrendingUp,
    color: "text-accent",
    isPercent: true
  },
  {
    title: "Active Events",
    key: "active_events",
    icon: Clock,
    color: "text-primary-glow"
  }
];

export default function Dashboard() {

  // Fetch events once at the top level for consistent access and logging
  const selectedCollegeId = localStorage.getItem('selectedCollegeId');
  const { events, isLoading: isEventsLoading } = useEvents({ college_id: selectedCollegeId || undefined });
  console.log('Fetched events:', events);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  const handleCreateEvent = async (eventData: CreateEventRequest): Promise<void> => {
    setIsCreating(true);
    try {
      // TODO: Add your event creation logic here, e.g. API call
      // await createEvent(eventData);
    } finally {
      setIsCreating(false);
      setIsCreateModalOpen(false);
      navigate('/events');
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your campus events and activities</p>
          </div>
          <CreateEventModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateEvent}
            isLoading={isCreating}
            initialCollegeId={localStorage.getItem('selectedCollegeId') || undefined}
          />
        </div>

        {/* Stats Grid */}
        {(() => {
          const { stats, isLoading } = useDashboardStats(selectedCollegeId || undefined);
          return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {statsConfig.map((config, index) => {
                const value = stats && typeof stats[config.key] !== 'undefined'
                  ? config.isPercent ? `${stats[config.key]}%` : stats[config.key]
                  : isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 0;
                return (
                  <Card key={index} className="shadow-card bg-gradient-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {config.title}
                      </CardTitle>
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{value}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          );
        })()}


        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Events */}
          <Card className="lg:col-span-2 shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Upcoming Events</CardTitle>
                  <CardDescription>Events scheduled for the next weeks</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upcoming Events Content */}
              {(() => {
                // useEvents is now called at the top level of Dashboard
                if (isEventsLoading) return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
                if (!events.length) return <div className="text-center py-8 text-muted-foreground">No upcoming events found.</div>;
                console.log('All events from API:', events);
                const now = new Date();
                const formatDate = (dateString: string) => {
                  return new Date(dateString).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                };
                const formatTime = (dateString: string) => {
                  return new Date(dateString).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  });
                };
                const upcoming = events
                  .filter(event => event.start_date && new Date(event.start_date) > now)
                  .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
                return upcoming.map((event) => (
                  <Card key={event.id} className="shadow-card hover:shadow-elegant transition-smooth overflow-hidden">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-foreground line-clamp-1">{event.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {event.description || "No description provided"}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(event.start_date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {formatTime(event.start_date)} - {formatTime(event.end_date)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-3 w-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Capacity: {event.capacity}
                      </div>
                      <EventRegistrationCount 
                        eventId={event.id} 
                        collegeId={selectedCollegeId || undefined}
                        showRefresh={true}
                      />
                    </CardContent>
                  </Card>
                ));
              })()}


            </CardContent>
          </Card>

          {/* Quick Actions & Analytics */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Event
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/students')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Students
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/reports')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Top Events</CardTitle>
                <CardDescription>Most popular events this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Tech Symposium", "Cultural Festival", "Sports Meet"].map((event, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < 4 ? 'text-accent fill-current' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-foreground">{event}</span>
                    </div>
                    <Badge variant="outline">4.8</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}