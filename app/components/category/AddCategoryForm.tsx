"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { AlertType } from "@/app/types";
import { handleAddCategory } from "@/app/handlers/categoryHandlers";
import CategoryForm from "./CategoryForm";

interface AddCategoryFormProps {
   closeAddModal: () => void;
   mutate: () => void;
}

export default function AddCategoryForm({
   closeAddModal,
   mutate
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
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

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
   const handleCloseAlert = () => {
      setAlert(null);
   };
   return (
      <CategoryForm
         formData={formData}
         isSubmitting={isSubmitting}
         isAdding={true}
         handleChange={handleChange}
         handleSubmit={submitAddCategory}
         alert={alert}
         handleCloseAlert={handleCloseAlert}
         formErrors={formErrors}
      />
   );
}
