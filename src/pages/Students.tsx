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

import { useStudents } from "@/hooks/useStudents";

import { useStudentStats } from "@/hooks/useStudentStats";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const selectedCollegeId = typeof window !== 'undefined' ? localStorage.getItem('selectedCollegeId') : undefined;
  const { stats: studentStats, isLoading: isStatsLoading } = useStudentStats(selectedCollegeId || undefined);
  const { students, isLoading: isStudentsLoading } = useStudents({ college_id: selectedCollegeId || undefined });

  const statCards = [
    {
      title: "Total Students",
      value: studentStats?.total_students ?? 0,
      change: studentStats?.total_students_change ?? '',
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Active This Month",
      value: studentStats?.active_students ?? 0,
      change: studentStats?.active_students_change ?? '',
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Avg. Events/Student",
      value: studentStats?.average_events_per_student ?? 0,
      change: studentStats?.average_events_per_student_change ?? '',
      icon: Calendar,
      color: "text-accent"
    },
    {
      title: "Top Performers",
      value: studentStats?.top_performers ?? 0,
      change: studentStats?.top_performers_change ?? '',
      icon: Award,
      color: "text-primary-glow"
    }
  ];


  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.major || '').toLowerCase().includes(searchTerm.toLowerCase());
    // Only filter by search, since status is not in Student type
    return matchesSearch;
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

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="shadow-card bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{isStatsLoading ? '...' : stat.value}</div>
                <p className="text-xs text-success flex items-center mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {stat.change ? `${stat.change} from last month` : ''}
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
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-foreground">{student.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Mail className="mr-1 h-3 w-3" />
                              {student.email}
                            </span>
                            <span>{student.year ? `Year: ${student.year}` : ''} {student.major ? `• ${student.major}` : ''}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
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
        </div>
      </div>
    </div>
  );
}