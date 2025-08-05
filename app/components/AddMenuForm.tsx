"use client";
import React, { useState, FormEvent } from "react";
import { useCategories } from "../api/categoryServices";
import { AddMenuFormInterface, CategoryInterface } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { createMenu } from "../api/menuServices";

export default function AddMenuForm() {
   const { categories } = useCategories();

   // Form state
   const [formData, setFormData] = useState({
      menuName: "",
      categoryId: null,
      description: "",
      stock: 0,
      price: 0,
      image: null as File | null,
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
      setFormData((prevData) => ({
         ...prevData,
         image: file,
      }));
   };

   // Handle form submission
   const handleAddMenu = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validate required fields
      if (
         !formData.menuName ||
         !formData.categoryId ||
         !formData.stock ||
         !formData.price
      ) {
         alert("Please fill in all required fields.");
         return;
      }

      try {
         const formDataToSend = new FormData();
         formDataToSend.append("menuName", formData.menuName);
         formDataToSend.append("categoryId", formData.categoryId);
         formDataToSend.append("description", formData.description);
         formDataToSend.append("stock", formData.stock.toString());
         formDataToSend.append("price", formData.price.toString());
         if (formData.image) {
            formDataToSend.append("image", formData.image);
         }
         // After collecting FormData, convert it into MenuInterface
         const menuData: AddMenuFormInterface = {
            menuName: formData.menuName,
            menuDescription: formData.description,
            price: formData.price,
            stock: formData.stock,
            categoryId: formData.categoryId,
         };
         await createMenu(menuData);
         alert("Menu item added successfully!");
      } catch (error: any) {
         console.error(error);
         alert("Failed to add menu item. Please try again.");
      }
   };

   return (
      <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden">
         <form onSubmit={handleAddMenu}>
            {/* Card Header */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
               Add Menu Item
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
               <select
                  id="categoryId"
                  value={formData.categoryId || ""}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
               >
                  <option value="" disabled>
                     Select a category
                  </option>
                  {categories?.map(
                     (category: CategoryInterface, index: number) => (
                        <option key={index} value={category.categoryId}>
                           {category.categoryName}
                        </option>
                     )
                  )}
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
                  placeholder="Enter menu description"
                  rows={3}
                  value={formData.description}
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
                     placeholder="Enter stock quantity"
                     value={formData.stock}
                     onChange={handleChange}
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
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
                     placeholder="Enter price"
                     step="0.01"
                     value={formData.price}
                     onChange={handleChange}
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
               </div>
            </div>

            {/* Submit Button */}
            <button
               type="submit"
               className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 cursor-pointer"
            >
               Add Menu Item
            </button>
         </form>
      </div>
   );
}
