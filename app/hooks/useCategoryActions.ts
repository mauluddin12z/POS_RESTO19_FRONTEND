import {
   createCategory,
   deleteCategory,
   updateCategory,
} from "../api/categoryServices";
import { useGlobalAlert } from "../context/AlertContext";
import { AddCategoryFormInterface, EditCategoryFormInterface } from "../types";

export default function useCategoryActions() {
   const { showAlert } = useGlobalAlert();

   const validateCategoryForm = (formData: { categoryName: string }) => {
      const errors = { categoryName: "" };
      if (!formData.categoryName.trim()) {
         errors.categoryName = "Category name is required.";
      }
      return errors;
   };

   const handleAddCategory = async ({
      formData,
      setIsSubmitting,
      closeAddModal,
      mutate,
      setFormErrors,
   }: {
      formData: AddCategoryFormInterface;
      setIsSubmitting: (val: boolean) => void;
      closeAddModal: () => void;
      mutate: () => void;
      setFormErrors: (errors: any) => void;
   }) => {
      setIsSubmitting(true);
      const validationErrors = validateCategoryForm(formData);
      setFormErrors(validationErrors);

      if (Object.values(validationErrors).some((e) => e)) {
         setIsSubmitting(false);
         return;
      }

      try {
         const formDataToSend = new FormData();
         formDataToSend.append("categoryName", formData.categoryName);
         const res = await createCategory(formDataToSend);
         showAlert({
            type: "success",
            message: res?.message || "Category successfully created!",
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

   const handleEditCategory = async ({
      categoryId,
      formData,
      closeEditModal,
      setIsSubmitting,
      mutate,
      setFormErrors,
   }: {
      categoryId: number;
      formData: EditCategoryFormInterface;
      closeEditModal: () => void;
      setIsSubmitting: (val: boolean) => void;
      mutate: () => void;
      setFormErrors: (errors: any) => void;
   }) => {
      setIsSubmitting(true);
      const validationErrors = validateCategoryForm(formData);
      setFormErrors(validationErrors);

      if (Object.values(validationErrors).some((e) => e)) {
         setIsSubmitting(false);
         return;
      }

      try {
         const formDataToSend = new FormData();
         formDataToSend.append("categoryName", formData.categoryName);
         formDataToSend.append("categoryId", categoryId.toString());
         const res = await updateCategory(categoryId, formDataToSend);

         showAlert({
            type: "success",
            message: res?.message || "Category updated successfully!",
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

   const handleDeleteCategory = async ({
      categoryId,
      setIsDeleting,
      closeDeleteModal,
      mutate,
   }: {
      categoryId: number;
      setIsDeleting: (val: boolean) => void;
      closeDeleteModal: () => void;
      mutate: () => void;
   }) => {
      setIsDeleting(true);
      try {
         const res = await deleteCategory(categoryId);
         showAlert({
            type: "success",
            message: res?.message || "Category deleted successfully!",
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
      handleAddCategory,
      handleEditCategory,
      handleDeleteCategory,
   };
}
