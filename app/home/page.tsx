"use client";
import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "../components/MainLayout";
import MenuFilters from "../components/MenuFilters";
import MenuGrid from "../components/MenuGrid";
import Cart from "../components/Cart";
import Pagination from "../components/Pagination";
import useCart from "@/app/hooks/useCart";
import useCheckout from "@/app/hooks/useCheckout";
import { useMenus } from "@/app/api/menuServices";
import useAuth from "@/app/hooks/useAuth";
import { MenuFilterInterface, UserInterface } from "../types";
import PaymentSuccessful from "../components/PaymentSuccessful";
import { useSales } from "@/app/api/saleServices";
import MenuSearch from "../components/MenuSearch";
import ShowCartModalButton from "../components/ShowCartModalButton";
import { useCategories } from "../api/categoryServices";
import Modal from "../components/Modal";

export default function Page() {
   const { user } = useAuth() as { user: UserInterface | null };
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
      pageSize: 8,
   });

   // Load categories and menus
   const { categories, isLoading: loadingCategories } = useCategories();
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
      stockMessage,
      handlePaymentMethod,
      handleNotes,
   } = useCart();

   // Handle Checkout
   const { handleCheckout, loading, error, paymentSuccessVisible } =
      useCheckout({
         cart,
         user,
         setCart,
      });

   const { sales } = useSales();

   const [IsCartOpen, setIsCartOpen] = useState(false);
   const closeCart = () => setIsCartOpen(false);
   return (
      <MainLayout>
         <div className="w-full flex gap-2 relative">
            <div className="flex flex-col w-full gap-2 p-2 border border-gray-200 rounded-lg">
               <div className="flex flex-col md:flex-row gap-2">
                  {/* Search Input */}
                  <MenuSearch
                     searchQuery={searchQuery}
                     setSearchQuery={setSearchQuery}
                  />
                  {/* Menu Filters */}
                  <MenuFilters
                     categories={categories}
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
            <Modal isOpen={IsCartOpen} onClose={closeCart}>
               <Cart
                  orderId={sales?.length}
                  cart={cart}
                  cartItems={cart.cartItems}
                  onRemove={handleRemove}
                  onQuantityChange={handleQuantityChange}
                  onPaymentMethod={handlePaymentMethod}
                  onOrderNotes={handleNotes}
                  onCheckout={handleCheckout}
                  stockMessage={stockMessage}
                  closeCart={closeCart}
               />
            </Modal>
            <ShowCartModalButton
               setCartModalVisible={setIsCartOpen}
               cartItemLength={cart?.cartItems?.length}
            />
            <div className="hidden lg:flex w-96 bg-white md:max-h-[calc(100vh-5rem)] lg:max-h-[calc(100vh-2rem)] sticky top-4 right-0">
               <Cart
                  orderId={sales?.length}
                  cart={cart}
                  cartItems={cart.cartItems}
                  onRemove={handleRemove}
                  onQuantityChange={handleQuantityChange}
                  onPaymentMethod={handlePaymentMethod}
                  onOrderNotes={handleNotes}
                  onCheckout={handleCheckout}
                  stockMessage={stockMessage}
                  closeCart={closeCart}
               />
            </div>
         </div>
         {paymentSuccessVisible && <PaymentSuccessful />}
      </MainLayout>
   );
}
