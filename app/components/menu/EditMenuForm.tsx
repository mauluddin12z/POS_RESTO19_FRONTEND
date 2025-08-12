import React, { useState, useEffect } from "react";
import MenuForm from "./MenuForm";
import { EditMenuFormInterface } from "@/app/types";
import { getMenuById } from "@/app/api/menuServices";
import useMenuActions from "@/app/hooks/useMenuActions";
interface EditMenuFormProps {
   menuId: number;
   closeEditModal: () => void;
   mutate: () => void;
}

const EditMenuForm = ({
   menuId,
   closeEditModal,
   mutate,
}: EditMenuFormProps) => {
   const [formData, setFormData] = useState<EditMenuFormInterface>({
      menuId: menuId,
      menuName: "",
      menuDescription: "",
      categoryId: null,
      stock: 0,
      price: 0,
      menuImage: null,
      imagePreview: "",
   });

   const [formErrors, setFormErrors] = useState({
      menuName: "",
      categoryId: "",
      stock: "",
      price: "",
   });

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Fetch menu data on component mount
   useEffect(() => {
      const fetchMenuData = async () => {
         try {
            const { data } = await getMenuById(menuId); // Fetch menu by ID
            setFormData({
               menuId: data.menuId, // Ensure the menuId is included
               menuName: data.menuName || "",
               menuDescription: data.menuDescription || "",
               categoryId: data.categoryId || "",
               stock: data.stock || 0,
               price: data.price || 0,
               menuImage: data.menuImageUrl || null,
               imagePreview: data.menuImageUrl ? data.menuImageUrl : "",
            });
            setLoading(false);
         } catch (err) {
            setError("Failed to fetch menu data.");
            setLoading(false);
         }
      };

      fetchMenuData();
   }, [menuId]);

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

   // Handle file change (image upload)
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
         setFormData((prev) => ({
            ...prev,
            menuImage: files[0],
            imagePreview: URL.createObjectURL(files[0]),
         }));
      }
   };

   const [isSubmitting, setIsSubmitting] = useState(false);

   // Handle form submission
   const { handleEditMenu } = useMenuActions();
   const submitEditMenu = async (e: React.FormEvent) => {
      e.preventDefault();

      await handleEditMenu({
         menuId,
         formData,
         setIsSubmitting,
         setFormErrors,
         closeEditModal,
         mutate,
      });
   };
   // Conditional rendering for loading or error
   if (loading) return <div>Loading...</div>;
   if (error) return <div className="text-red-500">{error}</div>;

   return (
      <MenuForm
         formData={formData}
         isSubmitting={isSubmitting}
         isAdding={false}
         handleChange={handleChange}
         handleFileChange={handleFileChange}
         handleSubmit={submitEditMenu}
         formErrors={formErrors}
      />
   );
};

export default EditMenuForm;
