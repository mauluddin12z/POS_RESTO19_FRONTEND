import React, { useState } from "react";
import { MenuInterface, MenuPropsInterface } from "../types";
import Image, { ImageLoader } from "next/image";
import { priceFormat } from "../utils/priceFormat";
import Modal from "./Modal";
import EditMenuForm from "./EditMenuForm";
import { deleteMenu } from "../api/menuServices";

export default function MenuTable({ menus, loading }: MenuPropsInterface) {
   const myLoader: ImageLoader = ({ src }) => {
      return src;
   };

   const [IsEditModalOpen, setIsEditModalOpen] = useState(false);
   const [IsDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [selectedMenu, setSelectedMenu] = useState<MenuInterface | null>(null);

   const openEditModal = (menu: MenuInterface) => {
      setSelectedMenu(menu);
      setIsEditModalOpen(true);
   };

   const closeEditModal = () => {
      setSelectedMenu(null);
      setIsEditModalOpen(false);
   };

   const openDeleteModal = (menu: MenuInterface) => {
      setSelectedMenu(menu);
      setIsDeleteModalOpen(true);
   };

   const closeDeleteModal = () => {
      setSelectedMenu(null);
      setIsDeleteModalOpen(false);
   };

   const handleDelete = async () => {
      if (selectedMenu?.menuId) {
         try {
            await deleteMenu(selectedMenu?.menuId);
         } catch (error) {
            console.error("Error deleting menu:", error);
         }
      }
   };



   return (
      <div className="relative overflow-x-auto sm:rounded-lg">
         <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50">
               <tr>
                  <th scope="col" className="px-6 py-3">
                     Image
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Menu name
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Menu description
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Stock
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Price
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50 sticky right-0">
                     Action
                  </th>
               </tr>
            </thead>
            <tbody>
               {menus?.map((menu: MenuInterface, index: number) => (
                  <tr key={index} className="bg-white border-gray-200 border-b">
                     <td className="px-6 py-4 w-40">
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
               ))}
            </tbody>
         </table>
         {selectedMenu && IsEditModalOpen && (
            <Modal isOpen={IsEditModalOpen} onClose={closeEditModal}>
               <EditMenuForm menuId={selectedMenu.menuId} />
            </Modal>
         )}
         {selectedMenu && IsDeleteModalOpen && (
            <Modal isOpen={IsDeleteModalOpen} onClose={closeDeleteModal}>
               <div className="">Are you sure want to delete this data</div>
            </Modal>
         )}
      </div>
   );
}
