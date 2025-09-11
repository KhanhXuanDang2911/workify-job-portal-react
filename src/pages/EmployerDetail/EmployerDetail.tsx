import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import JobCard from "@/components/JobCard";
import {
  MapPin,
  PhoneCall,
  Mail,
  DollarSign,
  Briefcase,
  UserRound,
  Trophy,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Home,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
} from "lucide-react";
import { useState } from "react";

// Mock data for available jobs
const availableJobs = [
  {
    id: 1,
    title: "Senior Web Designer",
    company: "Galaxy Software Development",
    location: "1363-1385 Sunset Blvd Los Angeles, CA 90026, USA",
    salary: "$1000",
    period: "Month",
    type: "New",
    typeColor: "bg-green-500",
    posted: "1 days ago",
    dateUpdated: new Date("2024-01-15"),
    datePosted: new Date("2024-01-14"),
    expiresAt: new Date("2024-02-14"),
    logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic1.jpg",
  },
  {
    id: 2,
    title: "Senior Stock Technician",
    company: "Galaxy Software Development",
    location: "1363-1385 Sunset Blvd Los Angeles, CA 90026, USA",
    salary: "$1000",
    period: "Month",
    type: "Intership",
    typeColor: "bg-orange-500",
    posted: "15 days ago",
    dateUpdated: new Date("2024-01-10"),
    datePosted: new Date("2024-01-01"),
    expiresAt: new Date("2024-01-20"),
    logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic1.jpg",
  },
  {
    id: 3,
    title: "IT Department Manager",
    company: "Galaxy Software Development",
    location: "1363-1385 Sunset Blvd Los Angeles, CA 90026, USA",
    salary: "$1000",
    period: "Month",
    type: "Fulltime",
    typeColor: "bg-purple-500",
    posted: "6 Month ago",
    dateUpdated: new Date("2023-12-15"),
    datePosted: new Date("2023-07-15"),
    expiresAt: new Date("2024-03-15"),
    logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic1.jpg",
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "Galaxy Software Development",
    location: "1363-1385 Sunset Blvd Los Angeles, CA 90026, USA",
    salary: "$800",
    period: "Month",
    type: "Fulltime",
    typeColor: "bg-blue-500",
    posted: "3 days ago",
    dateUpdated: new Date("2024-01-12"),
    datePosted: new Date("2024-01-12"),
    expiresAt: new Date("2024-02-12"),
    logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic1.jpg",
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "Galaxy Software Development",
    location: "1363-1385 Sunset Blvd Los Angeles, CA 90026, USA",
    salary: "$900",
    period: "Month",
    type: "Remote",
    typeColor: "bg-green-600",
    posted: "1 week ago",
    dateUpdated: new Date("2024-01-08"),
    datePosted: new Date("2024-01-08"),
    expiresAt: new Date("2024-02-08"),
    logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic1.jpg",
  },
];

// Mock data for office photos
const officePhotos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1690378820474-b468b8ee64d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHx0ZWFtJTIwb2ZmaWNlJTIwY29sbGFib3JhdGlvbiUyMHdvcmtwbGFjZXxlbnwwfDB8fHwxNzU3NTY4NzYyfDA&ixlib=rb-4.1.0&q=85",
    alt: "Diverse team working together - Lyubomyr (Lou) Reverchuk on Unsplash",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1616992510024-f1293eb00e41?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHxjb25mZXJlbmNlJTIwbWVldGluZyUyMGRpc2N1c3Npb24lMjBwcm9mZXNzaW9uYWxzfGVufDB8MHx8fDE3NTc1Njg3NjJ8MA&ixlib=rb-4.1.0&q=85",
    alt: "Business professionals in meeting - Akeyodia - Business Coaching Firm on Unsplash",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGJyYWluc3Rvcm1pbmclMjBjb2xsYWJvcmF0aW9ufGVufDB8MHx8fDE3NTc1Njg3NjJ8MA&ixlib=rb-4.1.0&q=85",
    alt: "Creative workspace collaboration - Walls.io on Unsplash",
  },
];

