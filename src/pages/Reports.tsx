import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Target,
  RefreshCw,
  Database,
  Loader2
} from "lucide-react";
import { useDataService, useDashboardStats, useEventPopularityReport, useStudentParticipationReport } from "@/hooks/useDataService";
import { useState } from "react";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("popularity");
  const [collegeFilter, setCollegeFilter] = useState<string | undefined>(undefined);
  
  // Data service hooks
  const { isInitialized, isLoading: isDataLoading, error: dataError, initializeData } = useDataService();
  const { stats: dashboardStats, isLoading: isStatsLoading, error: statsError, fetchStats: refetchStats } = useDashboardStats();
  const { report: eventPopularity, isLoading: isPopularityLoading, error: popularityError, fetchReport: refetchPopularity } = useEventPopularityReport();
  const { report: studentParticipation, isLoading: isParticipationLoading, error: participationError, fetchReport: refetchParticipation } = useStudentParticipationReport();
  // Mock data for missing reports
  const monthlyTrends = [];
  const isTrendsLoading = false;
  const trendsError = null;
  const topStudents = [];
  const isTopStudentsLoading = false;
  const topStudentsError = null;
  const eventTypeAnalysis = [];
  const isTypeAnalysisLoading = false;
  const typeAnalysisError = null;

  const handleRefreshData = () => {
    refetchPopularity();
    refetchParticipation();
    refetchStats();
  };

  const handleExportReport = async (reportType: string) => {
    try {
      // In a real implementation, this would call the API to generate and download the report
      console.log(`Exporting ${reportType} report...`);
      // For now, just show a success message
      alert(`Exporting ${reportType} report... (This would download a CSV file in a real implementation)`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Database className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Initializing Database</h2>
              <p className="text-muted-foreground text-center">
                Setting up the database and populating with sample data...
              </p>
              {isDataLoading && <Loader2 className="h-6 w-6 animate-spin" />}
              {dataError && (
                <Alert className="w-full">
                  <AlertDescription>
                    {dataError}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2"
                      onClick={initializeData}
                    >
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Reports</h1>
            <p className="text-muted-foreground">Comprehensive insights into event performance and student engagement</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefreshData}
              disabled={isStatsLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isStatsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCollegeFilter(undefined)}
            >
              <Filter className="mr-2 h-4 w-4" />
              All Colleges
            </Button>
            <Button 
              className="bg-gradient-primary shadow-glow"
              onClick={() => handleExportReport('comprehensive')}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {(statsError || popularityError || participationError || trendsError || topStudentsError || typeAnalysisError) && (
          <Alert className="mb-6">
            <AlertDescription>
              Some reports failed to load. Please try refreshing the data.
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={handleRefreshData}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

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
              <div className="text-2xl font-bold text-foreground">
                {isStatsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : dashboardStats?.total_events || 0}
              </div>
              <p className="text-xs text-success flex items-center mt-1">
                
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
              <div className="text-2xl font-bold text-foreground">
                {isStatsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : dashboardStats?.total_registrations?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-success flex items-center mt-1">
                
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
              <div className="text-2xl font-bold text-foreground">
                {isStatsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${dashboardStats?.average_attendance_rate || 0}%`}
              </div>
              <p className="text-xs text-success flex items-center mt-1">
               
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
              <div className="text-2xl font-bold text-foreground">
                {isStatsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : dashboardStats?.average_rating || 0}
              </div>
              <p className="text-xs text-success flex items-center mt-1">
               
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs defaultValue="popularity" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="popularity">Event Popularity</TabsTrigger>
            <TabsTrigger value="participation">Student Participation</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
            <TabsTrigger value="top-students">Top Students</TabsTrigger>
          </TabsList>

          <TabsContent value="popularity">
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                <CardTitle className="text-foreground">Event Popularity Report</CardTitle>
                <CardDescription>Events ranked by registration numbers and attendance rates</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportReport('event-popularity')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isPopularityLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                <div className="space-y-6">
                  {eventPopularity.map((event, index) => (
                      <div key={event.event_id} className="p-4 rounded-lg border bg-gradient-card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                            <h4 className="font-semibold text-foreground">{event.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                    className={`h-3 w-3 ${i < Math.floor(event.average_rating) ? 'text-accent fill-current' : 'text-muted-foreground'}`} 
                                />
                              ))}
                                <span className="ml-1 text-sm text-muted-foreground">{event.average_rating}</span>
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
                            <Progress value={event.attendance_rate} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                              {event.attendance}/{event.registrations} ({event.attendance_rate}%)
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participation">
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                <CardTitle className="text-foreground">Student Participation Analysis</CardTitle>
                <CardDescription>Individual student engagement and attendance patterns</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportReport('student-participation')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isParticipationLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                <div className="space-y-4">
                  {studentParticipation.map((student, index) => (
                      <div key={student.student_id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card">
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
                            <p className="text-lg font-bold text-foreground">{student.events_attended}</p>
                          <p className="text-xs text-muted-foreground">Events Attended</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-foreground">{student.events_registered}</p>
                          <p className="text-xs text-muted-foreground">Total Registrations</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-success">{student.attendance_rate}%</p>
                          <p className="text-xs text-muted-foreground">Attendance Rate</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                <CardTitle className="text-foreground">Monthly Trends</CardTitle>
                <CardDescription>Event activity and participation trends over time</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportReport('monthly-trends')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isTrendsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                <div className="space-y-6">
                    {monthlyTrends?.map((month, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-gradient-card">
                      <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-foreground">{month.month}</h4>
                          <Badge variant="outline">{month.events_count} Events</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Registrations</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={70} className="flex-1 h-2" />
                              <span className="text-sm font-medium text-foreground">{month.total_registrations.toLocaleString()}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Attendance</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={60} className="flex-1 h-2" />
                              <span className="text-sm font-medium text-foreground">{month.total_attendance.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
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
                  {isTopStudentsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    topStudents.slice(0, 3).map((student, index) => (
                      <div key={student.student_id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-card">
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
                          {student.events_attended} events
                      </Badge>
                    </div>
                    ))
                  )}
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
                      {dashboardStats?.average_attendance_rate || 0}% average attendance rate across all events
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-accent mr-2" />
                      <span className="font-medium text-accent">Quality Events</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average event satisfaction rating: {dashboardStats?.average_rating || 0}/5.0
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