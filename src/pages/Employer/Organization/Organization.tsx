import CompanyProfile from "./components/CompanyProfile";

const Organization = () => {
  return (
    <div className="bg-sky-50 min-h-[calc(100vh-64px)] overflow-y-auto flex-1">
      <div className="mx-auto max-w-7xl px-4 mt-4">
        <div className="mb-3 bg-white px-5 border py-3">
          <h1 className="text-2xl font-bold text-[#1967d2] mb-2">
            Company Profile
          </h1>
          <p className="text-gray-600">
            Manage your company information and profile.
          </p>
        </div>

        <CompanyProfile />
      </div>
    </div>
  );
};

export default Organization;
