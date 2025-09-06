import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Filter,
  Star,
  Award,
  Clock,
  Target
} from "lucide-react";

const eventPopularity = [
  { name: "Tech Symposium 2024", registrations: 180, capacity: 200, attendance: 162, rating: 4.8 },
  { name: "Cultural Festival", registrations: 450, capacity: 500, attendance: 421, rating: 4.9 },
  { name: "Career Fair", registrations: 320, capacity: 400, attendance: 298, rating: 4.6 },
  { name: "Science Fair", registrations: 85, capacity: 150, attendance: 78, rating: 4.5 },
  { name: "Sports Meet", registrations: 250, capacity: 300, attendance: 235, rating: 4.7 }
];

const studentParticipation = [
  { name: "Carol Davis", eventsAttended: 15, registrations: 18, attendanceRate: 83, major: "Business" },
  { name: "Alice Johnson", eventsAttended: 12, registrations: 15, attendanceRate: 80, major: "Computer Science" },
  { name: "Bob Smith", eventsAttended: 8, registrations: 10, attendanceRate: 80, major: "Engineering" },
  { name: "Emma Wilson", eventsAttended: 11, registrations: 14, attendanceRate: 79, major: "Arts" },
  { name: "David Brown", eventsAttended: 9, registrations: 12, attendanceRate: 75, major: "Science" }
];

const monthlyStats = [
  { month: "Jan", events: 8, registrations: 1200, attendance: 1050 },
  { month: "Feb", events: 12, registrations: 1800, attendance: 1620 },
  { month: "Mar", events: 16, registrations: 2400, attendance: 2100 },
  { month: "Apr", events: 10, registrations: 1500, attendance: 1300 }
];

const topActiveStudents = [
  { name: "Carol Davis", events: 15 },
  { name: "Alice Johnson", events: 12 },
  { name: "Emma Wilson", events: 11 }
];

export default function Reports() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Reports</h1>
            <p className="text-muted-foreground">Comprehensive insights into event performance and student engagement</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-gradient-primary shadow-glow">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Events This Semester
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">46</div>
              <p className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                +15% from last semester
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Registrations
              </CardTitle>
              <Users className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">6,900</div>
              <p className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                +22% from last semester
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Attendance Rate
              </CardTitle>
              <Target className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">87%</div>
              <p className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                +5% from last semester
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Event Rating
              </CardTitle>
              <Star className="h-4 w-4 text-primary-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4.7</div>
              <p className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                +0.3 from last semester
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs defaultValue="popularity" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="popularity">Event Popularity</TabsTrigger>
            <TabsTrigger value="participation">Student Participation</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
            <TabsTrigger value="top-students">Top Students</TabsTrigger>
          </TabsList>

          <TabsContent value="popularity">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-foreground">Event Popularity Report</CardTitle>
                <CardDescription>Events ranked by registration numbers and attendance rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {eventPopularity.map((event, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-gradient-card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{event.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < Math.floor(event.rating) ? 'text-accent fill-current' : 'text-muted-foreground'}`} 
                                />
                              ))}
                              <span className="ml-1 text-sm text-muted-foreground">{event.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          #{index + 1}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Registration Rate</p>
                          <Progress value={(event.registrations / event.capacity) * 100} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.registrations}/{event.capacity} ({Math.round((event.registrations / event.capacity) * 100)}%)
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Attendance Rate</p>
                          <Progress value={(event.attendance / event.registrations) * 100} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.attendance}/{event.registrations} ({Math.round((event.attendance / event.registrations) * 100)}%)
                          </p>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{event.attendance}</p>
                            <p className="text-xs text-muted-foreground">Total Attendees</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participation">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-foreground">Student Participation Analysis</CardTitle>
                <CardDescription>Individual student engagement and attendance patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentParticipation.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.major}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-lg font-bold text-foreground">{student.eventsAttended}</p>
                          <p className="text-xs text-muted-foreground">Events Attended</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">{student.registrations}</p>
                          <p className="text-xs text-muted-foreground">Total Registrations</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-success">{student.attendanceRate}%</p>
                          <p className="text-xs text-muted-foreground">Attendance Rate</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-foreground">Monthly Trends</CardTitle>
                <CardDescription>Event activity and participation trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {monthlyStats.map((month, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-gradient-card">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-foreground">{month.month} 2024</h4>
                        <Badge variant="outline">{month.events} Events</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Registrations</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={70} className="flex-1 h-2" />
                            <span className="text-sm font-medium text-foreground">{month.registrations.toLocaleString()}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Attendance</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={60} className="flex-1 h-2" />
                            <span className="text-sm font-medium text-foreground">{month.attendance.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top-students">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Award className="mr-2 h-5 w-5 text-accent" />
                    Top 3 Most Active Students
                  </CardTitle>
                  <CardDescription>Students with highest event participation this semester</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topActiveStudents.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-card">
                      <div className="flex items-center space-x-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm ${
                          index === 0 ? 'bg-accent text-accent-foreground' :
                          index === 1 ? 'bg-primary text-primary-foreground' :
                          'bg-success text-success-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-foreground">{student.name}</span>
                      </div>
                      <Badge variant="outline" className="font-medium">
                        {student.events} events
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Key Insights</CardTitle>
                  <CardDescription>Important findings from student participation data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-4 w-4 text-success mr-2" />
                      <span className="font-medium text-success">Engagement Up</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Student participation increased by 22% compared to last semester
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 text-primary mr-2" />
                      <span className="font-medium text-primary">High Retention</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      87% average attendance rate across all events
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-accent mr-2" />
                      <span className="font-medium text-accent">Quality Events</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average event satisfaction rating improved to 4.7/5.0
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}