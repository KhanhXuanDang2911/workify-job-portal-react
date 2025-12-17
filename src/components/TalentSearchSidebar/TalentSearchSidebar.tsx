import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Atom,
  Baby,
  BookHeart,
  BookPlus,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Gem,
  Globe,
  GraduationCap,
  Grid,
  Laugh,
  List,
  School,
  Search,
  Shapes,
  Trash2,
  UserStar,
  X,
  XIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { set } from "nprogress";
import {
  initialCareerLevelOptions,
  initialEducationLevelOptions,
  initialExperienceLevelOptions,
  initialJobCategoryOptions,
  initialJobPostingOptions,
  initialLanguageOptions,
  initialMajorOptions,
  initialPositionTypeOptions,
  initialResumePostedWithinOptions,
  initialSalary,
  schools,
} from "@/components/TalentSearchSidebar/TalentSearchSidebarMockData";
// import type { TalentFilters } from "@/pages/Employer/SearchTalents/SearchTalents.type";
type TalentFilters = any; // Temporary type until SearchTalents.type is created

interface TalentSearchSidebarProps {
  filters: TalentFilters;
  onFilterChange: (key: keyof TalentFilters, value: any) => void;
  onClearFilters: () => void;
}

export default function TalentSearchSidebar({
  filters,
  onFilterChange,
  onClearFilters,
}: TalentSearchSidebarProps) {
  const [jobCategoryOptions, setCategoryOptions] = useState(
    initialJobCategoryOptions
  );
  const [jobPostingOptions, setJobPostingOptions] = useState(
    initialJobPostingOptions
  );
  const [experienceLevelOptions, setExperienceLevelOptions] = useState(
    initialExperienceLevelOptions
  );
  const [careerLevelOptions, setCareerLevelOptions] = useState(
    initialCareerLevelOptions
  );
  const [positionTypeOptions, setPositionTypeOptions] = useState(
    initialPositionTypeOptions
  );
  const [educationLevelOptions, setEducationLevelOptions] = useState(
    initialEducationLevelOptions
  );
  const [schoolOptions, setSchoolOptions] = useState(schools);
  const [majorOptions, setMajorOptions] = useState(initialMajorOptions);
  const [languageOptions, setLanguageOptions] = useState(
    initialLanguageOptions
  );
  const [resumePostedWithinOptions, setResumePostedWithinOptions] = useState(
    initialResumePostedWithinOptions
  );
  const [searchJobPosting, setSearchJobPosting] = useState("");
  const [searchJobCategory, setSearchJobCategory] = useState("");
  const [searchSchool, setSearchSchool] = useState("");
  const [searchMajor, setSearchMajor] = useState("");
  const [salary, setSalary] = useState<{
    min: number;
    max: number;
    includeNoSalaryData: boolean;
  }>(initialSalary);

  const [isSalaryPopoverOpen, setIsSalaryPopoverOpen] = useState(false);
  return (
    <div className="bg-white p-6 space-y-6 rounded-lg">
      <div className="space-y-4">
        {/* Filter by job posting */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Grid className="w-4 h-4" />
            Filter by job posting:
          </Label>
          <Select
            value={filters.jobPosting?.name}
            onValueChange={(value) => onFilterChange("jobPosting", value)}
          >
            <SelectTrigger className="w-full !text-gray-500">
              <SelectValue placeholder="Job Posting" />
            </SelectTrigger>
            <SelectContent className="w-64 p-0">
              <div className="p-4">
                <div className="relative mb-3">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    color="#1967d2"
                  />
                  <Input
                    placeholder="Search"
                    className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pr-10"
                    value={searchJobPosting}
                    onChange={(event) => {
                      setSearchJobPosting(event.target.value);
                      if (event.target.value === "") {
                        setJobPostingOptions(initialJobPostingOptions);
                        return;
                      }
                      const filtered = jobPostingOptions.filter((option) =>
                        option.name
                          .toLowerCase()
                          .includes(event.target.value.toLowerCase())
                      );
                      setJobPostingOptions(filtered);
                    }}
                  />
                  {searchJobPosting && (
                    <XIcon
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      color="#1967d2"
                      onClick={() => {
                        setSearchJobPosting("");
                        setJobPostingOptions(initialJobPostingOptions);
                      }}
                    />
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {jobPostingOptions.length > 0 ? (
                    jobPostingOptions.map((jobPoting) => (
                      <SelectItem
                        key={jobPoting.id}
                        value={jobPoting.name}
                        className="focus:bg-sky-200 focus:text-[#1967d2]"
                      >
                        {jobPoting.name}{" "}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      No job posting found.
                    </div>
                  )}
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Job categories */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Shapes className="w-4 h-4" />
            Job categories
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-between w-full bg-transparent text-gray-500 "
              >
                Job categories
                {filters.jobCategories && filters.jobCategories.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-[#1967d2] text-white"
                  >
                    {filters.jobCategories.length}
                  </Badge>
                )}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 ">
              <div className="p-4">
                <div className="relative mb-3">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    color="#1967d2"
                  />
                  <Input
                    placeholder="Search"
                    className="pl-10 pr-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    value={searchJobCategory}
                    onChange={(event) => {
                      setSearchJobCategory(event.target.value);
                      if (event.target.value === "") {
                        setCategoryOptions(initialJobCategoryOptions);
                        return;
                      }
                      const filtered = initialJobCategoryOptions.filter(
                        (option) =>
                          option.name
                            .toLowerCase()
                            .includes(event.target.value.toLowerCase())
                      );
                      setCategoryOptions(filtered);
                    }}
                  />
                  {searchJobCategory && (
                    <XIcon
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      color="#1967d2"
                      onClick={() => {
                        setSearchJobCategory("");
                        setCategoryOptions(initialJobCategoryOptions);
                      }}
                    />
                  )}
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {jobCategoryOptions &&
                    jobCategoryOptions.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2 hover:bg-sky-200 hover:text-[#1967d2] rounded-xl p-2"
                      >
                        <Checkbox
                          className=" border-gray-300 size-5"
                          id={category.id}
                          checked={filters.jobCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            const newCategories = checked
                              ? [...filters.jobCategories, category]
                              : filters.jobCategories.filter(
                                  (c: any) => c.id !== category.id
                                );
                            onFilterChange("jobCategories", newCategories);
                          }}
                        />
                        <label
                          htmlFor={category.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator />

        {/* Experience level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Gem className="w-4 h-4" />
            Experience level
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-between w-full bg-transparent text-gray-500 "
              >
                Experience level
                {filters.experienceLevel &&
                  filters.experienceLevel.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-[#1967d2] text-white"
                    >
                      {filters.experienceLevel.length}
                    </Badge>
                  )}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 max-h-64 overflow-y-auto">
              <div className="p-4">
                <div className="space-y-1">
                  {experienceLevelOptions &&
                    experienceLevelOptions.map((experienceLevel) => (
                      <div
                        key={experienceLevel.id}
                        className="flex items-center space-x-2 hover:bg-sky-200 hover:text-[#1967d2] rounded-xl p-2"
                      >
                        <Checkbox
                          className=" border-gray-300 size-5"
                          id={experienceLevel.id}
                          checked={filters.experienceLevel.includes(
                            experienceLevel
                          )}
                          onCheckedChange={(checked) => {
                            const newExperienceLevels = checked
                              ? [...filters.experienceLevel, experienceLevel]
                              : filters.experienceLevel.filter(
                                  (c: any) => c.id !== experienceLevel.id
                                );
                            onFilterChange(
                              "experienceLevel",
                              newExperienceLevels
                            );
                          }}
                        />
                        <label
                          htmlFor={experienceLevel.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {experienceLevel.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator />

        {/* Career level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Laugh className="w-4 h-4" />
            Career level
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-between w-full bg-transparent text-gray-500 "
              >
                Career level
                {filters.careerLevel && filters.careerLevel.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-[#1967d2] text-white"
                  >
                    {filters.careerLevel.length}
                  </Badge>
                )}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 max-h-64 overflow-y-auto">
              <div className="p-4">
                <div className="space-y-1">
                  {careerLevelOptions &&
                    careerLevelOptions.map((careerLevel) => (
                      <div
                        key={careerLevel.id}
                        className="flex items-center space-x-2 hover:bg-sky-200 hover:text-[#1967d2] rounded-xl p-2"
                      >
                        <Checkbox
                          className=" border-gray-300 size-5"
                          id={careerLevel.id}
                          checked={filters.careerLevel.includes(careerLevel)}
                          onCheckedChange={(checked) => {
                            const newCareerLevels = checked
                              ? [...filters.careerLevel, careerLevel]
                              : filters.careerLevel.filter(
                                  (c: any) => c.id !== careerLevel.id
                                );
                            onFilterChange("careerLevel", newCareerLevels);
                          }}
                        />
                        <label
                          htmlFor={careerLevel.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {careerLevel.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator />

        {/* Salary range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            <CircleDollarSign className="w-4 h-4" />
            Salary range
          </Label>
          <Popover
            open={isSalaryPopoverOpen}
            onOpenChange={setIsSalaryPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-between w-full bg-transparent text-gray-500 "
              >
                Salary range
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <div className="">
                  <div className="text-sm font-medium text-gray-700 mb-7">
                    Salary (monthly)
                  </div>
                  <Slider
                    className="mb-7 w-full"
                    value={[salary.min || 1, salary.max || 100]}
                    rangeColor="bg-[#1967d2]"
                    onValueChange={(value) => {
                      setSalary({ ...salary, min: value[0], max: value[1] });
                    }}
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">MIN</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        min={1}
                        value={salary.min}
                        onChange={(e) => {
                          const v = Number(e.target.value) || 1;
                          setSalary({ ...salary, min: v });
                        }}
                        className="w-14 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                      />
                      <div className="text-sm text-gray-500">million</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-xs text-gray-500">MAX</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        min={1}
                        value={salary.max}
                        placeholder="No Limit"
                        onChange={(e) => {
                          const v = Number(e.target.value) || 1;
                          setSalary({ ...salary, max: v });
                        }}
                        className="w-14 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                      />
                      <div className="text-sm text-gray-500">
                        {salary.max === null ? "" : "million"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-no-salary"
                    checked={salary.includeNoSalaryData}
                    onCheckedChange={(checked) => {
                      const includeNoSalary = checked ? true : false;
                      setSalary({
                        ...salary,
                        includeNoSalaryData: includeNoSalary,
                      });
                    }}
                  />
                  <label
                    htmlFor="include-no-salary"
                    className="text-sm text-gray-700"
                  >
                    Include resumes with no salary data
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    className="bg-[#1967d2]  hover:bg-[#1251a3] text-white"
                    variant="default"
                    onClick={() => {
                      onFilterChange("salary", salary);
                      setIsSalaryPopoverOpen(false);
                    }}
                  >
                    Apply
                  </Button>

                  <button
                    type="button"
                    className="flex items-center text-sm text-red-500 hover:underline gap-2"
                    onClick={() => {
                      setSalary(initialSalary);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator />

        {/* Position type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <BookPlus className="w-4 h-4" />
            Position type
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-between w-full bg-transparent text-gray-500 "
              >
                Position type
                {filters.positionType && filters.positionType.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-[#1967d2] text-white"
                  >
                    {filters.positionType.length}
                  </Badge>
                )}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 max-h-64 overflow-y-auto">
              <div className="p-4">
                <div className="space-y-1">
                  {positionTypeOptions &&
                    positionTypeOptions.map((positionType) => (
                      <div
                        key={positionType.id}
                        className="flex items-center space-x-2 hover:bg-sky-200 hover:text-[#1967d2] rounded-xl p-2"
                      >
                        <Checkbox
                          className=" border-gray-300 size-5"
                          id={positionType.id}
                          checked={filters.positionType.includes(positionType)}
                          onCheckedChange={(checked) => {
                            const newPositionTypes = checked
                              ? [...filters.positionType, positionType]
                              : filters.positionType.filter(
                                  (c: any) => c.id !== positionType.id
                                );
                            onFilterChange("positionType", newPositionTypes);
                          }}
                        />
                        <label
                          htmlFor={positionType.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {positionType.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator />

        {/* Education level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Education level
          </Label>
          <Select
            value={filters.educationLevel.name}
            onValueChange={(value) =>
              onFilterChange("educationLevel", {
                ...filters.educationLevel,
                name: value,
              })
            }
          >
            <SelectTrigger className="w-full !text-gray-500">
              <SelectValue placeholder="Education level" />
            </SelectTrigger>
            <SelectContent className="w-64 p-0 ">
              <div className="p-4 max-h-64 overflow-y-auto">
                {educationLevelOptions.length > 0 ? (
                  educationLevelOptions.map((educationLevel) => (
                    <SelectItem
                      key={educationLevel.id}
                      value={educationLevel.name}
                      className="focus:bg-sky-200 focus:text-[#1967d2]"
                    >
                      {educationLevel.name}{" "}
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    No job posting found.
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 p-2 border-t border-gray-200">
                <Checkbox
                  id="include-no-salary"
                  checked={filters.educationLevel.includeHigherDegrees}
                  onCheckedChange={(checked) => {
                    const includeNoSalary = checked ? true : false;
                    onFilterChange("educationLevel", {
                      ...filters.educationLevel,
                      includeHigherDegrees: includeNoSalary,
                    });
                  }}
                />
                <label
                  htmlFor="include-no-salary"
                  className="text-sm text-gray-700"
                >
                  Include higher degrees
                </label>
              </div>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* School */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <School className="w-4 h-4" />
            School
          </Label>
          <Select
            value={filters.school}
            onValueChange={(value) => onFilterChange("school", value)}
          >
            <SelectTrigger className="w-full !text-gray-500">
              <SelectValue placeholder="School" />
            </SelectTrigger>
            <SelectContent className="p-0 max-h-64 min-w-[calc(224px*3+32px)]">
              <div className="p-4">
                <div className="relative mb-3">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    color="#1967d2"
                  />
                  <Input
                    placeholder="Search"
                    className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pr-10"
                    value={searchSchool}
                    onChange={(event) => {
                      setSearchSchool(event.target.value);
                      if (event.target.value === "") {
                        setSchoolOptions(schools);
                        return;
                      }
                      const filtered = schools
                        .map((group) => ({
                          region: group.region,
                          schools: group.schools.filter((school) =>
                            school.name
                              .toLowerCase()
                              .includes(event.target.value.toLowerCase())
                          ),
                        }))
                        .filter((group) => group.schools.length > 0);
                      setSchoolOptions(filtered);
                    }}
                  />
                  {searchSchool && (
                    <XIcon
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      color="#1967d2"
                      onClick={() => {
                        setSearchSchool("");
                        setSchoolOptions(schools);
                      }}
                    />
                  )}
                </div>
                <div className="flex">
                  {schoolOptions.length > 0 ? (
                    schoolOptions.map((item, index) => (
                      <SelectGroup key={index}>
                        <SelectLabel>{item.region}</SelectLabel>
                        <div className="max-h-40 w-64 overflow-y-auto">
                          {item.schools.map((school) => (
                            <SelectItem
                              key={school.id}
                              value={school.name}
                              className="focus:bg-sky-200 focus:text-[#1967d2]"
                            >
                              {school.name}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectGroup>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      No school found.
                    </div>
                  )}
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Major */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Atom className="w-4 h-4" />
            Major
          </Label>
          <Select
            value={filters.major}
            onValueChange={(value) => onFilterChange("major", value)}
          >
            <SelectTrigger className="w-full !text-gray-500">
              <SelectValue placeholder="Major" />
            </SelectTrigger>
            <SelectContent className="w-64 p-0">
              <div className="p-4">
                <div className="relative mb-3">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    color="#1967d2"
                  />
                  <Input
                    placeholder="Search"
                    className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pr-10"
                    value={searchMajor}
                    onChange={(event) => {
                      setSearchMajor(event.target.value);
                      if (event.target.value === "") {
                        setMajorOptions(initialMajorOptions);
                        return;
                      }
                      const filtered = majorOptions.filter((option) =>
                        option.name
                          .toLowerCase()
                          .includes(event.target.value.toLowerCase())
                      );
                      setMajorOptions(filtered);
                    }}
                  />
                  {searchMajor && (
                    <XIcon
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      color="#1967d2"
                      onClick={() => {
                        setSearchMajor("");
                        setMajorOptions(initialMajorOptions);
                      }}
                    />
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {majorOptions.length > 0 ? (
                    majorOptions.map((major) => (
                      <SelectItem
                        key={major.id}
                        value={major.name}
                        className="focus:bg-sky-200 focus:text-[#1967d2]"
                      >
                        {major.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No major found.</div>
                  )}
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Language level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Language level
          </Label>
          <Select
            value={filters.languageLevel}
            onValueChange={(value) => onFilterChange("languageLevel", value)}
          >
            <SelectTrigger className="w-full !text-gray-500">
              <SelectValue placeholder="Language level" />
            </SelectTrigger>
            <SelectContent className="w-64 p-0">
              <div className="p-4">
                <div className="max-h-64 overflow-y-auto">
                  {languageOptions.map((language) => (
                    <SelectItem
                      key={language.id}
                      value={language.name}
                      className="focus:bg-sky-200 focus:text-[#1967d2]"
                    >
                      {language.name}
                    </SelectItem>
                  ))}
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Gender */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <UserStar className="w-4 h-4" />
            Gender
          </Label>
          <div className="flex gap-2">
            <Button
              variant={filters.gender === "any" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("gender", "any")}
              className={`flex-1 hover:bg-[#e3eefc] ${filters.gender === "any" ? "bg-[#1967d2] hover:bg-[#1967d2]" : ""}`}
            >
              Any
            </Button>
            <Button
              variant={filters.gender === "male" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("gender", "male")}
              className={`flex-1 hover:bg-[#e3eefc] ${filters.gender === "male" ? "bg-[#1967d2] hover:bg-[#1967d2]" : ""}`}
            >
              Male
            </Button>
            <Button
              variant={filters.gender === "female" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("gender", "female")}
              className={`flex-1 hover:bg-[#e3eefc] ${filters.gender === "female" ? "bg-[#1967d2] hover:bg-[#1967d2]" : ""}`}
            >
              Female
            </Button>
          </div>
        </div>

        <Separator />

        {/* Marital Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <BookHeart className="w-4 h-4" />
            Marital Status
          </Label>
          <div className="flex gap-2">
            <Button
              variant={filters.maritalStatus === "any" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("maritalStatus", "any")}
              className={`flex-1 hover:bg-[#e3eefc] ${filters.maritalStatus === "any" ? "bg-[#1967d2] hover:bg-[#1967d2]" : ""}`}
            >
              Any
            </Button>
            <Button
              variant={
                filters.maritalStatus === "single" ? "default" : "outline"
              }
              size="sm"
              onClick={() => onFilterChange("maritalStatus", "single")}
              className={`flex-1 hover:bg-[#e3eefc] ${filters.maritalStatus === "single" ? "bg-[#1967d2] hover:bg-[#1967d2]" : ""}`}
            >
              Single
            </Button>
            <Button
              variant={
                filters.maritalStatus === "married" ? "default" : "outline"
              }
              size="sm"
              onClick={() => onFilterChange("maritalStatus", "married")}
              className={`flex-1 hover:bg-[#e3eefc] ${filters.maritalStatus === "married" ? "bg-[#1967d2] hover:bg-[#1967d2]" : ""}`}
            >
              Married
            </Button>
          </div>
        </div>

        <Separator />

        {/* Age */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Baby className="w-4 h-4" />
            Age
          </Label>
          <Slider
            value={filters.ageRange}
            rangeColor="bg-[#1967d2]"
            onValueChange={(value) => onFilterChange("ageRange", value)}
            min={15}
            max={70}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{filters.ageRange[0]}</span>
            <span>{filters.ageRange[1]}</span>
          </div>
        </div>

        <Separator />

        {/* Resume posted within */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Resume posted within
          </Label>
          <Select
            value={filters.resumePostedWithin}
            onValueChange={(value) =>
              onFilterChange("resumePostedWithin", value)
            }
          >
            <SelectTrigger className="w-full !text-gray-500">
              <SelectValue placeholder="Resume posted within" />
            </SelectTrigger>
            <SelectContent className="w-64 p-0">
              <div className="p-4">
                <div className="max-h-64 overflow-y-auto">
                  {resumePostedWithinOptions.map((resumePostedWithin) => (
                    <SelectItem
                      key={resumePostedWithin.id}
                      value={resumePostedWithin.name}
                      className="focus:bg-sky-200 focus:text-[#1967d2]"
                    >
                      {resumePostedWithin.name}
                    </SelectItem>
                  ))}
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
