import React, { FormEvent, useState } from "react";
import Modal from "../ui/Modal";
import LoadingButton from "../ui/LoadingButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import useCategoryActions from "@/app/hooks/useCategoryActions";
interface AddCategoryModalProps {
   isAddCategoryModalOpen: boolean;
   closeAddCategoryModal: () => void;
   categoryMutate: () => void;
}

export default function AddCategoryModal({
   isAddCategoryModalOpen,
   closeAddCategoryModal,
   categoryMutate,
}: AddCategoryModalProps) {
   const [formData, setFormData] = useState({
      categoryName: "",
   });

   const [formErrors, setFormErrors] = useState({
      categoryName: "",
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
   const { handleAddCategory } = useCategoryActions();
   const submitAddCategory = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      await handleAddCategory({
         formData,
         setIsSubmitting,
         closeAddModal: closeAddCategoryModal,
         setFormErrors,
         mutate: categoryMutate,
      });
   };
   return (
      <>
         <Modal isOpen={isAddCategoryModalOpen} onClose={closeAddCategoryModal}>
            <form onSubmit={submitAddCategory}>
               <div className="flex gap-2">
                  {formErrors.categoryName && (
                     <p className="text-xs text-red-500 mb-1">
                        {formErrors.categoryName}
                     </p>
                  )}
                  <input
                     type="text"
                     id="categoryName"
                     name="categoryName"
                     placeholder="Enter category name"
                     value={formData.categoryName}
                     onChange={handleChange}
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                  {/* Submit Button */}
                  <button
                     type="submit"
                     className={`flex justify-center items-center p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
                        isSubmitting
                           ? "opacity-50 cursor-not-allowed"
                           : "cursor-pointer"
                     }`}
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? (
                        <LoadingButton />
                     ) : (
                        <FontAwesomeIcon
                           className="h-10 w-10 text-white"
                           icon={faPlus}
                        />
                     )}
                  </button>
               </div>
            </form>
         </Modal>
      </>
   );
}