export default function EmployerDetail() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("dateUpdated");
  const jobsPerPage = 3;

  const sortedJobs = [...availableJobs].sort((a, b) => {
    switch (sortBy) {
      case "dateUpdated":
        return b.dateUpdated.getTime() - a.dateUpdated.getTime();
      case "datePosted":
        return b.datePosted.getTime() - a.datePosted.getTime();
      case "expireSoon":
        return a.expiresAt.getTime() - b.expiresAt.getTime();
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-xl opacity-60 animate-float-gentle"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-lg opacity-50 animate-float-gentle-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-2xl opacity-40 animate-breathe"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-xl opacity-45 animate-float-gentle"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-2xl opacity-35 animate-breathe"></div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-cyan-200 via-blue-100 to-transparent opacity-70"></div>
        <div className="absolute top-0 left-0 w-64 h-24 bg-gradient-to-r from-purple-100 to-transparent opacity-50"></div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Home className="w-4 h-4" />
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Home
            </span>
            <span>→</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Employers
            </span>
            <span>→</span>
            <span className="text-blue-600 font-medium">Employer Details</span>
          </div>

          {/* Back Button */}
          <Button
            variant="outline"
            className="mb-4 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Employers
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Company Image and Info */}
            <div className="lg:col-span-2">
              <div className="relative h-80 rounded-lg overflow-hidden mb-6">
                <img
                  src="https://thewebmax.org/react/jobzilla/assets/images/employer-bg.jpg"
                  alt="Professional business meeting"
                  className="w-full h-full object-cover"
                />

                {/* Company logo positioned at bottom left */}
                <div className="absolute bottom-6 left-6">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-lg border">
                    <img
                      src="https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic1.jpg"
                      alt=""
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons positioned below the image */}
              <div className="flex space-x-3 mb-6">
                <Button
                  variant="outline"
                  className="text-blue-600 hover:bg-blue-50 border border-blue-200 bg-transparent"
                >
                  Add Review
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Follow Us
                </Button>
              </div>

              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Galaxy Software Development
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  <span>100-500 employees</span>
                </div>
                <a
                  href="https://thewebmax.com"
                  className="text-blue-600 hover:underline"
                >
                  https://thewebmax.com
                </a>
              </div>

              {/* About Company Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  About Company
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    UUt enim ad minima veniam, quis nostrum exercitationem ullam
                    corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                    consequatur? Quis autem vel eum iure reprehenderit qui in ea
                    voluptate velit esse quam nihil molestiae consequatur, vel
                    illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                  </p>
                  <p>
                    At vero eos et accusamus et iusto odio dignissimos ducimus
                    qui blanditiis praesentium voluptatum deleniti atque
                    corrupti quos dolores et quas molestias excepturi sint
                    occaecati cupiditate non provident, similique sunt in culpa
                    qui officia deserunt mollitia animi.
                  </p>
                  <p>
                    Opossum but dramatically despite expeditiously that jeepers
                    loosely yikes that as or eel underneath kept and slept
                    compactly far purred sure abidingly up above fitting to
                    strident wiped set waywardly far the and pangolin horse
                    approving paid chuckled cassowary oh above a much opposite
                    far much hypothetically more therefore wasp less that hey
                    apart well like while superbly orca and far hence one.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Location and Profile Info Sidebars */}
            <div className="lg:col-span-1 space-y-6">
              {/* Location Section */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-60"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">
                    Location
                  </h3>
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">LoanCenter</div>
                    <div className="font-medium text-gray-900">
                      1363 W Sunset Blvd
                    </div>
                    <a
                      href="#"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View larger map
                    </a>
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <iframe
                      src="https://maps.google.com/maps?width=100%25&height=400&hl=en&q=1363%20W%20Sunset%20Blvd%20Los%20Angeles%20CA%2090026&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                      width="100%"
                      height="300"
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="border-0"
                    />
                  </div>
                </div>
              </Card>

              {/* Profile Info Section */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-60"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">
                    Profile Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Offered Salary</p>
                        <p className="font-medium text-gray-900">$20 / Day</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-medium text-gray-900">6 Year</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <UserRound className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-medium text-gray-900">Male</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <PhoneCall className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">
                          +291 560 56456
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">
                          thewebmaxdemo@gmail.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Trophy className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Qualification</p>
                        <p className="font-medium text-gray-900">Developer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Jobs */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/30 opacity-60"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-blue-600">
                    Available Jobs ({availableJobs.length})
                  </h2>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="dateUpdated">Date Updated</option>
                      <option value="datePosted">Date Posted</option>
                      <option value="expireSoon">Expire Soon</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {paginatedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1}-
                      {Math.min(startIndex + jobsPerPage, availableJobs.length)}{" "}
                      of {availableJobs.length} jobs
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Office Photos */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-orange-50/30 opacity-60"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Office Photos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {officePhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="aspect-video rounded-lg overflow-hidden"
                    >
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Share Profile */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 to-pink-50/30 opacity-60"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Share Profile
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                    <Linkedin className="w-4 h-4 mr-2" />
                    Linkedin
                  </Button>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Pinterest
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Empty space to maintain layout consistency */}
          <div className="lg:col-span-1"></div>
        </div>
      </div>
    </div>
  );
}
