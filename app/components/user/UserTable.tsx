import React, { useState, useCallback, useMemo, useEffect } from "react";
import { AlertType, UserInterface } from "../../types";
import Modal from "../ui/Modal";
import Alert from "../ui/Alert";
import { AxiosError } from "axios";
import { deleteUser } from "../../api/userServices";
import EditUserForm from "./EditUserForm";

export interface UserPropsInterface {
   users: UserInterface[];
   loading: boolean;
   mutate: () => void;
}

export default function UserTable({
   users,
   loading,
   mutate,
}: UserPropsInterface) {
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);

   const openEditModal = useCallback((user: UserInterface) => {
      setSelectedUser(user);
      setIsEditModalOpen(true);
   }, []);

   const closeEditModal = useCallback(() => {
      setSelectedUser(null);
      setIsEditModalOpen(false);
   }, []);

   const openDeleteModal = useCallback((user: UserInterface) => {
      setSelectedUser(user);
      setIsDeleteModalOpen(true);
   }, []);

   const closeDeleteModal = useCallback(() => {
      setSelectedUser(null);
      setIsDeleteModalOpen(false);
   }, []);

   const [isDeleting, setIsDeleting] = useState(false);
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

   const handleDelete = useCallback(async () => {
      setIsDeleting(true);
      if (selectedUser?.userId) {
         try {
            const res = await deleteUser(selectedUser.userId);
            setAlert({
               type: "success",
               message: res?.message,
            });
            setIsDeleting(false);
            closeDeleteModal();
            mutate();
         } catch (error) {
            setIsDeleting(false);

            // Cast the error to AxiosError type to access 'response'
            if (error instanceof AxiosError) {
               setAlert({
                  type: "error",
                  message: error?.response?.data?.message ?? error.message,
               });
            } else {
               setAlert({
                  type: "error",
                  message: "An unknown error occurred.",
               });
            }
         }
      }
   }, [selectedUser]);

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

   const tableContent = useMemo(
      () =>
         users?.map((user: UserInterface, index: number) => (
            <tr key={index} className="bg-white border-gray-200 border-b">
               <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
               >
                  {user.name}
               </td>
               <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
               >
                  {user.username}
               </td>
               <td className="px-6 py-4">{user.role}</td>
               <td className="px-6 py-4 sticky right-0 bg-white">
                  <div className="flex flex-wrap justify-center items-center gap-2">
                     <button
                        onClick={() => openEditModal(user)}
                        className="font-medium text-blue-600 hover:underline cursor-pointer"
                     >
                        Edit
                     </button>
                     <button
                        onClick={() => openDeleteModal(user)}
                        className="font-medium text-red-600 hover:underline cursor-pointer"
                     >
                        Delete
                     </button>
                  </div>
               </td>
            </tr>
         )),
      [users, openEditModal, openDeleteModal]
   );

   return (
      <div className="relative overflow-x-auto sm:rounded-lg">
         <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50">
               <tr>
                  <th scope="col" className="px-6 py-3">
                     Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Username
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Role
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
                     <td colSpan={4} className="px-6 py-4 text-center">
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

         {selectedUser && isEditModalOpen && (
            <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
               <EditUserForm userId={selectedUser.userId} mutate={mutate} />
            </Modal>
         )}

         {selectedUser && isDeleteModalOpen && (
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
                        onClick={handleDelete}
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
