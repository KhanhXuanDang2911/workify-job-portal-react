import { Star, Briefcase, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobApplicationTabProps {
  candidate: any;
}

export function JobApplicationTab({ candidate }: JobApplicationTabProps) {
  const hiringStages = [
    { id: "applying", label: "Applying", active: true },
    { id: "screening", label: "Screening", active: false },
    { id: "interview", label: "Interview", active: false },
    { id: "test", label: "Test", active: false },
    { id: "onboarding", label: "Onboarding", active: false },
  ];

  const scoreBreakdown = [
    { stage: "Applying", score: 3, color: "bg-yellow-400" },
    { stage: "Screening", score: 4, color: "bg-yellow-400" },
    { stage: "Interview", score: 0, color: "bg-gray-200" },
    { stage: "Test", score: 0, color: "bg-gray-200" },
    { stage: "Onboarding", score: 0, color: "bg-gray-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Hiring Process */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Hiring Process</h3>
          <Button
            size="sm"
            className="bg-gray-800 hover:bg-gray-900 text-white"
          >
            Move Stage →
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="flex justify-between mb-2">
            {hiringStages.map((stage, index) => (
              <div key={stage.id} className="flex-1 text-center">
                <span
                  className={`text-xs ${stage.active ? "text-gray-900 font-medium" : "text-gray-400"}`}
                >
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-blue-500 rounded-full"
              style={{ width: "20%" }}
            />
          </div>
        </div>
      </div>

      {/* Candidate Score */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Candidate Score</h3>

        <div className="flex items-start gap-6">
          {/* Overall Score */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">3.5</div>
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= 3 ? "fill-yellow-400 text-yellow-400" : star === 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">Overall score</p>
          </div>

          {/* Score Breakdown */}
          <div className="flex-1 space-y-2">
            {scoreBreakdown.map((item) => (
              <div key={item.stage} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24">{item.stage}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{
                      width:
                        item.score > 0 ? `${(item.score / 5) * 100}%` : "0%",
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8 text-right">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Applied */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Jobs Applied</h3>
          <button className="text-sm text-blue-600 hover:underline">
            View details →
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Research and Development Officer
            </h4>

            <div className="flex gap-2 mb-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Fulltime
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Jogja
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                Onsite
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Experience in Years</p>
                <p className="font-medium text-gray-900">4 Years</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Current Employer</p>
                <p className="font-medium text-gray-900">Acme Studio</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Current Salary</p>
                <p className="font-medium text-gray-900">6.000.000 IDR</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Expected Salary</p>
                <p className="font-medium text-gray-900">8.000.000 IDR</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Reffered by</p>
                <p className="font-medium text-gray-400">No Referral</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Score Card</h3>

        <div className="space-y-3">
          <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                Relevant Education
              </h4>
              <p className="text-sm text-gray-600">
                Assess the candidate's educational background and qualifications
                that are candidate possesses
              </p>
            </div>
            <button className="text-blue-600 hover:text-blue-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
