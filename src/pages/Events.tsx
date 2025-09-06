import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import eventImage from "@/assets/student-event.jpg";
import { CreateEventModal } from "@/components/CreateEventModal";
import { useEvents, useCreateEvent, useDeleteEvent, usePublishEvent } from "@/hooks/useEventService";
import { useDataService } from "@/hooks/useDataService";
import { Event, CreateEventRequest } from "@/types";
import { debugDatabaseState } from "@/lib/eventService";

const categories = ["All", "Academic", "Cultural", "Professional", "Sports", "Social"];

export default function Events() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<string>("college-1");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Data service
  const { isInitialized } = useDataService();

  // Event hooks
  const { events, isLoading, error, refetch } = useEvents();

  // Single effect to handle all loading logic
  useEffect(() => {
    if (isInitialized && !hasInitiallyLoaded) {
      console.log('Initial load - fetching events for college:', selectedCollege);
      setHasInitiallyLoaded(true);
      refetch();
    }
  }, [isInitialized, selectedCollege]); // Only depend on these two

  // Handle initial loading state
  useEffect(() => {
    if (hasInitiallyLoaded && !isLoading) {
      setIsInitialLoading(false);
    }
  }, [hasInitiallyLoaded, isLoading]);

  // Debug log events data (no refetch here)
  useEffect(() => {
    console.log('Events data updated:', { events: events.length, isLoading, error });
  }, [events.length, isLoading, error]);

  const { createNewEvent, isLoading: isCreating, error: createError } = useCreateEvent();
  const { deleteEventData, isLoading: isDeleting, error: deleteError } = useDeleteEvent();
  const { publishEvent, isLoading: isPublishing, error: publishError } = usePublishEvent();

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
                           event.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && event.status === "active") ||
                      (activeTab === "draft" && event.status === "draft");
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success/10 text-success";
      case "draft": return "bg-muted text-muted-foreground";
      case "cancelled": return "bg-destructive/10 text-destructive";
      case "completed": return "bg-primary/10 text-primary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-3 w-3" />;
      case "draft": return <AlertCircle className="h-3 w-3" />;
      case "cancelled": return <XCircle className="h-3 w-3" />;
      case "completed": return <CheckCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const handleCreateEvent = async (eventData: CreateEventRequest) => {
    try {
      const newEvent = await createNewEvent(eventData, selectedCollege, "admin-1");
      if (newEvent) {
        setSuccessMessage("Event created successfully!");
        setIsCreateModalOpen(false);
        refetch(); // Refresh the events list
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setErrorMessage("Failed to create event. Please try again.");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      const success = await deleteEventData(eventId);
      if (success) {
        setSuccessMessage("Event deleted successfully!");
        refetch(); // Refresh the events list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage("Failed to delete event. Please try again.");
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    const publishedEvent = await publishEvent(eventId);
    if (publishedEvent) {
      setSuccessMessage("Event published successfully!");
      refetch(); // Refresh the events list
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleDebugDatabase = async () => {
    await debugDatabaseState();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isInitialized || isInitialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              <h2 className="text-xl font-semibold">Loading Events</h2>
              <p className="text-muted-foreground text-center">
                Please wait while we load the events data...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Events Management</h1>
            <p className="text-muted-foreground">Create, manage, and track all campus events</p>
          </div>
          <Button 
            className="bg-gradient-primary shadow-glow mt-4 md:mt-0"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="mb-6 border-success/20 bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        {errorMessage && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/10">
            <XCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        {(createError || deleteError || publishError) && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/10">
            <XCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              {createError || deleteError || publishError}
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDebugDatabase}
            >
              Debug DB
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-smooth"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {error ? (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Error Loading Events</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => refetch()}>
                  <Search className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="shadow-card hover:shadow-elegant transition-smooth overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={eventImage} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className={getStatusColor(event.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(event.status)}
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    
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

                    <CardContent className="space-y-4">
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
                          <MapPin className="mr-2 h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          Capacity: {event.capacity}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          Created: {formatDate(event.created_at)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {/* View functionality */}}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {/* Edit functionality */}}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {event.status === 'draft' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePublishEvent(event.id)}
                              disabled={isPublishing}
                            >
                              {isPublishing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={isDeleting}
                            className="text-destructive hover:text-destructive"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredEvents.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria, or create your first event
                </p>
                <Button 
                  className="bg-gradient-primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Event
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
        isLoading={isCreating}
      />
    </div>
  );
}