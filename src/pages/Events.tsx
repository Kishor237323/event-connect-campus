import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Eye
} from "lucide-react";
import eventImage from "@/assets/student-event.jpg";

const events = [
  {
    id: 1,
    title: "Tech Symposium 2024",
    description: "Annual technology conference featuring industry leaders and innovative projects",
    date: "March 15, 2024",
    time: "2:00 PM - 6:00 PM",
    location: "Engineering Hall, Room 101",
    category: "Academic",
    registered: 180,
    capacity: 200,
    status: "Active",
    image: eventImage,
    organizer: "Computer Science Department"
  },
  {
    id: 2,
    title: "Cultural Festival",
    description: "Celebrate diversity with music, dance, and cultural performances",
    date: "March 20, 2024",
    time: "10:00 AM - 8:00 PM",
    location: "Campus Grounds",
    category: "Cultural",
    registered: 450,
    capacity: 500,
    status: "Active",
    image: eventImage,
    organizer: "Student Affairs"
  },
  {
    id: 3,
    title: "Career Fair 2024",
    description: "Connect with top employers and explore career opportunities",
    date: "March 25, 2024",
    time: "9:00 AM - 4:00 PM",
    location: "Student Center",
    category: "Professional",
    registered: 320,
    capacity: 400,
    status: "Active",
    image: eventImage,
    organizer: "Career Services"
  },
  {
    id: 4,
    title: "Science Fair",
    description: "Showcase of innovative research projects and scientific discoveries",
    date: "April 5, 2024",
    time: "1:00 PM - 5:00 PM",
    location: "Science Building",
    category: "Academic",
    registered: 85,
    capacity: 150,
    status: "Draft",
    image: eventImage,
    organizer: "Science Department"
  }
];

const categories = ["All", "Academic", "Cultural", "Professional", "Sports", "Social"];

export default function Events() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && event.status === "Active") ||
                      (activeTab === "draft" && event.status === "Draft");
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success/10 text-success";
      case "Draft": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Events Management</h1>
            <p className="text-muted-foreground">Create, manage, and track all campus events</p>
          </div>
          <Button className="bg-gradient-primary shadow-glow mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="shadow-card hover:shadow-elegant transition-smooth overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-foreground line-clamp-1">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {event.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {event.category}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        {event.registered}/{event.capacity} registered
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        by {event.organizer}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button className="bg-gradient-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Event
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}