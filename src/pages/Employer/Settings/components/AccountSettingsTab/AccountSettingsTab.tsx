import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

interface AccountInformation {
  avatarUrl: string;
  fullName: string;
  email: string;
  username: string;
  phoneNumber: string;
  bio: string;
}

interface AccountSettingsTabProps {
  accountInformation: AccountInformation;
  setAccountInformation: any;
}
export default function AccountSettingsTab({
  accountInformation,
  setAccountInformation,
}: AccountSettingsTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileImage, setProfileImage] = useState<string>(
    accountInformation.avatarUrl || ""
  );
  const [fullName, setFullName] = useState<string>(
    accountInformation.fullName || ""
  );
  const [email, setEmail] = useState<string>(accountInformation.email || "");
  const [username, setUsername] = useState<string>(
    accountInformation.username || ""
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    accountInformation.phoneNumber || ""
  );
  const [bio, setBio] = useState<string>(accountInformation.bio || "");

  useEffect(() => {
    setProfileImage(accountInformation.avatarUrl || "");
    setFullName(accountInformation.fullName || "");
    setEmail(accountInformation.email || "");
    setUsername(accountInformation.username || "");
    setPhoneNumber(accountInformation.phoneNumber || "");
    setBio(accountInformation.bio || "");
  }, [accountInformation]);

  const handleUploadNew = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfileImage("");
  };

  return (
    <div className="space-y-6 flex-1">
      {/* Profile Picture Section */}
      <div>
        <Label className="text-gray-600 mb-3 block">Your Profile Picture</Label>
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={profileImage || "/placeholder.svg"}
              alt={fullName}
            />
            <AvatarFallback className="bg-purple-500 text-white text-2xl font-semibold">
              {fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-3">
            <Button
              onClick={handleUploadNew}
              className="bg-[#1967d2] hover:bg-[#1557b0] text-white"
            >
              Upload New
            </Button>
            <Button
              onClick={handleRemoveProfilePicture}
              variant="outline"
              className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] bg-transparent"
            >
              Remove Profile Picture
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            Email address
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-green-500 text-xs font-normal">Verified</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="flex items-center gap-2">
            Phone number
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-green-500 text-xs font-normal">Verified</span>
          </Label>
          <div className="">
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] resize-none"
        />
      </div>

      <div>
        <Button className="bg-[#1967d2] hover:bg-[#1557b0] text-white px-8">
          Update Profile
        </Button>
      </div>
    </div>
  );
}
