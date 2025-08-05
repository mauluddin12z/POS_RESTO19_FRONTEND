"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { useMenus } from "../api/menuServices";
import { MenuFilterInterface, MenuInterface } from "../types";
import Image, { ImageLoader } from "next/image";
import MenuTable from "../components/MenuTable";
import MenuSearch from "../components/MenuSearch";
import Pagination from "../components/Pagination";
import AddMenuForm from "../components/AddMenuForm";
import Link from "next/link";
import EditMenuForm from "../components/EditMenuForm";
import Modal from "../components/Modal";

export default function page() {
   const [searchQuery, setSearchQuery] = useState("");
   const [filters, setFilters] = useState<MenuFilterInterface>({
      categoryId: null,
      menuName: "",
      minPrice: null,
      maxPrice: null,
      searchQuery: "",
      sortBy: "menuName",
      sortOrder: "asc",
      page: 1,
      pageSize: 5,
   });
   const { menus, isLoading: loadingMenus } = useMenus(filters);
   // Debounce search query update
   useEffect(() => {
      const timeout = setTimeout(() => {
         setFilters((prev) => ({ ...prev, searchQuery, page: 1 }));
      }, 300);
      return () => clearTimeout(timeout);
   }, [searchQuery]);
   const handlePageChange = (page: number) => {
      setFilters((prev) => ({ ...prev, page }));
   };

   const [IsAddModalOpen, setIsAddModalOpen] = useState(false);
   const openAddModal = () => setIsAddModalOpen(true);
   const closeAddModal = () => setIsAddModalOpen(false);

   const [editModalVisible, setEditModalVisible] = useState(false);
   return (
      <MainLayout>
         <div className="flex flex-col w-full gap-2 p-2 border border-gray-200 rounded-lg">
            <div className="flex flex-wrap w-full justify-between">
               <MenuSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
               />
               <button
                  onClick={openAddModal}
                  className="flex justify-center items-center py-2.5 px-5 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer text-white bg-green-600 hover:bg-green-700"
               >
                  Add menu
               </button>
            </div>
            <MenuTable menus={menus?.data} loading={loadingMenus} />
            <div className="flex justify-center items-center">
               <Pagination
                  totalItems={menus?.pagination?.totalItems}
                  totalPages={menus?.pagination?.totalPages}
                  currentPage={menus?.pagination?.currentPage}
                  pageSize={menus?.pagination?.pageSize}
                  hasNextPage={menus?.pagination?.hasNextPage}
                  isLoading={loadingMenus}
                  onPageChange={handlePageChange}
               />
            </div>
         </div>

         <Modal isOpen={IsAddModalOpen} onClose={closeAddModal}>
            <AddMenuForm />
         </Modal>
      </MainLayout>
   );
}
