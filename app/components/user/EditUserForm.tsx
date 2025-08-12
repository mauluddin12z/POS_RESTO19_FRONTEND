import React, { useState, useEffect } from "react";
import { AlertType, EditUserFormInterface } from "../../types";
import { getUserById } from "../../api/userServices";
import UserForm from "./UserForm";
import useUserActions from "@/app/hooks/useUserActions";

interface EditUserFormProps {
   userId: number;
   mutate: () => void;
   closeEditModal: () => void;
}

const EditUserForm = ({
   userId,
   mutate,
   closeEditModal,
}: EditUserFormProps) => {
   const [formData, setFormData] = useState<EditUserFormInterface>({
      userId: userId,
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

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Fetch user data on component mount
   useEffect(() => {
      const fetchUserData = async () => {
         try {
            const { data } = await getUserById(userId); // Fetch user by ID
            setFormData({
               userId: data.userId,
               name: data.name,
               username: data.username,
               password: "",
               role: data.role,
            });
            setLoading(false);
         } catch (err) {
            setError("Failed to fetch user data.");
            setLoading(false);
         }
      };

      fetchUserData();
   }, [userId]);

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
   const { handleEditUser } = useUserActions();
   const submitEditUser = async (e: React.FormEvent) => {
      e.preventDefault();

      await handleEditUser({
         userId,
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
      <UserForm
         formData={formData}
         isSubmitting={isSubmitting}
         isAdding={false}
         handleChange={handleChange}
         handleSubmit={submitEditUser}
         formErrors={formErrors}
      />
   );
};

export default EditUserForm;
