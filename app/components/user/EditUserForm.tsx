import React, { useState, useEffect } from "react";
import { AlertType, EditUserFormInterface } from "../../types";
import { getUserById, updateUser } from "../../api/userServices";
import UserForm from "./UserForm";

interface EditUserFormProps {
   userId: number;
   mutate: () => void;
}

const EditUserForm = ({ userId, mutate }: EditUserFormProps) => {
   const [formData, setFormData] = useState<EditUserFormInterface>({
      userId: userId,
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
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

   // Handle form submission
   const handleEditUser = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      // Validate required fields
      if (!formData.username || !formData.password || !formData.role) {
         setIsSubmitting(false);
         setAlert({
            type: "error",
            message: "Please fill in all required fields.",
         });
         return;
      }

      try {
         // Create FormData for file upload
         const formDataToSend = new FormData();
         formDataToSend.append("name", formData.name);
         formDataToSend.append("username", formData.username);
         formDataToSend.append("password", formData.password);
         formDataToSend.append("role", formData.role);

         // Call your updateUser function with the object data and FormData separately
         const res = await updateUser(userId, formDataToSend);
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
      <UserForm
         formData={formData}
         isSubmitting={isSubmitting}
         isAdding={false}
         handleChange={handleChange}
         handleSubmit={handleEditUser}
         alert={alert}
         handleCloseAlert={handleCloseAlert}
      />
   );
};

export default EditUserForm;
