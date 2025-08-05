import React, { useState, useEffect } from "react";
import { getMenuById, updateMenu } from "../api/menuServices"; // Assuming updateMenu is your API call function
import { CategoryInterface, EditMenuFormInterface } from "../types";
import { useCategories } from "../api/categoryServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface EditMenuFormProps {
   menuId: number; // Accept the menuId as a prop
}

const EditMenuForm = ({ menuId }: EditMenuFormProps) => {
   const { categories } = useCategories(); // Fetch categories from API
   const [formData, setFormData] = useState<EditMenuFormInterface>({
      menuId: menuId,
      menuName: "",
      menuDescription: "",
      categoryId: null,
      stock: 0,
      price: 0,
      image: null,
   });

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

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
               image: data.image || null,
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
            image: files[0],
         }));
      }
   };

   // Handle form submission
   const handleEditMenu = async () => {
      const formDataToSend = new FormData();

      // Add your fields to the form data
      formDataToSend.append("menuName", formData.menuName);
      formDataToSend.append("menuDescription", formData.menuDescription);
      formDataToSend.append(
         "categoryId",
         formData.categoryId?.toString() || ""
      );
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("stock", formData.stock.toString());

      // If there's an image, append it
      if (formData.image) {
         formDataToSend.append("image", formData.image);
      }

      // After collecting FormData, convert it into MenuInterface
      const menuData: EditMenuFormInterface = {
         menuId: formData.menuId,
         menuName: formData.menuName,
         menuDescription: formData.menuDescription,
         price: formData.price,
         stock: formData.stock,
         categoryId: formData.categoryId,
      };

      // Now, call the updateMenu function with the correctly formatted data
      await updateMenu(menuId, menuData);
   };

   // Conditional rendering for loading or error
   if (loading) return <div>Loading...</div>;
   if (error) return <div className="text-red-500">{error}</div>;

   return (
      <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden p-6">
         <form onSubmit={handleEditMenu}>
            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
               Edit Menu Item
            </h2>

            {/* Menu Image */}
            <div className="mb-4 flex justify-center">
               <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36">
                  <label
                     htmlFor="upload"
                     className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                     <FontAwesomeIcon
                        className="h-10 w-10 fill-white text-indigo-500"
                        icon={faPlus}
                     />
                     <span className="text-gray-600 font-medium text-wrap text-center">
                        Upload Menu Image
                     </span>
                  </label>
                  <input
                     id="upload"
                     type="file"
                     className="hidden"
                     onChange={handleFileChange}
                     accept="image/*"
                  />
               </div>
            </div>

            {/* Menu Name */}
            <div className="mb-4">
               <label
                  htmlFor="menuName"
                  className="block text-sm font-medium text-gray-700"
               >
                  Menu Name
               </label>
               <input
                  type="text"
                  id="menuName"
                  name="menuName"
                  placeholder="Enter menu name"
                  value={formData.menuName}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  required
               />
            </div>

            {/* Category */}
            <div className="mb-4">
               <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700"
               >
                  Category
               </label>
               <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId || ""}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  required
               >
                  <option value="" disabled>
                     Select a category
                  </option>
                  {categories?.map((category: CategoryInterface) => (
                     <option
                        key={category.categoryId}
                        value={category.categoryId}
                     >
                        {category.categoryName}
                     </option>
                  ))}
               </select>
            </div>

            {/* Description */}
            <div className="mb-4">
               <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
               >
                  Menu Description
               </label>
               <textarea
                  id="description"
                  name="menuDescription"
                  placeholder="Enter menu description"
                  rows={3}
                  value={formData.menuDescription}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
               ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-2">
               {/* Stock */}
               <div className="mb-4">
                  <label
                     htmlFor="stock"
                     className="block text-sm font-medium text-gray-700"
                  >
                     Stock
                  </label>
                  <input
                     type="number"
                     id="stock"
                     name="stock"
                     value={formData.stock}
                     onChange={handleChange}
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                     required
                  />
               </div>

               {/* Price */}
               <div className="mb-6">
                  <label
                     htmlFor="price"
                     className="block text-sm font-medium text-gray-700"
                  >
                     Price
                  </label>
                  <input
                     type="number"
                     id="price"
                     name="price"
                     value={formData.price}
                     onChange={handleChange}
                     step="0.01"
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                     required
                  />
               </div>
            </div>

            {/* Submit Button */}
            <button
               type="submit"
               className={`w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
               }`}
               disabled={isSubmitting}
            >
               {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
         </form>
      </div>
   );
};

export default EditMenuForm;
