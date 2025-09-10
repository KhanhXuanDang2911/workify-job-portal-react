import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  LayoutGrid,
  Briefcase,
  Users,
  Clock5,
  CircleCheck,
  PlusCircle,
  Eye,
  Edit,
  X,
  Check,
  MoreHorizontal,
} from "lucide-react";
import {
  ApplicationStatus,
  JobStatus,
  mockQuery,
  mockStore,
} from "./employerDashboardMockData";

export default function EmployerDashboard() {
  const { dashboardMetrics, recentJobs, recentApplications, analyticsData } =
    mockQuery;
  const { user } = mockStore;

  // State management
  const [jobList, setJobList] = useState(recentJobs);
  const [applicationList, setApplicationList] = useState(recentApplications);
  const [selectedPeriod, setSelectedPeriod] = useState("last_7_days");

  // Helper functions
  const getJobStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case JobStatus.CLOSED:
        return "bg-red-100 text-red-800";
      case JobStatus.DRAFT:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING_REVIEW:
        return "bg-yellow-100 text-yellow-800";
      case ApplicationStatus.INTERVIEW_SCHEDULED:
        return "bg-blue-100 text-blue-800";
      case ApplicationStatus.HIRED:
        return "bg-green-100 text-green-800";
      case ApplicationStatus.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatJobStatus = (status: JobStatus) => {
    switch (status) {
      case JobStatus.ACTIVE:
        return "Active";
      case JobStatus.CLOSED:
        return "Closed";
      case JobStatus.DRAFT:
        return "Draft";
      default:
        return "Unknown";
    }
  };

  const formatApplicationStatus = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING_REVIEW:
        return "Pending Review";
      case ApplicationStatus.INTERVIEW_SCHEDULED:
        return "Interview Scheduled";
      case ApplicationStatus.HIRED:
        return "Hired";
      case ApplicationStatus.REJECTED:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Event handlers
  const handleJobAction = (jobId: number, action: string) => {
    console.log(`${action} job ${jobId}`);
    if (action === "close") {
      setJobList((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: JobStatus.CLOSED } : job
        )
      );
    }
  };

  const handleApplicationAction = (applicationId: number, action: string) => {
    console.log(`${action} application ${applicationId}`);
    if (action === "accept") {
      setApplicationList((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: ApplicationStatus.INTERVIEW_SCHEDULED }
            : app
        )
      );
    } else if (action === "reject") {
      setApplicationList((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: ApplicationStatus.REJECTED }
            : app
        )
      );
    }
  };

  // Chart configuration
  const chartConfig = {
    applications: {
      label: "Applications",
      color: "#1967d2",
    },
    views: {
      label: "Views",
      color: "#e0eeff",
    },
  };

  const trendsData = analyticsData.applicationTrends.map((item) => ({
    ...item,
    formattedDate: formatDate(item.date),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="main-layout py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your job postings at {user.company}
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Jobs Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Active Jobs
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardMetrics.activeJobs.toLocaleString()}
                  </p>
                  <p className="text-sm mt-1 text-green-600">
                    +12% from last month
                  </p>
                </div>
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: "#1967d215" }}
                >
                  <Briefcase size={24} style={{ color: "#1967d2" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Applications Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardMetrics.totalApplications.toLocaleString()}
                  </p>
                  <p className="text-sm mt-1 text-green-600">
                    +8% from last month
                  </p>
                </div>
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: "#10b98115" }}
                >
                  <Users size={24} style={{ color: "#10b981" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interviews Scheduled Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Interviews Scheduled
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardMetrics.interviewsScheduled.toLocaleString()}
                  </p>
                  <p className="text-sm mt-1 text-green-600">
                    +5% from last month
                  </p>
                </div>
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: "#f59e0b15" }}
                >
                  <Clock5 size={24} style={{ color: "#f59e0b" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hired This Month Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Hired This Month
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardMetrics.hiredThisMonth.toLocaleString()}
                  </p>
                  <p className="text-sm mt-1 text-green-600">
                    +15% from last month
                  </p>
                </div>
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: "#ef444415" }}
                >
                  <CircleCheck size={24} style={{ color: "#ef4444" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-[#1967d2] hover:bg-[#1557b8] text-white font-medium h-12"
                  onClick={() => console.log("Post new job")}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Post New Job
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#1967d2] text-[#1967d2] hover:bg-[#e0eeff] h-12"
                  onClick={() => console.log("View applications")}
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Applications
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-12"
                  onClick={() => console.log("Manage candidates")}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Manage Candidates
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Jobs Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Recent Jobs
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#1967d2] hover:text-[#1557b8]"
                >
                  View All Jobs
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobList.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          {job.title}
                        </TableCell>
                        <TableCell>
                          <Badge className={getJobStatusColor(job.status)}>
                            {formatJobStatus(job.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{job.applicationsCount}</TableCell>
                        <TableCell>
                          {job.postedDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {job.location}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleJobAction(job.id, "view")}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleJobAction(job.id, "edit")}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Job
                              </DropdownMenuItem>
                              {job.status === JobStatus.ACTIVE && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleJobAction(job.id, "close")
                                  }
                                  className="text-red-600"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Close Job
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Recent Applications
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#1967d2] hover:text-[#1557b8]"
              >
                View All Applications
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationList.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={application.candidateAvatar}
                          alt={application.candidateName}
                        />
                        <AvatarFallback>
                          {getInitials(application.candidateName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {application.candidateName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {application.position}
                        </p>
                        <p className="text-xs text-gray-500">
                          {application.applicationDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={getApplicationStatusColor(
                          application.status
                        )}
                      >
                        {formatApplicationStatus(application.status)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleApplicationAction(application.id, "view")
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          {application.status ===
                            ApplicationStatus.PENDING_REVIEW && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleApplicationAction(
                                    application.id,
                                    "accept"
                                  )
                                }
                                className="text-green-600"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Accept
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleApplicationAction(
                                    application.id,
                                    "reject"
                                  )
                                }
                                className="text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Analytics Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application Trends Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Application Trends
                </CardTitle>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                    <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                    <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="w-full h-full min-h-[300px]"
                >
                  <LineChart data={trendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="formattedDate"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#e0e0e0" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#e0e0e0" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#1967d2"
                      strokeWidth={3}
                      dot={{ fill: "#1967d2", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#1967d2", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Job Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Job Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="w-full h-full min-h-[300px]"
                >
                  <BarChart
                    data={analyticsData.jobPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="jobTitle"
                      tick={{ fontSize: 11 }}
                      tickLine={{ stroke: "#e0e0e0" }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#e0e0e0" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="applications"
                      fill="#1967d2"
                      radius={[4, 4, 0, 0]}
                      name="Applications"
                    />
                    <Bar
                      dataKey="views"
                      fill="#e0eeff"
                      radius={[4, 4, 0, 0]}
                      name="Views"
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
