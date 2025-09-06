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


const upcomingEvents = [
  {
    id: 1,
    title: "Tech Symposium 2024",
    date: "March 15, 2024",
    time: "2:00 PM",
    location: "Engineering Hall",
    registered: 180,
    capacity: 200,
    status: "Active"
  },
  {
    id: 2,
    title: "Cultural Festival",
    date: "March 20, 2024",
    time: "10:00 AM",
    location: "Campus Grounds",
    registered: 450,
    capacity: 500,
    status: "Active"
  },
  {
    id: 3,
    title: "Career Fair",
    date: "March 25, 2024",
    time: "9:00 AM",
    location: "Student Center",
    registered: 320,
    capacity: 400,
    status: "Active"
  }
];

const stats = [
  {
    title: "Total Events",
    value: "24",
    change: "+12%",
    icon: Calendar,
    color: "text-primary"
  },
  {
    title: "Registered Students",
    value: "1,847",
    change: "+18%",
    icon: Users,
    color: "text-success"
  },
  {
    title: "Attendance Rate",
    value: "87%",
    change: "+5%",
    icon: TrendingUp,
    color: "text-accent"
  },
  {
    title: "Active Events",
    value: "8",
    change: "+3",
    icon: Clock,
    color: "text-primary-glow"
  }
];

export default function Dashboard() {
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
          <Button 
            className="bg-gradient-primary shadow-glow mt-4 md:mt-0"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
          <CreateEventModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateEvent}
            isLoading={isCreating}
            initialCollegeId={localStorage.getItem('selectedCollegeId') || undefined}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-success flex items-center mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

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
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {event.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {event.time}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={(event.registered / event.capacity) * 100} 
                        className="w-32 h-2" 
                      />
                      <span className="text-sm text-muted-foreground">
                        {event.registered}/{event.capacity}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    {event.status}
                  </Badge>
                </div>
              ))}
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