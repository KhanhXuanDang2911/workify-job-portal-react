import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyProfile from "./components/CompanyProfile";
import Members from "./components/Members";

const Organization = () => {
  return (
    <div className="bg-sky-50 min-h-[calc(100vh-64px)] overflow-y-auto flex-1">
      <div className="mx-auto max-w-7xl px-4 mt-4">
        <div className="mb-3 bg-white  px-5 border py-3 ">
          <h1 className="text-2xl font-bold text-[#1967d2] mb-2">Organization</h1>
          <p className="text-gray-600">Manage and operate your company.</p>
        </div>

        <Tabs defaultValue="company-profile" className="w-full">
          <TabsList className="mb-2 bg-white border border-[#1967d2] rounded-none h-auto p-0">
            <TabsTrigger
              value="company-profile"
              className="data-[state=active]:bg-[#1967d2] data-[state=active]:border-[#1967d2] data-[state=active]:text-white rounded-none px-4 py-2 text-base font-medium"
            >
              Company Profile
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-[#1967d2] data-[state=active]:border-[#1967d2] data-[state=active]:text-white rounded-none px-4 py-2 text-base font-medium"
            >
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company-profile">
            <CompanyProfile />
          </TabsContent>

          <TabsContent value="members">
            <Members />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Organization;
