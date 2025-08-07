"use client";
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Search from "../components/ui/Search";
import { useOrders } from "../api/orderServices";
import { OrderInterface } from "../types";
import OrderItem from "../components/order/OrderItem";

export default function Page() {
   const { orders, mutate, isLoading } = useOrders();
   const [searchQuery, setSearchQuery] = useState("");
   return (
      <MainLayout>
         <div className="flex flex-col w-full gap-2 p-2 border border-gray-200 rounded-lg">
            <div className="">
               <Search
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
               />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-2">
               {orders?.data?.map((orders: OrderInterface, index: number) => (
                  <OrderItem
                     key={index}
                     orders={orders}
                     mutate={mutate}
                     loading={isLoading}
                  />
               ))}
            </div>
         </div>
      </MainLayout>
   );
}
