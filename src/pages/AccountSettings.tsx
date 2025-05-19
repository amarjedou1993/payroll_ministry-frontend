import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import { RootState } from "@/store";
import {
  AlertCircleIcon,
  BookKeyIcon,
  BriefcaseBusinessIcon,
  Edit3Icon,
  IdCardIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/LoadingSpinner";
import { getUserProfile } from "@/services/auth.service";
import axiosInstance from "@/api/client";
import { IUpdateUser, IUserResponse } from "@/types/types";
import Input from "@/components/ui/Input";

const updateUserProfile = async (
  userId: string,
  data: IUpdateUser
): Promise<IUserResponse> => {
  try {
    const response = await axiosInstance.patch(`/users/${userId}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response.data.message ||
          "Failed to update profile. Please try again."
      );
    }
    throw new Error("An unexpected error occurred while updating the profile.");
  }
};

const AccountSettings = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const isManager = user?.roles[0].name === "Manager";

  // Redirect to login if user or user.id is missing
  useEffect(() => {
    if (!user || !user.id) {
      navigate("/auth", { replace: true });
    }
  }, [user, navigate]);

  // State for edit modes and error messages
  const [editProfile, setEditProfile] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Initialize formData with user data from Redux
  const [formData, setFormData] = useState({
    name: user?.name || "",
    position: user?.position || "",
    username: user?.username || "",
    employeeId: user?.employeeId || "",
  });

  // Form state for password
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile
  const {
    data: userProfile,
    isLoading,
    error: fetchError,
    refetch,
  } = useQuery<IUserResponse | null, Error>({
    queryKey: ["userProfile", user?.id],
    queryFn: getUserProfile,
    enabled: !!user?.id,
    onSuccess: (data) => {
      if (data) {
        setFormData({
          name: data.name || "",
          position: data.position || "",
          username: data.username || "",
          employeeId: data.employeeId || "",
        });
      } else {
        navigate("/auth", { replace: true });
      }
    },
    onError: (error) => {
      console.error(
        "Error fetching user profile in AccountSettings:",
        error.message
      );
      navigate("/auth", { replace: true });
    },
  });

  // Update user profile mutation
  const mutation = useMutation<IUserResponse, Error, IUpdateUser>({
    mutationFn: (data) => updateUserProfile(user?.id || "", data),
    onSuccess: (data, variables) => {
      refetch();
      setEditProfile(false);
      setEditPassword(false);
      setUpdateError(null);
      setPasswordError(null);
      setPasswordData({ newPassword: "", confirmPassword: "" });

      // Show success toast
      if (variables.password) {
        toast.success(
          t("accountSettings.passwordUpdated") ||
            "Password updated successfully!"
          //   {
          //     position: isRtl ? "top-left" : "top-right",
          //   }
        );
      } else {
        toast.success(
          t("accountSettings.profileUpdated") || "Profile updated successfully!"
          //   {
          //     position: isRtl ? "top-left" : "top-right",
          //   }
        );
      }
    },
    onError: (error) => {
      setUpdateError(error.message || t("accountSettings.updateError"));
    },
  });

  // Handle profile form input changes
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password form input changes
  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile form submission
  const handleProfileSubmit = () => {
    const updateData: IUpdateUser = {
      name: formData.name,
      position: formData.position,
      username:
        formData.username !== userProfile?.username
          ? formData.username
          : undefined,
    };
    mutation.mutate(updateData);
  };

  // Handle password form submission
  const handlePasswordSubmit = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t("accountSettings.passwordsDoNotMatch"));
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError(t("accountSettings.passwordTooShort"));
      return;
    }

    const updateData: IUpdateUser = {
      password: passwordData.newPassword,
    };
    mutation.mutate(updateData);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (fetchError) {
    return (
      <div className="p-4 text-center text-red-500">
        {t("accountSettings.errorLoadingUser")}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className={`bg-white rounded-lg shadow-custom-soft p-6 ${
        isRtl ? "font-arabic" : "Inter"
      }`}
      aria-label={t("accountSettings.title") || "Account Settings"}
    >
      <h1
        className={`text-xl font-semibold text-gray-800 mb-6 ${
          isRtl ? "font-arabic" : "Inter"
        }`}
      >
        {t("accountSettings.title") || "Account Settings"}
      </h1>

      {/* My Profile Section */}
      <div className="mb-6 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-lg font-semibold text-gray-700 ${
              isRtl ? "font-arabic" : "Inter"
            }`}
          >
            {t("accountSettings.myProfile") || "My Profile"}
          </h2>
          {!editProfile && (
            <Button
              onClick={() => setEditProfile(true)}
              className="flex items-center gap-1 text-sm text-gray-500"
            >
              <Edit3Icon className="w-4 h-4" />
              {t("accountSettings.edit") || "Edit"}
            </Button>
          )}
        </div>

        {updateError && !editPassword && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {updateError}
          </div>
        )}

        {editProfile ? (
          <div className="space-y-4">
            <div>
              <Input
                label={t("accountSettings.name") || "Name"}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleProfileInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  sm:text-sm"
              />
            </div>
            {!isManager && (
              <div>
                <Input
                  label={t("accountSettings.position") || "Position"}
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleProfileInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  sm:text-sm"
                />
              </div>
            )}
            <div>
              <Input
                label={t("accountSettings.username") || "Username"}
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleProfileInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  sm:text-sm"
              />
            </div>
            <div className="flex gap-2 ">
              <Button
                onClick={handleProfileSubmit}
                className="px-4 py-2  text-white rounded-md shadow-sm "
                disabled={mutation.isLoading}
              >
                {mutation.isLoading
                  ? t("accountSettings.saving") || "Saving..."
                  : t("accountSettings.save") || "Save"}
              </Button>
              <Button
                onClick={() => {
                  setEditProfile(false);
                  setUpdateError(null);
                  setFormData({
                    name: userProfile?.name || user?.name || "",
                    position: userProfile?.position || user?.position || "",
                    username: userProfile?.username || user?.username || "",
                    employeeId:
                      userProfile?.employeeId || user?.employeeId || "",
                  });
                }}
                variant="secondary"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm  focus:outline-none"
              >
                {t("accountSettings.cancel") || "Cancel"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-500">
                {formData.name ? formData.name.charAt(0) : "U"}
              </span>
            </div>
            <div>
              <h3
                className={` font-medium text-gray-700  mb-2 ${
                  isRtl ? "font-arabic" : "Inter"
                }`}
              >
                {formData.name ||
                  t("accountSettings.namePlaceholder") ||
                  "Not Available"}
              </h3>
              {!isManager && (
                <p
                  className={`text-sm  flex items-center gap-1 p-2 bg-green-100 rounded-md text-green-800 mb-2 ${
                    isRtl ? "font-arabic" : "Inter"
                  }`}
                >
                  <BriefcaseBusinessIcon size={20} strokeWidth={1.5} />
                  <span className="font-medium">
                    {formData.position ||
                      t("accountSettings.positionPlaceholder") ||
                      "Not Available"}
                  </span>
                </p>
              )}
              <p
                className={`text-sm  flex items-center gap-1 p-2 bg-indigo-100 rounded-md text-indigo-800 mb-2 ${
                  isRtl ? "font-arabic" : "Inter"
                }`}
              >
                <span className="flex items-center gap-1">
                  <IdCardIcon size={20} strokeWidth={1.5} />
                  {(t("accountSettings.username") || "Username") + ": "}
                </span>
                <span className="font-medium">
                  {formData.username ||
                    t("accountSettings.usernamePlaceholder") ||
                    "Not Available"}
                </span>
              </p>
              {!isManager && (
                <p
                  className={`text-sm  flex items-center gap-1 p-2 bg-yellow-100 rounded-md text-yellow-800 ${
                    isRtl ? "font-arabic" : "Inter"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <BookKeyIcon size={20} strokeWidth={1.5} />
                    {(t("accountSettings.employeeId") || "Employee ID") + ": "}
                  </span>

                  {formData.employeeId ||
                    t("accountSettings.employeeIdPlaceholder") ||
                    "Not Available"}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div className="mb-6 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-lg font-semibold text-gray-700 ${
              isRtl ? "font-arabic" : "Inter"
            }`}
          >
            {t("accountSettings.changePassword") || "Change Password"}
          </h2>
          {!editPassword && (
            <Button
              onClick={() => setEditPassword(true)}
              className="flex items-center gap-1 text-sm text-gray-500"
            >
              <Edit3Icon className="w-4 h-4" />
              {t("accountSettings.edit") || "Edit"}
            </Button>
          )}
        </div>

        {passwordError && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            <AlertCircleIcon size={20} strokeWidth={1.5} />
            {passwordError}
          </div>
        )}

        {editPassword ? (
          <div className="space-y-4">
            <div>
              <Input
                label={t("accountSettings.newPassword") || "New Password"}
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>
            <div>
              <Input
                label={
                  t("accountSettings.confirmPassword") || "Confirm Password"
                }
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-non sm:text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 text-white rounded-md shadow-sm "
                disabled={mutation.isLoading}
              >
                {mutation.isLoading
                  ? t("accountSettings.saving") || "Saving..."
                  : t("accountSettings.save") || "Save"}
              </Button>
              <Button
                onClick={() => {
                  setEditPassword(false);
                  setPasswordError(null);
                  setPasswordData({ newPassword: "", confirmPassword: "" });
                }}
                variant="secondary"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm  focus:outline-none"
              >
                {t("accountSettings.cancel") || "Cancel"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            {t("accountSettings.passwordHidden") ||
              "Password is hidden for security"}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AccountSettings;
