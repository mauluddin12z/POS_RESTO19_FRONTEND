import React, { useState, useEffect } from "react";
import { AlertType, EditCategoryFormInterface } from "@/app/types";
import CategoryForm from "./CategoryForm";
import { getCategoryById } from "@/app/api/categoryServices";
import { handleEditCategory } from "@/app/handlers/categoryHandlers";

interface EditCategoryFormProps {
   categoryId: number;
   mutate: () => void;
}

const EditCategoryForm = ({ categoryId, mutate }: EditCategoryFormProps) => {
   const [formData, setFormData] = useState<EditCategoryFormInterface>({
      categoryId: categoryId,
      categoryName: "",
   });

   const [formErrors, setFormErrors] = useState({
      categoryName: "",
   });

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Fetch menu data on component mount
   useEffect(() => {
      const fetchCategoryData = async () => {
         try {
            const { data } = await getCategoryById(categoryId); // Fetch category by ID
            setFormData({
               categoryId: data.categoryId,
               categoryName: data.categoryName || "",
            });
            setLoading(false);
         } catch (err) {
            setError("Failed to fetch category data.");
            setLoading(false);
         }
      };

      fetchCategoryData();
   }, [categoryId]);

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

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

   // Handle form submission
   const submitEditCategory = async (e: React.FormEvent) => {
      e.preventDefault();

      await handleEditCategory({
         categoryId,
         formData,
         setIsSubmitting,
         setAlert,
         setFormErrors,
         mutate,
      });
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
      <CategoryForm
         formData={formData}
         isSubmitting={isSubmitting}
         isAdding={false}
         handleChange={handleChange}
         handleSubmit={submitEditCategory}
         alert={alert}
         handleCloseAlert={handleCloseAlert}
         formErrors={formErrors}
      />
   );
};

export default EditCategoryForm;
