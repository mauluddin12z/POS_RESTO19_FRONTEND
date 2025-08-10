"use client";
import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import MenuFilters from "../components/menu/MenuFilters";
import MenuGrid from "../components/menu/MenuGrid";
import Pagination from "../components/ui/Pagination";
import useCart from "@/app/hooks/useCart";
import { useMenus } from "@/app/api/menuServices";
import { MenuFilterInterface, UserInterface } from "../types";
import Modal from "../components/ui/Modal";
import Search from "../components/ui/Search";
import Alert from "../components/ui/Alert";
import { useOrders } from "../api/orderServices";
import Cart from "../components/cart/Cart";
import ShowCartModalButton from "../components/cart/ShowCartModalButton";
import useOrderActions from "../hooks/useOrderActions";
import { useCategories } from "../api/categoryServices";

export default function Page() {
   const [searchQuery, setSearchQuery] = useState("");
   const [filters, setFilters] = useState<MenuFilterInterface>({
      categoryId: null,
      menuName: "",
      minPrice: null,
      maxPrice: null,
      searchQuery: "",
      sortBy: "categoryId",
      sortOrder: "asc",
      page: 1,
      pageSize: 8,
   });

   // Load categories and menus
   const categoryFilters = { page: 1, pageSize: 100 };
   const { categories, isLoading: loadingCategories } =
      useCategories(categoryFilters);
   const { menus, isLoading: loadingMenus } = useMenus(filters);

   const handleCategoryClick = useCallback((categoryId: number | null) => {
      setFilters((prev) => ({
         ...prev,
         categoryId,
         page: 1,
      }));
   }, []);

   const handlePageChange = (page: number) => {
      setFilters((prev) => ({ ...prev, page }));
   };

   // Debounce search query update
   useEffect(() => {
      const timeout = setTimeout(() => {
         setFilters((prev) => ({ ...prev, searchQuery, page: 1 }));
      }, 300);
      return () => clearTimeout(timeout);
   }, [searchQuery]);

   const {
      cart,
      setCart,
      handleAddToCart,
      handleRemove,
      handleQuantityChange,
      handleNotesChange,
      stockMessage,
   } = useCart();

   const { orders, mutate } = useOrders();
   // Handle Checkout
   const {
      handleOrder,
      alert,
      handleCloseAlert,
      isSubmitting: isOrderSubmitting,
   } = useOrderActions({
      cart,
      setCart,
      mutate,
   });

   const [IsCartOpen, setIsCartOpen] = useState(false);
   const closeCart = () => setIsCartOpen(false);
   return (
      <MainLayout>
         <div className="w-full flex gap-2 relative">
            <div className="flex flex-col w-full gap-2 p-2 border border-gray-200 rounded-lg">
               <div className="flex flex-col md:flex-row gap-2">
                  {/* Search Input */}
                  <Search
                     searchQuery={searchQuery}
                     setSearchQuery={setSearchQuery}
                  />
                  {/* Menu Filters */}
                  <MenuFilters
                     categories={categories?.data}
                     activeCategoryId={filters.categoryId}
                     onCategoryClick={handleCategoryClick}
                     loadingCategories={loadingCategories}
                  />
               </div>
               <MenuGrid
                  menus={menus?.data}
                  loading={loadingMenus}
                  onAddToCart={handleAddToCart}
               />
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
            {IsCartOpen && (
               <Modal isOpen={IsCartOpen} onClose={closeCart}>
                  <Cart
                     orderId={orders?.data[0]?.orderId}
                     cart={cart}
                     cartItems={cart.cartItems}
                     onRemove={handleRemove}
                     onQuantityChange={handleQuantityChange}
                     onNotesChange={handleNotesChange}
                     onOrder={handleOrder}
                     stockMessage={stockMessage}
                     closeCart={closeCart}
                     isSubmitting={isOrderSubmitting}
                  />
               </Modal>
            )}

            <ShowCartModalButton
               setCartModalVisible={setIsCartOpen}
               cartItemLength={cart?.cartItems?.length}
            />
            <div className="hidden lg:flex w-96 bg-white md:max-h-[calc(100vh-5rem)] lg:max-h-[calc(100vh-2rem)] sticky top-4 right-0">
               <Cart
                  orderId={orders?.data[0]?.orderId}
                  cart={cart}
                  cartItems={cart.cartItems}
                  onRemove={handleRemove}
                  onQuantityChange={handleQuantityChange}
                  onNotesChange={handleNotesChange}
                  onOrder={handleOrder}
                  stockMessage={stockMessage}
                  closeCart={closeCart}
                  isSubmitting={isOrderSubmitting}
               />
            </div>
         </div>
         {alert && (
            <Alert
               type={alert.type}
               message={alert.message}
               onClose={handleCloseAlert}
            />
         )}
      </MainLayout>
   );
}
