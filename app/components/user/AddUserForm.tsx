"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { AddUserFormInterface, AlertType } from "../../types";
import { createUser } from "../../api/userServices";
import UserForm from "./UserForm";
interface AddUserFormProps {
   mutate: () => void;
   setAlert: (alert: { type: AlertType; message: string } | null) => void;
}

export default function AddUserForm({ mutate, setAlert }: AddUserFormProps) {
   // Form state
   const [formData, setFormData] = useState<AddUserFormInterface>({
      name: "",
      username: "",
      password: "",
      role: "",
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
   const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      // Validate required fields
      if (
         !formData.name ||
         !formData.username ||
         !formData.password ||
         !formData.role
      ) {
         setIsSubmitting(false);
         setAlert({
            type: "error",
            message: "Please fill in all required fields.",
         });
         return;
      }

      try {
         const formDataToSend = new FormData();
         formDataToSend.append("name", formData.name);
         formDataToSend.append("username", formData.username);
         formDataToSend.append("password", formData.password);
         formDataToSend.append("role", formData.role);

         const res = await createUser(formDataToSend);
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

   return (
      <UserForm
         formData={formData}
         isSubmitting={isSubmitting}
         isAdding={true}
         handleChange={handleChange}
         handleSubmit={handleAddUser}
      />
   );
}
