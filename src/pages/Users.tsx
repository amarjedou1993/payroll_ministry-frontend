import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  AlertCircleIcon,
  AlertTriangle,
  Edit3Icon,
  PlusCircleIcon,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/api/client";
import { IUserResponse } from "@/types/types";
import Spinner from "@/components/ui/LoadingSpinner";
import Modal from "@/components/ui/modal/Modal";
import Form from "@/components/ui/form/Form";
import { FormField } from "@/components/ui/form/FormField";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import DataTable, { ColumnDef } from "@/components/ui/datatable/DataTable2";

const fetchUsersWithFilters = async (
  page: number,
  limit: number,
  role?: string,
  search?: string
) => {
  const params = {
    page,
    limit,
    ...(role && { role }),
    ...(search && { search }),
  };

  const response = await axiosInstance.get("/users/paginatedUsers", { params });
  return response.data;
};

const userSchema = z.object({
  username: z.string().min(1, { message: "users.errors.usernameRequired" }),
  password: z.string().min(8, { message: "users.errors.passwordLength" }),
  name: z.string().min(4, { message: "users.errors.nameLength" }),
  employeeId: z.string().min(3, { message: "users.errors.employeeIdInvalid" }),
  position: z.string().min(2, { message: "users.errors.positionRequired" }),
  roles: z
    .array(z.enum(["Employee", "Admin", "Manager"]))
    .min(1, { message: "users.errors.rolesRequired" }),
});

const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "users.errors.usernameLength" })
    .optional(),
  password: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine((val) => !val || val.length >= 6, {
      message: "users.errors.passwordLengthUpdate",
    }),
  name: z.string().min(2, { message: "users.errors.nameLengthUpdate" }),
  employeeId: z.string().min(3, { message: "users.errors.employeeIdInvalid" }),
  position: z.string().min(3, { message: "users.errors.positionLength" }),
  roles: z
    .array(z.enum(["Employee", "Admin", "Manager"]))
    .min(1, { message: "users.errors.rolesRequired" }),
});

type AddUserFormData = z.infer<typeof userSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

const createUser = async (data: AddUserFormData): Promise<void> => {
  await axiosInstance.post("/auth/register", data);
};

const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`users/${id}`);
};

const updateUser = async (
  id: number,
  data: UpdateUserFormData
): Promise<void> => {
  await axiosInstance.patch(`/users/${id}`, data);
};

