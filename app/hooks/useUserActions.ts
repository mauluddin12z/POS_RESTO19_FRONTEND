import { createUser, deleteUser, updateUser } from "../api/userServices";
import { useGlobalAlert } from "../context/AlertProvider";
import { AddUserFormInterface, EditUserFormInterface } from "../types";

/**
 * Custom hook to manage User-related actions
 */
const useUserActions = () => {
   const { showAlert } = useGlobalAlert();

   /**
    * Validates User form data and returns error messages
    */
   const validateUserForm = (formData: {
      name: string;
      username: string;
      password: string;
      role: string;
   }) => {
      const errors = {
         name: "",
         username: "",
         password: "",
         role: "",
      };

      if (!formData.name.trim()) errors.name = "Name is required.";
      if (!formData.username) errors.username = "Username is required.";
      if (!formData.password) errors.password = "Password is required.";
      if (!formData.role) errors.role = "Role is required.";

      return errors;
   };

   /**
    * Handles adding a new user
    */
   const handleAddUser = async ({
      formData,
      setIsSubmitting,
      closeAddModal,
      mutate,
      setFormErrors,
   }: {
      formData: AddUserFormInterface;
      setIsSubmitting: (val: boolean) => void;
      closeAddModal: () => void;
      mutate: () => void;
      setFormErrors: (errors: any) => void;
   }) => {
      setIsSubmitting(true);

      const validationErrors = validateUserForm(formData);
      setFormErrors(validationErrors);

      const hasErrors = Object.values(validationErrors).some((e) => e !== "");
      if (hasErrors) {
         setIsSubmitting(false);
         return;
      }

      try {
         const formDataToSend = new FormData();
         formDataToSend.append("name", formData.name);
         formDataToSend.append("username", formData.username);
         formDataToSend.append("password", formData.password);
         formDataToSend.append("role", formData.role);

         const res = await createUser(formDataToSend);

         showAlert({
            type: "success",
            message: res?.message || "User successfully created!",
         });
      } catch (error: any) {
         showAlert({
            type: "error",
            message: error?.response?.data?.message ?? error.message,
         });
      } finally {
         mutate();
         closeAddModal();
         setIsSubmitting(false);
      }
   };

   /**
    * Handles editing an existing user
    */
   const handleEditUser = async ({
      userId,
      formData,
      closeEditModal,
      setIsSubmitting,
      mutate,
      setFormErrors,
   }: {
      userId: number;
      formData: EditUserFormInterface;
      closeEditModal: () => void;
      setIsSubmitting: (val: boolean) => void;
      mutate: () => void;
      setFormErrors: (errors: any) => void;
   }) => {
      setIsSubmitting(true);

      const validationErrors = validateUserForm(formData);
      setFormErrors(validationErrors);

      const hasErrors = Object.values(validationErrors).some((e) => e !== "");
      if (hasErrors) {
         setIsSubmitting(false);
         return;
      }

      try {
         const formDataToSend = new FormData();
         formDataToSend.append("userId", formData.userId?.toString() || "");
         formDataToSend.append("name", formData.name);
         formDataToSend.append("username", formData.username);
         formDataToSend.append("password", formData.password);
         formDataToSend.append("role", formData.role);

         const res = await updateUser(userId, formDataToSend);

         showAlert({
            type: "success",
            message: res?.message || "User updated successfully!",
         });
      } catch (error: any) {
         showAlert({
            type: "error",
            message: error?.response?.data?.message ?? error.message,
         });
      } finally {
         mutate();
         closeEditModal();
         setIsSubmitting(false);
      }
   };

   /**
    * Handles deleting a user
    */
   const handleDeleteUser = async ({
      userId,
      setIsDeleting,
      closeDeleteModal,
      mutate,
   }: {
      userId: number;
      setIsDeleting: (val: boolean) => void;
      closeDeleteModal: () => void;
      mutate: () => void;
   }) => {
      setIsDeleting(true);

      try {
         const res = await deleteUser(userId);
         showAlert({
            type: "success",
            message: res?.message || "User deleted successfully!",
         });
      } catch (error: any) {
         showAlert({
            type: "error",
            message: error?.response?.data?.message ?? error.message,
         });
      } finally {
         mutate();
         closeDeleteModal();
         setIsDeleting(false);
      }
   };

   return {
      handleAddUser,
      handleEditUser,
      handleDeleteUser,
   };
};

export default useUserActions;
