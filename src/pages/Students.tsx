import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Award,
  TrendingUp,
  UserPlus,
  Download
} from "lucide-react";

const students = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    year: "Senior",
    major: "Computer Science",
    eventsAttended: 12,
    eventsRegistered: 15,
    lastActive: "2 hours ago",
    status: "Active",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@university.edu",
    phone: "+1 (555) 234-5678",
    year: "Junior",
    major: "Engineering",
    eventsAttended: 8,
    eventsRegistered: 10,
    lastActive: "1 day ago",
    status: "Active",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol.davis@university.edu",
    phone: "+1 (555) 345-6789",
    year: "Sophomore",
    major: "Business",
    eventsAttended: 15,
    eventsRegistered: 18,
    lastActive: "3 hours ago",
    status: "Active",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@university.edu",
    phone: "+1 (555) 456-7890",
    year: "Senior",
    major: "Arts",
    eventsAttended: 6,
    eventsRegistered: 8,
    lastActive: "1 week ago",
    status: "Inactive",
    avatar: "/api/placeholder/40/40"
  }
];

const topStudents = [
  { name: "Carol Davis", events: 15, major: "Business" },
  { name: "Alice Johnson", events: 12, major: "Computer Science" },
  { name: "Bob Smith", events: 8, major: "Engineering" }
];

const stats = [
  {
    title: "Total Students",
    value: "1,847",
    change: "+12%",
    icon: Users,
    color: "text-primary"
  },
  {
    title: "Active This Month",
    value: "1,234",
    change: "+8%",
    icon: TrendingUp,
    color: "text-success"
  },
  {
    title: "Avg. Events/Student",
    value: "8.3",
    change: "+2.1",
    icon: Calendar,
    color: "text-accent"
  },
  {
    title: "Top Performers",
    value: "156",
    change: "+15",
    icon: Award,
    color: "text-primary-glow"
  }
];

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.major.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && student.status === "Active") ||
                      (activeTab === "inactive" && student.status === "Inactive");
    
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success/10 text-success";
      case "Inactive": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Students Management</h1>
            <p className="text-muted-foreground">Track student participation and engagement</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button className="bg-gradient-primary shadow-glow">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </div>
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

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Students List */}
          <div className="lg:col-span-3">
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div>
                    <CardTitle className="text-foreground">Student Directory</CardTitle>
                    <CardDescription>Manage and track student information</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full md:w-80"
                    />
                  </div>
                </div>

                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full md:w-auto grid-cols-3">
                    <TabsTrigger value="all">All Students</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card hover:shadow-card transition-smooth">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-foreground">{student.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Mail className="mr-1 h-3 w-3" />
                              {student.email}
                            </span>
                            <span>{student.year} • {student.major}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span>{student.eventsAttended} events attended</span>
                            <span>•</span>
                            <span>{student.eventsRegistered} registered</span>
                            <span>•</span>
                            <span>Active {student.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredStudents.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No students found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Students Sidebar */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Top Active Students</CardTitle>
              <CardDescription>Most engaged students this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-card">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.major}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {student.events} events
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}