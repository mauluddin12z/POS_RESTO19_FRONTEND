import React, { useState, useCallback, useMemo, useEffect } from "react";
import { AlertType, MenuInterface } from "../../types";
import Image, { ImageLoader } from "next/image";
import { priceFormat } from "../../utils/priceFormat";
import Modal from "../ui/Modal";
import EditMenuForm from "./EditMenuForm";
import { deleteMenu } from "../../api/menuServices";
import Alert from "../ui/Alert";
import { AxiosError } from "axios";
import { handleDeleteMenu } from "@/app/handlers/menuHandlers";

export interface MenuPropsInterface {
   menus: MenuInterface[];
   loading: boolean;
   mutate: () => void;
}

export default function MenuTable({
   menus,
   loading,
   mutate,
}: MenuPropsInterface) {
   const myLoader: ImageLoader = ({ src }) => {
      return src;
   };

   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [selectedMenu, setSelectedMenu] = useState<MenuInterface | null>(null);

   const openEditModal = useCallback((menu: MenuInterface) => {
      setSelectedMenu(menu);
      setIsEditModalOpen(true);
   }, []);

   const closeEditModal = useCallback(() => {
      setSelectedMenu(null);
      setIsEditModalOpen(false);
   }, []);

   const openDeleteModal = useCallback((menu: MenuInterface) => {
      setSelectedMenu(menu);
      setIsDeleteModalOpen(true);
   }, []);

   const closeDeleteModal = useCallback(() => {
      setSelectedMenu(null);
      setIsDeleteModalOpen(false);
   }, []);

   const [isDeleting, setIsDeleting] = useState(false);
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

   const confirmDeleteMenu = useCallback(async () => {
      if (!selectedMenu?.menuId) return;

      await handleDeleteMenu({
         menuId: selectedMenu.menuId,
         setIsDeleting,
         setAlert,
         closeModal: closeDeleteModal,
         mutate,
      });
   }, [selectedMenu, setIsDeleting, setAlert, closeDeleteModal, mutate]);

   // Automatically clear the alert after 3 seconds when `alertMessage` changes
   const handleCloseAlert = () => {
      setAlert(null);
   };

   const tableContent = useMemo(
      () =>
         menus?.map((menu: MenuInterface, index: number) => (
            <tr key={index} className="bg-white border-gray-200 border-b">
               <td className="px-4 py-2 w-40">
                  <Image
                     className="w-full aspect-5/4 object-cover"
                     loader={myLoader}
                     src={menu.menuImageUrl ?? "no-image.png"}
                     width={500}
                     height={500}
                     priority
                     unoptimized
                     alt={menu.menuName}
                  />
               </td>
               <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
               >
                  {menu.menuName}
               </th>
               <td className="px-6 py-4">{menu.category.categoryName}</td>
               <td className="px-6 py-4 w-60 truncate block">
                  {menu.menuDescription}
               </td>
               <td className="px-6 py-4">{menu.stock}</td>
               <td className="px-6 py-4">{priceFormat(menu.price)}</td>
               <td className="px-6 py-4 sticky right-0 bg-white">
                  <div className="flex flex-wrap justify-center items-center gap-2">
                     <button
                        onClick={() => openEditModal(menu)}
                        className="font-medium text-blue-600 hover:underline cursor-pointer"
                     >
                        Edit
                     </button>
                     <button
                        onClick={() => openDeleteModal(menu)}
                        className="font-medium text-red-600 hover:underline cursor-pointer"
                     >
                        Delete
                     </button>
                  </div>
               </td>
            </tr>
         )),
      [menus, openEditModal, openDeleteModal]
   );

   return (
      <div className="relative overflow-x-auto sm:rounded-lg">
         <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50">
               <tr>
                  <th scope="col" className="px-6 py-3">
                     Image
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Menu Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Menu Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Stock
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Price
                  </th>
                  <th
                     scope="col"
                     className="px-6 py-3 bg-gray-50 sticky right-0"
                  >
                     Action
                  </th>
               </tr>
            </thead>
            <tbody>
               {loading ? (
                  <tr>
                     <td colSpan={7} className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center">
                           Loading...
                        </div>
                     </td>
                  </tr>
               ) : (
                  tableContent
               )}
            </tbody>
         </table>

         {selectedMenu && isEditModalOpen && (
            <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
               <EditMenuForm menuId={selectedMenu.menuId} mutate={mutate} />
            </Modal>
         )}

         {selectedMenu && isDeleteModalOpen && (
            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
               <div>
                  {alert && (
                     <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={handleCloseAlert}
                     />
                  )}
                  Are you sure you want to delete this data?
                  <div className="mt-4 gap-4  flex justify-center">
                     <button
                        onClick={confirmDeleteMenu}
                        className={`bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded-md ${
                           isDeleting
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                        }`}
                     >
                        {isDeleting ? "Deleting..." : "Yes, delete"}
                     </button>
                     <button
                        onClick={closeDeleteModal}
                        className="bg-gray-200 hover:bg-gray-300  cursor-pointer px-4 py-2 rounded-md"
                     >
                        Cancel
                     </button>
                  </div>
               </div>
            </Modal>
         )}
      </div>
   );
}
