"use client";
import React, { useState, FormEvent, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import useCategoryActions from "@/app/hooks/useCategoryActions";

interface AddCategoryFormProps {
   closeAddModal: () => void;
   mutate: () => void;
}

export default function AddCategoryForm({
   closeAddModal,
   mutate,
}: AddCategoryFormProps) {
   // Form state
   const [formData, setFormData] = useState({
      categoryName: "",
   });

   const [formErrors, setFormErrors] = useState({
      categoryName: "",
   });

   // Handle input change
   const handleChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) => {
      const { id, value } = e.target;
      setFormData((prevData) => ({
         ...prevData,
         [id]: value,
      }));
   };

   const [isSubmitting, setIsSubmitting] = useState(false);
   const { handleAddCategory } = useCategoryActions();

   // Handle form submission
   const submitAddCategory = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      await handleAddCategory({
         formData,
         setIsSubmitting,
         setFormErrors,
         closeAddModal,
         mutate,
      });
   };

   return (
      <CategoryForm
         formData={formData}
         isSubmitting={isSubmitting}
         isAdding={true}
         handleChange={handleChange}
         handleSubmit={submitAddCategory}
         formErrors={formErrors}
      />
   );
}
