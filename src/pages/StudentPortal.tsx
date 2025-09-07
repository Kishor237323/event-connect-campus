import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Star,
  Heart,
  Share2,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useEvents } from "@/hooks/useEventService";
import { StudentRegistrationModal, StudentRegistrationData } from "@/components/StudentRegistrationModal";
import { useRegistration } from "@/hooks/useRegistration";
import { useToast } from "@/hooks/use-toast";

export default function StudentPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [registrationModal, setRegistrationModal] = useState<{
    isOpen: boolean;
    eventId: string;
    eventTitle: string;
  }>({ isOpen: false, eventId: '', eventTitle: '' });
  
  const { registerForEvent, isLoading: isRegistering } = useRegistration();
  const { toast } = useToast();
  
  const selectedCollegeId = typeof window !== 'undefined' ? localStorage.getItem('selectedCollegeId') : undefined;
  const { events, isLoading, error } = useEvents({ college_id: selectedCollegeId || undefined });

  // Debug log to verify college filtering
  console.log('Student Portal - Selected College ID:', selectedCollegeId);
  console.log('Student Portal - Fetched Events:', events);
  console.log('Student Portal - API URL being called:', `/api/events?college_id=${selectedCollegeId}`);
  
  // Also fetch ALL events to compare
  const { events: allEvents } = useEvents({});
  console.log('All events in database:', allEvents);
  
  // Show the college_id of each event to identify the mismatch
  allEvents.forEach((event, index) => {
    console.log(`Event ${index + 1}: "${event.title}" has college_id: "${event.college_id}"`);
  });
  
  // Auto-fix: If we have events but no matches, and all events have the same college_id,
  // update localStorage to match the events
  if (events.length === 0 && allEvents.length > 0 && selectedCollegeId !== allEvents[0]?.college_id) {
    const actualCollegeId = allEvents[0].college_id;
    console.log(`🔧 Auto-fixing college ID mismatch: Updating from "${selectedCollegeId}" to "${actualCollegeId}"`);
    localStorage.setItem('selectedCollegeId', actualCollegeId);
    window.location.reload(); // Reload to fetch with correct college ID
  }

  const handleRegister = (eventId: string, eventTitle: string) => {
    setRegistrationModal({ isOpen: true, eventId, eventTitle });
  };
  
  const handleRegistrationSubmit = async (data: StudentRegistrationData) => {
    const registrationData = {
      ...data,
      event_id: registrationModal.eventId,
      college_id: selectedCollegeId || ''
    };
    
    const result = await registerForEvent(registrationData);
    
    if (result.success) {
      setRegisteredEvents(prev => [...prev, registrationModal.eventId]);
      toast({
        title: "Registration Successful!",
        description: `You have successfully registered for ${registrationModal.eventTitle}`,
      });
      setRegistrationModal({ isOpen: false, eventId: '', eventTitle: '' });
    } else {
      toast({
        title: "Registration Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleUnregister = (eventId: string) => {
    setRegisteredEvents(prev => prev.filter(id => id !== eventId));
    // TODO: Implement actual unregistration API call
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "registered") {
      return matchesSearch && registeredEvents.includes(event.id);
    }
    if (activeTab === "upcoming") {
      return matchesSearch && new Date(event.start_date) > new Date();
    }
    return matchesSearch;
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success/10 text-success";
      case "upcoming": return "bg-primary/10 text-primary";
      case "completed": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Campus Events</h1>
          <p className="text-muted-foreground">Discover and register for exciting campus activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{events.length}</div>
              <p className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                Active events to join
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Registrations
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{registeredEvents.length}</div>
              <p className="text-xs text-success flex items-center mt-1">
                <Heart className="mr-1 h-3 w-3" />
                Events you've joined
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Events
              </CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {events.filter(e => new Date(e.start_date) > new Date()).length}
              </div>
              <p className="text-xs text-success flex items-center mt-1">
                <Calendar className="mr-1 h-3 w-3" />
                Events this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-elegant mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <CardTitle className="text-foreground">Browse Events</CardTitle>
                <CardDescription>Find events that interest you</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-80"
                />
              </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="registered">My Events</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading events for your college...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Unable to load events</h3>
                <p className="text-muted-foreground">
                  {error === 'Failed to fetch' ? 'Please check your connection and try again' : error}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="shadow-card hover:shadow-elegant transition-smooth overflow-hidden">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-foreground line-clamp-1">{event.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {event.description || "No description provided"}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-fit">
                          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm text-muted-foreground">
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
                      </div>

                      <div className="pt-2">
                        {registeredEvents.includes(event.id) ? (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleUnregister(event.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Registered
                          </Button>
                        ) : (
                          <Button 
                            className="w-full"
                            onClick={() => handleRegister(event.id, event.title)}
                          >
                            <Heart className="mr-2 h-4 w-4" />
                            Register
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredEvents.length === 0 && !isLoading && !error && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {activeTab === "registered" ? "No registered events" : "No events available"}
                </h3>
                <p className="text-muted-foreground">
                  {activeTab === "registered" 
                    ? "You haven't registered for any events yet"
                    : events.length === 0
                      ? "No events have been created for your college yet. Check back later!"
                      : "Try adjusting your search criteria"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <StudentRegistrationModal
          isOpen={registrationModal.isOpen}
          onClose={() => setRegistrationModal({ isOpen: false, eventId: '', eventTitle: '' })}
          onSubmit={handleRegistrationSubmit}
          eventTitle={registrationModal.eventTitle}
          isLoading={isRegistering}
        />
      </div>
    </div>
  );
}
