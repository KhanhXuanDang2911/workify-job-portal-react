import { useState } from "react";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { authService } from "@/services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AccountSettingTab() {
  return (
    <div className="bg-white p-5 rounded-lg">
      <ChangePasswordForm
        userType="seeker"
        className="max-w-md"
      />
    </div>
  );
}