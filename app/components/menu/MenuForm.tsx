import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Alert from "../ui/Alert";
import { CategoryInterface } from "../../types";

interface formErrors {
   menuName?: string;
   categoryId?: string;
   price?: string;
   stock?: string;
}

interface MenuFormProps {
   formData: any;
   formErrors: formErrors;
   categories: CategoryInterface[];
   isSubmitting: boolean;
   isAdding: boolean;
   handleChange: (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) => void;
   handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
   alert: any;
   handleCloseAlert: () => void;
}

const MenuForm = ({
   formData,
   formErrors,
   categories,
   isSubmitting,
   isAdding,
   handleChange,
   handleFileChange,
   handleSubmit,
   alert,
   handleCloseAlert,
}: MenuFormProps) => {
   return (
      <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden p-5">
         <form onSubmit={handleSubmit}>
            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-800">
               {isAdding ? "Add Menu Item" : "Edit Menu Item"}
            </h2>

            {alert && (
               <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={handleCloseAlert}
               />
            )}

            {/* Menu Image */}
            <div className="mb-4 mt-4 flex justify-center">
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
                  {/* Show image preview if available */}
                  {formData.imagePreview && (
                     <img
                        src={formData.imagePreview}
                        alt="Menu Image Preview"
                        className="mt-2 rounded-md w-full h-auto object-cover"
                     />
                  )}
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
               {formErrors.menuName && (
                  <p className="text-xs text-red-500 mb-1">
                     {formErrors.menuName}
                  </p>
               )}
               <input
                  type="text"
                  id="menuName"
                  name="menuName"
                  placeholder="Enter menu name"
                  value={formData.menuName}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
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
               {formErrors.categoryId && (
                  <p className="text-xs text-red-500 mb-1">
                     {formErrors.categoryId}
                  </p>
               )}
               <div className="flex gap-2">
                  <select
                     id="categoryId"
                     name="categoryId"
                     value={formData.categoryId || ""}
                     onChange={handleChange}
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  >
                     <option value="" disabled>
                        Select a category
                     </option>
                     {categories?.map((category) => (
                        <option
                           key={category.categoryId}
                           value={category.categoryId}
                        >
                           {category.categoryName}
                        </option>
                     ))}
                  </select>
                  <button
                     className={`p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700`}
                  >
                     <FontAwesomeIcon icon={faPlus} />
                  </button>
               </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
               {/* Stock */}
               <div className="mb-4">
                  <label
                     htmlFor="stock"
                     className="block text-sm font-medium text-gray-700"
                  >
                     Stock
                  </label>
                  {formErrors.stock && (
                     <p className="text-xs text-red-500 mb-1">
                        {formErrors.stock}
                     </p>
                  )}
                  <input
                     type="number"
                     id="stock"
                     name="stock"
                     step="1"
                     value={formData.stock}
                     onChange={handleChange}
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
               </div>

               {/* Price */}
               <div className="mb-4">
                  <label
                     htmlFor="price"
                     className="block text-sm font-medium text-gray-700"
                  >
                     Price
                  </label>
                  {formErrors.price && (
                     <p className="text-xs text-red-500 mb-1">
                        {formErrors.price}
                     </p>
                  )}
                  <input
                     type="number"
                     id="price"
                     name="price"
                     value={formData.price}
                     onChange={handleChange}
                     step="100"
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
               </div>
            </div>

            {/* Submit Button */}
            <button
               type="submit"
               className={`w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
                  isSubmitting
                     ? "opacity-50 cursor-not-allowed"
                     : "cursor-pointer"
               }`}
               disabled={isSubmitting}
            >
               {isSubmitting
                  ? isAdding
                     ? "Adding..."
                     : "Updating..."
                  : isAdding
                  ? "Add Menu Item"
                  : "Save Changes"}
            </button>
         </form>
      </div>
   );
};

export default MenuForm;
