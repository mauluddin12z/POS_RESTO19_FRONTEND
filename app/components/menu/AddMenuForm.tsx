"use client";
import React, { useState, FormEvent } from "react";
import MenuForm from "./MenuForm";
import useMenuActions from "@/app/hooks/useMenuActions";
interface AddMenuFormProps {
   closeAddModal: () => void;
   mutate: () => void;
}

export default function AddMenuForm({
   closeAddModal,
   mutate,
}: AddMenuFormProps) {
   const [formData, setFormData] = useState({
      menuName: "",
      categoryId: null,
      menuDescription: "",
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

   // Handle form submission

   const { handleAddMenu } = useMenuActions();
   const submitAddMenu = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      await handleAddMenu({
         formData,
         setIsSubmitting,
         setFormErrors,
         closeAddModal,
         mutate,
      });
   };

   return (
      <MenuForm
         formData={formData}
         isSubmitting={isSubmitting}
         isAdding={true}
         handleChange={handleChange}
         handleFileChange={handleFileChange}
         handleSubmit={submitAddMenu}
         formErrors={formErrors}
      />
   );
}
