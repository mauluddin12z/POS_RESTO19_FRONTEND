"use client";
import React, { useState, FormEvent, useEffect } from "react";
import MenuForm from "./MenuForm";
import { useCategories } from "@/app/api/categoryServices";
import { AlertType } from "@/app/types";
import { createMenu } from "@/app/api/menuServices";

interface AddMenuFormProps {
   closeAddModal: () => void;
   mutate: () => void;
}

export default function AddMenuForm({
   closeAddModal,
   mutate,
}: AddMenuFormProps) {
   const { categories } = useCategories();
   // Form state
   const [formData, setFormData] = useState({
      menuName: "",
      categoryId: null,
      description: "",
      stock: 0,
      price: 0,
      menuImage: null as File | null,
      imagePreview: "",
   });

   const [formErrors, setFormErrors] = useState({
      menuName: "",
      categoryId: "",
      stock: "",
      price: "",
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

   // Handle file input (for image)
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      if (file) {
         setFormData((prevData) => ({
            ...prevData,
            menuImage: file,
            imagePreview: URL.createObjectURL(file),
         }));
      }
   };

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

   // Handle form submission
   const handleAddMenu = async (e: FormEvent<HTMLFormElement>) => {
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
         const formDataToSend = new FormData();
         formDataToSend.append("menuName", formData.menuName);
         formDataToSend.append("categoryId", formData.categoryId ?? "");
         formDataToSend.append("description", formData.description ?? "");
         formDataToSend.append("stock", formData.stock.toString());
         formDataToSend.append("price", formData.price.toString());
         // Append the image file properly
         if (formData.menuImage instanceof File) {
            formDataToSend.append("menuImage", formData.menuImage);
         }

         const res = await createMenu(formDataToSend);
         setIsSubmitting(false);
         setAlert({
            type: "success",
            message: res?.message || "Menu successfully created!",
         });
         closeAddModal();
         mutate();
      } catch (error: any) {
         setIsSubmitting(false);
         setAlert({
            type: "error",
            message: error?.response?.data?.message ?? error.message,
         });
      }
   };

   const handleCloseAlert = () => {
      setAlert(null);
   };
   return (
      <MenuForm
         formData={formData}
         categories={categories}
         isSubmitting={isSubmitting}
         isAdding={true}
         handleChange={handleChange}
         handleFileChange={handleFileChange}
         handleSubmit={handleAddMenu}
         alert={alert}
         handleCloseAlert={handleCloseAlert}
         formErrors={formErrors}
      />
   );
}
