import React, { useState, useEffect } from "react";
import MenuForm from "./MenuForm";
import { AlertType, EditMenuFormInterface } from "@/app/types";
import { useCategories } from "@/app/api/categoryServices";
import { getMenuById, updateMenu } from "@/app/api/menuServices";

interface EditMenuFormProps {
   menuId: number;
   mutate: () => void;
}

const EditMenuForm = ({ menuId, mutate }: EditMenuFormProps) => {
   const { categories } = useCategories(); // Fetch categories from API
   const [formData, setFormData] = useState<EditMenuFormInterface>({
      menuId: menuId,
      menuName: "",
      menuDescription: "",
      categoryId: null,
      stock: 0,
      price: 0,
      menuImage: null,
      imagePreview: "",
   });

   const [formErrors, setFormErrors] = useState({
      menuName: "",
      categoryId: "",
      stock: "",
      price: "",
   });

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Fetch menu data on component mount
   useEffect(() => {
      const fetchMenuData = async () => {
         try {
            const { data } = await getMenuById(menuId); // Fetch menu by ID
            setFormData({
               menuId: data.menuId, // Ensure the menuId is included
               menuName: data.menuName || "",
               menuDescription: data.menuDescription || "",
               categoryId: data.categoryId || "",
               stock: data.stock || 0,
               price: data.price || 0,
               menuImage: data.menuImageUrl || null,
               imagePreview: data.menuImageUrl ? data.menuImageUrl : "",
            });
            setLoading(false);
         } catch (err) {
            setError("Failed to fetch menu data.");
            setLoading(false);
         }
      };

      fetchMenuData();
   }, [menuId]);

   // Handle input change
   const handleChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   // Handle file change (image upload)
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
         setFormData((prev) => ({
            ...prev,
            menuImage: files[0],
            imagePreview: URL.createObjectURL(files[0]),
         }));
      }
   };

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

   // Handle form submission
   const handleEditMenu = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate required fields
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

      setFormErrors(errors);

      // Check if there are any errors
      const hasErrors = Object.values(errors).some((err) => err !== "");
      if (hasErrors) {
         setIsSubmitting(false);
         return;
      }

      try {
         // Create FormData for file upload
         const formDataToSend = new FormData();
         formDataToSend.append("menuName", formData.menuName);
         formDataToSend.append("menuDescription", formData.menuDescription);
         formDataToSend.append(
            "categoryId",
            formData.categoryId?.toString() || ""
         );
         formDataToSend.append("price", formData.price.toString());
         formDataToSend.append("stock", formData.stock.toString());

         // If there's an image, append it
         if (formData.menuImage) {
            formDataToSend.append("menuImage", formData.menuImage);
         }
         // Call your updateMenu function with the object data and FormData separately
         const res = await updateMenu(menuId, formDataToSend);
         setIsSubmitting(false);
         setAlert({
            type: "success",
            message: res?.message,
         });
         mutate();
      } catch (error: any) {
         setIsSubmitting(false);
         setAlert({
            type: "error",
            message: error?.response?.data?.message ?? error.message,
         });
      }
   };

   // Automatically clear the alert after 3 seconds when `alertMessage` changes
   const handleCloseAlert = () => {
      setAlert(null);
   };

   // Auto-dismiss alert after 5 seconds
   useEffect(() => {
      if (alert) {
         const timer = setTimeout(() => {
            setAlert(null);
         }, 5000);
         return () => clearTimeout(timer);
      }
   }, [alert]);

   // Conditional rendering for loading or error
   if (loading) return <div>Loading...</div>;
   if (error) return <div className="text-red-500">{error}</div>;

   return (
      <MenuForm
         formData={formData}
         categories={categories}
         isSubmitting={isSubmitting}
         isAdding={false}
         handleChange={handleChange}
         handleFileChange={handleFileChange}
         handleSubmit={handleEditMenu}
         alert={alert}
         handleCloseAlert={handleCloseAlert}
         formErrors={formErrors}
      />
   );
};

export default EditMenuForm;
