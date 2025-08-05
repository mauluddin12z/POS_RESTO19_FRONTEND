"use client"
import React from "react";
import { deleteUser, useUsers } from "../api/userServices";
import { UserInterface } from "../types";

const UserTable: React.FC = () => {
   const { users, isLoading, isError, mutate } = useUsers();

   const handleDelete = async (userId: number) => {
      if (confirm("Are you sure you want to delete this user?")) {
         await deleteUser(userId);
         mutate();
      }
   };

   const handleEdit = (userId: number) => {
      // Replace with modal or route logic
      alert(`Edit user with ID ${userId}`);
   };

   if (isLoading) return <p className="text-gray-500">Loading users...</p>;
   if (isError) return <p className="text-red-500">Error loading users.</p>;

   return (
      <div className="overflow-x-auto">
         <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
            <thead>
               <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">username</th>
                  <th className="py-3 px-4">role</th>
                  <th className="py-3 px-4">Actions</th>
               </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
               {users.map((user: UserInterface, index: number) => (
                  <tr key={user.userId} className="hover:bg-gray-50 transition">
                     <td className="py-2 px-4">{index + 1}</td>
                     <td className="py-2 px-4">{user.username}</td>
                     <td className="py-2 px-4 capitalize">{user.role}</td>
                     <td className="py-2 px-4">
                        <button
                           onClick={() => handleEdit(user.userId)}
                           className="mr-2 px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                           Edit
                        </button>
                        <button
                           onClick={() => handleDelete(user.userId)}
                           className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                           Delete
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default UserTable;
