import { createMenu, updateMenu, deleteMenu } from "@/app/api/menuServices";
import { AddMenuFormInterface, EditMenuFormInterface } from "@/app/types";
import { useGlobalAlert } from "../context/AlertProvider";

/**
 * Custom hook to manage Menu-related actions
 */
const useMenuActions = () => {
   const { showAlert } = useGlobalAlert();

   /**
    * Validates menu form data and returns error messages
    */
   const validateMenuForm = (formData: {
      menuName: string;
      categoryId: string | number | null;
      stock: number;
      price: number;
   }) => {
      const errors = {
         menuName: "",
         categoryId: "",
         stock: "",
         price: "",
      };

      if (!formData.menuName.trim()) errors.menuName = "Menu name is required.";
      if (!formData.categoryId) errors.categoryId = "Category is required.";
      if (!formData.stock || formData.stock <= 0)
         errors.stock = "Stock must be greater than 0.";
      if (!formData.price || formData.price <= 0)
         errors.price = "Price must be greater than 0.";

      return errors;
   };

   /**
    * Handles adding a new menu
    */
   const handleAddMenu = async ({
      formData,
      setIsSubmitting,
      closeAddModal,
      mutate,
      setFormErrors,
   }: {
      formData: AddMenuFormInterface;
      setIsSubmitting: (val: boolean) => void;
      closeAddModal: () => void;
      mutate: () => void;
      setFormErrors: (errors: any) => void;
   }) => {
      setIsSubmitting(true);

      const validationErrors = validateMenuForm(formData);
      setFormErrors(validationErrors);

      const hasErrors = Object.values(validationErrors).some((e) => e !== "");
      if (hasErrors) {
         setIsSubmitting(false);
         return;
      }

      try {
         const formDataToSend = new FormData();
         formDataToSend.append("menuName", formData.menuName);
         formDataToSend.append(
            "categoryId",
            formData.categoryId?.toString() ?? ""
         );
         formDataToSend.append(
            "menuDescription",
            formData.menuDescription ?? ""
         );
         formDataToSend.append("stock", formData.stock.toString());
         formDataToSend.append("price", formData.price.toString());

         if (formData.menuImage instanceof File) {
            formDataToSend.append("menuImage", formData.menuImage);
         }

         const res = await createMenu(formDataToSend);

         showAlert({
            type: "success",
            message: res?.message || "Menu successfully created!",
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
    * Handles editing an existing menu
    */
   const handleEditMenu = async ({
      menuId,
      formData,
      closeEditModal,
      setIsSubmitting,
      mutate,
      setFormErrors,
   }: {
      menuId: number;
      formData: EditMenuFormInterface;
      closeEditModal: () => void;
      setIsSubmitting: (val: boolean) => void;
      mutate: () => void;
      setFormErrors: (errors: any) => void;
   }) => {
      setIsSubmitting(true);

      const validationErrors = validateMenuForm(formData);
      setFormErrors(validationErrors);

      const hasErrors = Object.values(validationErrors).some((e) => e !== "");
      if (hasErrors) {
         setIsSubmitting(false);
         return;
      }

      try {
         const formDataToSend = new FormData();
         formDataToSend.append("menuName", formData.menuName);
         formDataToSend.append("menuDescription", formData.menuDescription);
         formDataToSend.append(
            "categoryId",
            formData.categoryId?.toString() || ""
         );
         formDataToSend.append("price", formData.price.toString());
         formDataToSend.append("stock", formData.stock.toString());

         if (formData.menuImage instanceof File) {
            formDataToSend.append("menuImage", formData.menuImage);
         }

         const res = await updateMenu(menuId, formDataToSend);

         showAlert({
            type: "success",
            message: res?.message || "Menu updated successfully!",
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
    * Handles deleting a menu item
    */
   const handleDeleteMenu = async ({
      menuId,
      setIsDeleting,
      closeDeleteModal,
      mutate,
   }: {
      menuId: number;
      setIsDeleting: (val: boolean) => void;
      closeDeleteModal: () => void;
      mutate: () => void;
   }) => {
      setIsDeleting(true);

      try {
         const res = await deleteMenu(menuId);
         showAlert({
            type: "success",
            message: res?.message || "Menu deleted successfully!",
         });
      } catch (error: any) {
         showAlert({
            type: "error",
            message: error?.response?.data?.message ?? error.message,
         });
      } finally {
         mutate();
         setIsDeleting(false);
         closeDeleteModal();
      }
   };

   return {
      handleAddMenu,
      handleEditMenu,
      handleDeleteMenu,
   };
};

export default useMenuActions;
