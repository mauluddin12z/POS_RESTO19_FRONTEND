"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { AlertType } from "@/app/types";
import { handleAddCategory } from "@/app/handlers/categoryHandlers";
import CategoryForm from "./CategoryForm";

interface AddCategoryFormProps {
   closeAddModal: () => void;
   mutate: () => void;
   setAlert: (alert: { type: AlertType; message: string } | null) => void;
}

export default function AddCategoryForm({
   closeAddModal,
   mutate,
   setAlert,
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

   // Handle form submission
   const submitAddCategory = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      await handleAddCategory({
         formData,
         setIsSubmitting,
         setAlert,
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
