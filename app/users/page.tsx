"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Modal from "../components/ui/Modal";
import Search from "../components/ui/Search";
import { useUsers } from "../api/userServices";
import UserTable from "../components/user/UserTable";
import AddUserForm from "../components/user/AddUserForm";
import { redirect } from "next/navigation";
import useAuth from "../hooks/useAuth";
import { UserInterface } from "../types";

export default function page() {
   const [searchQuery, setSearchQuery] = useState("");
   const { users, isLoading: loadingUsers, mutate } = useUsers();
   const [IsAddModalOpen, setIsAddModalOpen] = useState(false);
   const openAddModal = () => setIsAddModalOpen(true);
   const closeAddModal = () => setIsAddModalOpen(false);

   return (
      <MainLayout>
         <div className="flex flex-col w-full gap-2 p-2 border border-gray-200 rounded-lg">
            <div className="flex flex-wrap w-full justify-between gap-2">
               <Search
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
               />
               <button
                  onClick={openAddModal}
                  className="flex justify-center items-center py-2.5 px-5 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer text-white bg-green-600 hover:bg-green-700"
               >
                  Add user
               </button>
            </div>
            <UserTable users={users} loading={loadingUsers} mutate={mutate} />
         </div>

         <Modal isOpen={IsAddModalOpen} onClose={closeAddModal}>
            <AddUserForm mutate={mutate} closeAddModal={closeAddModal} />
         </Modal>
      </MainLayout>
   );
}
