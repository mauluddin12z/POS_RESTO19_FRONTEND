"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { AddUserFormInterface } from "../../types";
import UserForm from "./UserForm";
import useUserActions from "@/app/hooks/useUserActions";
interface AddUserFormProps {
   mutate: () => void;
   closeAddModal: () => void;
}

export default function AddUserForm({
   mutate,
   closeAddModal,
}: AddUserFormProps) {
   // Form state
   const [formData, setFormData] = useState<AddUserFormInterface>({
      name: "",
      username: "",
      password: "",
      role: "",
   });
   const [formErrors, setFormErrors] = useState({
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

   const { handleAddUser } = useUserActions();
   const submitAddUser = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      await handleAddUser({
         formData,
         setIsSubmitting,
         setFormErrors,
         closeAddModal,
         mutate,
      });
   };

   return (
      <UserForm
         formData={formData}
         isSubmitting={isSubmitting}
         isAdding={true}
         handleChange={handleChange}
         handleSubmit={submitAddUser}
         formErrors={formErrors}
      />
   );
}
