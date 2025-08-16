"use client";

import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useOrders } from "../api/orderServices";
import { OrderFilterInterface, OrderInterface } from "../types";
import OrderItem from "../components/order/OrderItem";
import Pagination from "../components/ui/Pagination";
import SkeletonLoading from "../components/ui/SkeletonLoading";
import DateRangeButtonGroup from "../components/order/DateRangeButton";
import PaymentStatusSelection from "../components/payment/PaymentStatusSelection";
import OrderItemLoading from "../components/order/OrderItemLoading";
import DashboardSummaryCards from "../components/dashboard/SummaryCards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function Page() {
   const [orderFilters, setOrderFilters] = useState<OrderFilterInterface>({
      minTotal: null,
      maxTotal: null,
      paymentMethod: "",
      searchQuery: "",
      page: 1,
      pageSize: 12,
      sortBy: "createdAt",
      sortOrder: "desc",
      dateRange: "",
      fromDate: "",
      toDate: "",
      paymentStatus: "",
   });

   const { orders, mutate, isLoading: loadingOrders } = useOrders(orderFilters);

   const handleDateRangeChange = (dateRange: string) => {
      setOrderFilters((prev) => ({ ...prev, dateRange, page: 1 }));
   };
   const handlePaymentStatusChange = (status: string) => {
      setOrderFilters((prev) => ({ ...prev, paymentStatus: status, page: 1 }));
   };

   const handlePageChange = (page: number) => {
      setOrderFilters((prev) => ({ ...prev, page }));
   };

   const [isOpenSummaryCards, setIsOpenSummaryCards] = useState(false);
   const [showSummary, setShowSummary] = useState(false);

   // When isOpenSummaryCards becomes true, delay setting showSummary true to trigger transition
   useEffect(() => {
      if (isOpenSummaryCards) {
         // Small delay to trigger transition
         const timer = setTimeout(() => setShowSummary(true), 10);
         return () => clearTimeout(timer);
      } else {
         setShowSummary(false);
      }
   }, [isOpenSummaryCards]);
   return (
      <MainLayout>
         <div className="flex flex-col w-full gap-2 p-2 border border-gray-200 rounded-lg">
            {/* Date Range Filter */}
            <div className={`flex items-center gap-2 max-w-full rounded-lg`}>
               {loadingOrders ? (
                  [...Array(5)].map((_, index) => (
                     <div key={index} className="w-12 h-5">
                        <SkeletonLoading />
                     </div>
                  ))
               ) : (
                  // Actual filters and button when not loading
                  <div className="flex flex-wrap gap-2 items-center">
                     {/* Payment Status Filter */}
                     <PaymentStatusSelection
                        value={orderFilters.paymentStatus}
                        onChange={handlePaymentStatusChange}
                     />

                     {/* Date Range Filter */}
                     <DateRangeButtonGroup
                        value={orderFilters.dateRange}
                        onChange={handleDateRangeChange}
                     />

                     {/* View dashboard button */}
                     <button
                        onClick={() => setIsOpenSummaryCards((prev) => !prev)}
                        className={`flex justify-center items-center font-medium rounded-lg text-sm px-2 py-2 text-center transition duration-150 cursor-pointer ${
                           isOpenSummaryCards
                              ? "bg-blue-600 text-white cursor-default"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                        }`}
                     >
                        <FontAwesomeIcon className="mr-2" icon={faEye} />
                        View dashboard
                     </button>
                  </div>
               )}
            </div>

            {/* Dashboard Summary Cards */}
            <div
               className={`overflow-hidden transition-all duration-200 ease-in-out transform origin-top ${
                  isOpenSummaryCards && showSummary
                     ? "max-h-screen opacity-100 translate-y-0"
                     : "max-h-0 opacity-0 -translate-y-4"
               }`}
            >
               {isOpenSummaryCards && <DashboardSummaryCards />}
            </div>
            {/* Order List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2">
               {orders?.data?.length === 0 && !loadingOrders && (
                  <div className="col-span-full text-center text-gray-500">
                     No orders found.
                  </div>
               )}
               {loadingOrders
                  ? [...Array(6)].map((_, index) => (
                       <OrderItemLoading key={index} />
                    ))
                  : orders?.data?.map((order: OrderInterface) => (
                       <OrderItem
                          key={order.orderId}
                          order={order}
                          mutate={mutate}
                          loading={loadingOrders}
                       />
                    ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center">
               <Pagination
                  totalItems={orders?.pagination?.totalItems ?? 0}
                  totalPages={orders?.pagination?.totalPages ?? 1}
                  currentPage={orders?.pagination?.currentPage ?? 1}
                  pageSize={orders?.pagination?.pageSize ?? 10}
                  hasNextPage={orders?.pagination?.hasNextPage ?? false}
                  isLoading={loadingOrders}
                  onPageChange={handlePageChange}
               />
            </div>
         </div>
      </MainLayout>
   );
}
