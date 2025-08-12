import React, { useState, useEffect } from "react";
import { EditCategoryFormInterface } from "@/app/types";
import CategoryForm from "./CategoryForm";
import { getCategoryById } from "@/app/api/categoryServices";
import useCategoryActions from "@/app/hooks/useCategoryActions";

interface EditCategoryFormProps {
   categoryId: number;
   mutate: () => void;
   closeEditModal: () => void;
}

const EditCategoryForm = ({
   categoryId,
   mutate,
   closeEditModal,
}: EditCategoryFormProps) => {
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

   // Handle form submission

   const { handleEditCategory } = useCategoryActions();

   const submitEditCategory = async (e: React.FormEvent) => {
      e.preventDefault();

      await handleEditCategory({
         categoryId,
         formData,
         closeEditModal,
         setIsSubmitting,
         setFormErrors,
         mutate,
      });
   };

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
         formErrors={formErrors}
      />
   );
};

export default EditCategoryForm;