const Users = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUserResponse | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<IUserResponse | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string | undefined>("");
  const [searchValue, setSearchValue] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const userColumns: ColumnDef<IUserResponse>[] = [
    { key: "name", header: t("users.name"), accessor: "name", sortable: true },
    {
      key: "employeeId",
      header: t("users.employeeId"),
      accessor: "employeeId",
      sortable: true,
    },
    {
      key: "role",
      header: t("users.role"),
      render: (user) => (
        <span
          className={`badge ${
            user.roles[0].name === "Admin"
              ? "bg-white inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium text-green-800 border border-green-800"
              : user.roles[0].name === "Manager"
              ? "bg-white inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium text-yellow-800 border border-yellow-800"
              : "bg-white inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium text-blue-800 border border-blue-800"
          }`}
        >
          {t(`roles.${user.roles[0].name}`)}
        </span>
      ),
    },
    { key: "position", header: t("users.position"), accessor: "position" },
  ];

  const { mutate: importMutation, isPending: isImporting } = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return axiosInstance.post("/users/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      toast.success(
        t("users.importSuccess", {
          imported: response.data.data.length,
          skipped: response.data.skippedCount,
        })
      );
      refetch();
      setIsImportModalOpen(false);
      setImportFile(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("users.importError"));
    },
  });

  const {
    data: usersResponse,
    isLoading: allUsersLoading,
    isError: allUsersError,
    refetch,
  } = useQuery({
    queryKey: ["users", page, limit, roleFilter, searchTerm],
    queryFn: () => fetchUsersWithFilters(page, limit, roleFilter, searchTerm),
    retry: false,
  });

  const users = usersResponse?.data ?? [];
  const totalPages = usersResponse?.meta.totalPages ?? 0;
  const totalItems = usersResponse?.meta.totalItems ?? 0;

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    watch: watchAdd,
    setValue: setValueAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<AddUserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      employeeId: "",
      position: "",
      roles: ["Employee"],
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    watch: watchUpdate,
    setValue: setValueUpdate,
    reset: resetUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      employeeId: "",
      position: "",
      roles: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    retry: false,
    onSuccess: async () => {
      resetAdd();
      refetch();
      setIsModalOpen(false);
      toast.success(t("users.addSuccess"));
    },
    onError: (err: unknown) => {
      let message = t("users.genericError");
      if (typeof err === "object" && err !== null && "response" in err) {
        const errorResponse = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        const status = errorResponse.response?.status;
        const backendMessage = errorResponse.response?.data?.message || "";
        if (status === 401) message = backendMessage || t("users.invalidData");
        else if (status === 400) message = t("users.userExists");
      }
      setErrorMessage(message);
    },
  });

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserFormData }) =>
      updateUser(id, data),
    onSuccess: async () => {
      resetUpdate();
      refetch();
      setIsUpdateModalOpen(false);
      toast.success(t("users.updateSuccess"));
    },
    onError: (err: unknown) => {
      let message = t("users.genericError");
      if (typeof err === "object" && err !== null && "response" in err) {
        const errorResponse = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        const status = errorResponse.response?.status;
        const backendMessage = errorResponse.response?.data?.message || "";
        if (status === 401) message = backendMessage || t("users.invalidData");
        else if (status === 400) message = t("users.userExists");
      }
      setErrorMessage(message);
    },
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      refetch();
      toast.success(t("users.deleteSuccess"));
    },
    onError: () => {
      toast.error(t("users.deleteError"));
    },
  });

  const handleDeleteClick = (user: IUserResponse) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateClick = (user: IUserResponse) => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setUserToUpdate(user);
    setIsUpdateModalOpen(true);
  };

  useEffect(() => {
    if (userToUpdate) {
      setValueUpdate("username", userToUpdate.username || "");
      setValueUpdate("password", "");
      setValueUpdate("name", userToUpdate.name);
      setValueUpdate("employeeId", userToUpdate.employeeId);
      setValueUpdate("position", userToUpdate.position);
      setValueUpdate(
        "roles",
        userToUpdate.roles.map(
          (role) => role.name as "Admin" | "Employee" | "Manager"
        )
      );
    }
  }, [userToUpdate, setValueUpdate]);

  const handleConfirmDelete = () => {
    if (userToDelete) deleteMutation(+userToDelete.id);
  };

  const handleAddUserClick = () => {
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsModalOpen(true);
  };

  const handleSubmitUser = (data: AddUserFormData) => {
    setErrorMessage("");
    mutate({
      username: data.username,
      password: data.password,
      name: data.name,
      employeeId: data.employeeId,
      position: data.position,
      roles: Array.isArray(data.roles) ? data.roles : [data.roles],
    });
  };

  const handleSubmitUpdateUser = (data: UpdateUserFormData) => {
    if (userToUpdate) {
      if (!data.password) delete data.password;
      setErrorMessage("");
      updateMutation({ id: +userToUpdate.id, data });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetAdd();
  };

  const handleCloseUpdateCloseModal = () => {
    setIsUpdateModalOpen(false);
    resetAdd();
    resetUpdate();
  };

  const navigate = useNavigate();

  const handleViewUser = (id: string) => {
    navigate(`/dashboard/users/${id}`);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };
  const handleRoleFilterChange = (role: string | undefined) => {
    setRoleFilter(role);
    setPage(1);
  };

  const handleSearchChange = (value: string | undefined) => {
    const normalizedValue = value ?? "";
    setSearchValue(normalizedValue);
    setSearchTerm(normalizedValue || undefined);
    setPage(1);
  };

  if (allUsersLoading) return <Spinner fullScreen />;
  if (allUsersError) return <div>{t("users.loadingError")}</div>;

  return (
    <div
      className={isRtl ? "font-arabic" : "Inter"}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="mb-2.5">
        <h1 className="text-xl font-semibold text-gray-900">
          {t("users.title")}
        </h1>
        <p className="text-sm text-gray-400 font-light">
          {t("users.subtitle")}
        </p>
      </div>

      <DataTable<IUserResponse>
        data={users}
        columns={userColumns}
        getId={(user) => user.id.toString()}
        onAdd={handleAddUserClick}
        onImport={() => setIsImportModalOpen(true)}
        onDelete={handleDeleteClick}
        onEdit={handleUpdateClick}
        onView={(user) => handleViewUser(user.id)}
        searchPlaceholder={t("users.searchPlaceholder")}
        availableFilters={["role"]}
        roleFilter={roleFilter}
        itemsPerPageOptions={[5, 10, 20]}
        loading={allUsersLoading}
        pagination={{
          currentPage: page,
          itemsPerPage: limit,
          totalPages,
          totalItems,
          onPageChange: handlePageChange,
          onItemsPerPageChange: handleLimitChange,
        }}
        onSearch={handleSearchChange}
        searchValue={searchValue}
        onRoleFilterChange={handleRoleFilterChange}
        emptyState={
          !allUsersLoading && (
            <div className="p-5 flex items-center justify-center text-gray-500">
              <AlertTriangle size={20} className={isRtl ? "ml-2" : "mr-2"} />
              {t("users.noUsers")}
            </div>
          )
        }
      />

      {/* Add user modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={t("users.addUser")}
      >
        <div>
          <Form onSubmit={handleSubmitAdd(handleSubmitUser)}>
            <FormField label={t("users.username") + " *"} htmlFor="username">
              <Input
                type="text"
                placeholder={t("users.usernamePlaceholder")}
                aria-invalid={!!errorsAdd.username}
                {...registerAdd("username")}
                className={clsx(
                  { "border-red-500": !!errorsAdd.username },
                  "pt-2 pb-2"
                )}
              />
              {errorsAdd.username && (
                <p className="text-red-500 font-light text-sm mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsAdd.username.message as string)}
                </p>
              )}
            </FormField>
            <FormField label={t("users.password") + " *"} htmlFor="password">
              <Input
                type="text"
                placeholder={t("users.passwordPlaceholder")}
                aria-invalid={!!errorsAdd.password}
                {...registerAdd("password")}
                className={clsx(
                  { "border-red-500": !!errorsAdd.password },
                  "pt-2 pb-2"
                )}
              />
              {errorsAdd.password && (
                <p className="text-red-500 font-light text-sm mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsAdd.password.message as string)}
                </p>
              )}
            </FormField>
            <FormField label={t("users.name") + " *"} htmlFor="name">
              <Input
                type="text"
                placeholder={t("users.namePlaceholder")}
                aria-invalid={!!errorsAdd.name}
                {...registerAdd("name")}
                className={clsx(
                  { "border-red-500": !!errorsAdd.name },
                  "pt-2 pb-2"
                )}
              />
              {errorsAdd.name && (
                <p className="text-red-500 text-sm font-light mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsAdd.name.message as string)}
                </p>
              )}
            </FormField>
            <FormField
              label={t("users.employeeId") + " *"}
              htmlFor="employeeId"
            >
              <Input
                type="text"
                placeholder={t("users.employeeIdPlaceholder")}
                aria-invalid={!!errorsAdd.employeeId}
                {...registerAdd("employeeId")}
                className={clsx(
                  { "border-red-500": !!errorsAdd.employeeId },
                  "pt-2 pb-2"
                )}
              />
              {errorsAdd.employeeId && (
                <p className="text-red-500 text-sm font-light mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsAdd.employeeId.message as string)}
                </p>
              )}
            </FormField>
            <FormField label={t("users.position") + " *"} htmlFor="position">
              <Input
                type="text"
                placeholder={t("users.positionPlaceholder")}
                {...registerAdd("position")}
                aria-invalid={!!errorsAdd.position}
                className={clsx(
                  { "border-red-500": !!errorsAdd.position },
                  "pt-2 pb-2"
                )}
              />
              {errorsAdd.position && (
                <p className="text-red-500 text-sm font-light mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsAdd.position.message as string)}
                </p>
              )}
            </FormField>
            <FormField label={t("users.roles") + " *"} htmlFor="roles">
              <Select
                multiple
                placeholder={t("users.rolesPlaceholder")}
                value={watchAdd("roles")}
                onChange={(selectedRoles) =>
                  setValueAdd(
                    "roles",
                    (Array.isArray(selectedRoles)
                      ? selectedRoles
                      : [selectedRoles]) as ("Admin" | "Employee" | "Manager")[]
                  )
                }
                options={[
                  { label: t("roles.Admin"), value: "Admin" },
                  { label: t("roles.Employee"), value: "Employee" },
                  { label: t("roles.Manager"), value: "Manager" },
                ]}
                aria-invalid={!!errorsAdd.roles}
                className={clsx({ "border-red-500": !!errorsAdd.roles })}
              />
              {errorsAdd.roles && (
                <p className="text-red-500 font-light text-sm mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsAdd.roles.message as string)}
                </p>
              )}
            </FormField>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2"
              >
                <AlertCircleIcon size={20} className="flex-shrink-0" />
                {errorMessage}
              </motion.div>
            )}
            <Button
              type="submit"
              className="font-light w-full"
              loading={isPending}
            >
              <span className="font-light flex items-center gap-1 justify-center">
                <PlusCircleIcon size={16} />
                {t("users.addButton")}
              </span>
            </Button>
          </Form>
        </div>
      </Modal>

      {/* Import Users Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportFile(null);
        }}
        title={t("users.importUsers")}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("users.selectFile")}
            </label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          <div className="mt-4">
            <Button
              onClick={() => importFile && importMutation(importFile)}
              disabled={!importFile || isImporting}
              className="w-full"
              loading={isImporting}
            >
              {isImporting ? t("users.importing") : t("users.importButton")}
            </Button>
          </div>

          <div className="text-sm text-gray-500 mt-2">
            <p className="font-semibold">{t("users.fileRequirements")}</p>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>{t("users.fileFormat")}</li>
              <li>{t("users.fileColumns")}</li>
              <li>{t("users.fileHeaders")}</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Edit user modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateCloseModal}
        title={t("users.editUser")}
      >
        <div>
          <Form onSubmit={handleSubmitUpdate(handleSubmitUpdateUser)}>
            <FormField label={t("users.username") + " *"} htmlFor="username">
              <Input
                type="text"
                placeholder={t("users.usernamePlaceholder")}
                aria-invalid={!!errorsUpdate.username}
                {...registerUpdate("username")}
                className={clsx(
                  { "border-red-500": !!errorsUpdate.username },
                  "pt-2 pb-2"
                )}
              />
              {errorsUpdate.username && (
                <p className="text-red-500 font-light text-sm mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsUpdate.username.message as string)}
                </p>
              )}
            </FormField>
            <FormField label={t("users.newPassword")} htmlFor="password">
              <Input
                type="password"
                placeholder={t("users.passwordOptionalPlaceholder")}
                aria-invalid={!!errorsUpdate.password}
                {...registerUpdate("password")}
                className={clsx("pt-2 pb-2")}
              />
              {errorsUpdate.password && (
                <p className="text-red-500 font-light text-sm mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsUpdate.password.message as string)}
                </p>
              )}
            </FormField>
            <FormField label={t("users.name") + " *"} htmlFor="name">
              <Input
                type="text"
                placeholder={t("users.namePlaceholder")}
                aria-invalid={!!errorsUpdate.name}
                {...registerUpdate("name")}
                className={clsx(
                  { "border-red-500": !!errorsUpdate.name },
                  "pt-2 pb-2"
                )}
              />
              {errorsUpdate.name && (
                <p className="text-red-500 text-sm font-light mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsUpdate.name.message as string)}
                </p>
              )}
            </FormField>
            <FormField
              label={t("users.employeeId") + " *"}
              htmlFor="employeeId"
            >
              <Input
                type="text"
                placeholder={t("users.employeeIdPlaceholder")}
                aria-invalid={!!errorsUpdate.employeeId}
                {...registerUpdate("employeeId")}
                className={clsx(
                  { "border-red-500": !!errorsUpdate.employeeId },
                  "pt-2 pb-2"
                )}
              />
              {errorsUpdate.employeeId && (
                <p className="text-red-500 text-sm font-light mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsUpdate.employeeId.message as string)}
                </p>
              )}
            </FormField>
            <FormField label={t("users.position") + " *"} htmlFor="position">
              <Input
                type="text"
                placeholder={t("users.positionPlaceholder")}
                {...registerUpdate("position")}
                aria-invalid={!!errorsUpdate.position}
                className={clsx(
                  { "border-red-500": !!errorsUpdate.position },
                  "pt-2 pb-2"
                )}
              />
              {errorsUpdate.position && (
                <p className="text-red-500 text-sm font-light mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsUpdate.position.message as string)}
                </p>
              )}
            </FormField>
            <FormField label={t("users.roles") + " *"} htmlFor="roles">
              <Select
                multiple
                placeholder={t("users.rolesPlaceholder")}
                value={watchUpdate("roles")}
                onChange={(selectedRoles) =>
                  setValueUpdate(
                    "roles",
                    (Array.isArray(selectedRoles)
                      ? selectedRoles
                      : [selectedRoles]) as ("Admin" | "Employee" | "Manager")[]
                  )
                }
                options={[
                  { label: t("roles.Admin"), value: "Admin" },
                  { label: t("roles.Employee"), value: "Employee" },
                  { label: t("roles.Manager"), value: "Manager" },
                ]}
                aria-invalid={!!errorsUpdate.roles}
                className={clsx({ "border-red-500": !!errorsUpdate.roles })}
              />
              {errorsUpdate.roles && (
                <p className="text-red-500 font-light text-sm mt-1 flex items-center gap-1">
                  <AlertCircleIcon
                    size={16}
                    strokeWidth={1}
                    className="flex-shrink-0"
                  />
                  {t(errorsUpdate.roles.message as string)}
                </p>
              )}
            </FormField>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2"
              >
                <AlertCircleIcon size={20} className="flex-shrink-0" />
                {errorMessage}
              </motion.div>
            )}
            <Button
              type="submit"
              className="font-light w-full"
              loading={isUpdating}
            >
              <span className="font-light flex items-center gap-1 justify-center">
                {t("users.editButton")}
                <Edit3Icon size={16} />
              </span>
            </Button>
          </Form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("users.deleteUser")}
      >
        <p className="font-light">{t("users.deletePrompt")}</p>
        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={() => setIsDeleteModalOpen(false)}>
            {t("users.cancelButton")}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            loading={isDeleting}
            className="bg-red-700 hover:bg-red-500"
          >
            {t("users.confirmButton")}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
