import {
   AddCategoryFormInterface,
   AlertType,
   EditCategoryFormInterface,
} from "@/app/types";
import {
   createCategory,
   deleteCategory,
   updateCategory,
} from "../api/categoryServices";

/**
 * Validates Category form data and returns error messages
 */
export const validateCategoryForm = (formData: { categoryName: string }) => {
   const errors = {
      categoryName: "",
   };

   if (!formData.categoryName.trim())
      errors.categoryName = "Category name is required.";

   return errors;
};

/**
 * Handles adding a new category
 */
export const handleAddCategory = async ({
   formData,
   setIsSubmitting,
   setAlert,
   closeAddModal,
   mutate,
   setFormErrors,
}: {
   formData: AddCategoryFormInterface;
   setIsSubmitting: (val: boolean) => void;
   setAlert: (val: { type: AlertType; message: string } | null) => void;
   closeAddModal: () => void;
   mutate: () => void;
   setFormErrors: (errors: any) => void;
}) => {
   setIsSubmitting(true);

   const validationErrors = validateCategoryForm(formData);
   setFormErrors(validationErrors);

   const hasErrors = Object.values(validationErrors).some((e) => e !== "");
   if (hasErrors) {
      setIsSubmitting(false);
      return;
   }

   try {
      const formDataToSend = new FormData();
      formDataToSend.append("categoryName", formData.categoryName);
      const res = await createCategory(formDataToSend);

      setAlert({
         type: "success",
         message: res?.message || "Category successfully created!",
      });

      mutate();
      closeAddModal();
   } catch (error: any) {
      setAlert({
         type: "error",
         message: error?.response?.data?.message ?? error.message,
      });
   } finally {
      setIsSubmitting(false);
   }
};

/**
 * Handles editing an existing category
 */
export const handleEditCategory = async ({
   categoryId,
   formData,
   setIsSubmitting,
   setAlert,
   mutate,
   setFormErrors,
}: {
   categoryId: number;
   formData: EditCategoryFormInterface;
   setIsSubmitting: (val: boolean) => void;
   setAlert: (val: { type: AlertType; message: string } | null) => void;
   mutate: () => void;
   setFormErrors: (errors: any) => void;
}) => {
   setIsSubmitting(true);

   const validationErrors = validateCategoryForm(formData);
   setFormErrors(validationErrors);

   const hasErrors = Object.values(validationErrors).some((e) => e !== "");
   if (hasErrors) {
      setIsSubmitting(false);
      return;
   }

   try {
      const formDataToSend = new FormData();
      formDataToSend.append("categoryName", formData.categoryName);
      formDataToSend.append(
         "categoryId",
         formData.categoryId?.toString() || ""
      );
      const res = await updateCategory(categoryId, formDataToSend);

      setAlert({
         type: "success",
         message: res?.message || "Category updated successfully!",
      });

      mutate();
   } catch (error: any) {
      setAlert({
         type: "error",
         message: error?.response?.data?.message ?? error.message,
      });
   } finally {
      setIsSubmitting(false);
   }
};

/**
 * Handles deleting a category item
 */
export const handleDeleteCategory = async ({
   categoryId,
   setIsDeleting,
   setAlert,
   closeModal,
   mutate,
}: {
   categoryId: number;
   setIsDeleting: (val: boolean) => void;
   setAlert: (val: { type: AlertType; message: string } | null) => void;
   closeModal: () => void;
   mutate: () => void;
}) => {
   setIsDeleting(true);

   try {
      const res = await deleteCategory(categoryId);
      setAlert({
         type: "success",
         message: res?.message || "Category deleted successfully!",
      });
      mutate();
   } catch (error: any) {
      setAlert({
         type: "error",
         message: error?.response?.data?.message ?? error.message,
      });
   } finally {
      setIsDeleting(false);
      closeModal();
   }
};
