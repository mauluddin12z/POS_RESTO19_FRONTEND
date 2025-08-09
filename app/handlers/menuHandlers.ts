
import { createMenu, updateMenu, deleteMenu } from "@/app/api/menuServices";
import {
   AddMenuFormInterface,
   AlertType,
   EditMenuFormInterface,
} from "@/app/types";

/**
 * Validates menu form data and returns error messages
 */
export const validateMenuForm = (formData: {
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
export const handleAddMenu = async ({
   formData,
   setIsSubmitting,
   setAlert,
   closeAddModal,
   mutate,
   setFormErrors,
}: {
   formData: AddMenuFormInterface;
   setIsSubmitting: (val: boolean) => void;
   setAlert: (val: { type: AlertType; message: string } | null) => void;
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
      formDataToSend.append("menuDescription", formData.menuDescription ?? "");
      formDataToSend.append("stock", formData.stock.toString());
      formDataToSend.append("price", formData.price.toString());

      if (formData.menuImage instanceof File) {
         formDataToSend.append("menuImage", formData.menuImage);
      }

      const res = await createMenu(formDataToSend);

      setAlert({
         type: "success",
         message: res?.message || "Menu successfully created!",
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
 * Handles editing an existing menu
 */
export const handleEditMenu = async ({
   menuId,
   formData,
   setIsSubmitting,
   setAlert,
   mutate,
   setFormErrors,
}: {
   menuId: number;
   formData: EditMenuFormInterface;
   setIsSubmitting: (val: boolean) => void;
   setAlert: (val: { type: AlertType; message: string } | null) => void;
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

      setAlert({
         type: "success",
         message: res?.message || "Menu updated successfully!",
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
 * Handles deleting a menu item
 */
export const handleDeleteMenu = async ({
   menuId,
   setIsDeleting,
   setAlert,
   closeModal,
   mutate,
}: {
   menuId: number;
   setIsDeleting: (val: boolean) => void;
   setAlert: (val: { type: AlertType; message: string } | null) => void;
   closeModal: () => void;
   mutate: () => void;
}) => {
   setIsDeleting(true);

   try {
      const res = await deleteMenu(menuId);
      setAlert({
         type: "success",
         message: res?.message || "Menu deleted successfully!",
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
