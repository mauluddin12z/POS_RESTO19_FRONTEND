import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import MenuGrid from "../menu/MenuGrid";
import { useMenus } from "@/app/api/menuServices";
import {
   CartInterface,
   MenuFilterInterface,
   ProductInterface,
} from "@/app/types";
import Pagination from "../ui/Pagination";
import Search from "../ui/Search";

interface AddOrderItemModalProps {
   isAddItemModalOpen: boolean;
   closeAddItemModal: () => void;
   onAddToCart: (product: ProductInterface) => void;
   cart: CartInterface;
   onQuantityChange: (id: number, quantity: number) => void;
}

export default function AddOrderItemModal({
   isAddItemModalOpen,
   closeAddItemModal,
   onAddToCart,
   cart,
   onQuantityChange,
}: AddOrderItemModalProps) {
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
   const { menus, isLoading } = useMenus(filters);

   // Handle Page Change
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

   return (
      <Modal isOpen={isAddItemModalOpen} onClose={closeAddItemModal}>
         <div className="flex flex-col gap-2">
            {/* Search Input */}
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <MenuGrid
               menus={menus?.data}
               loading={isLoading}
               onAddToCart={onAddToCart}
               cart={cart}
               onQuantityChange={onQuantityChange}
            />
            <div className="flex justify-center items-center">
               <Pagination
                  totalItems={menus?.pagination?.totalItems}
                  totalPages={menus?.pagination?.totalPages}
                  currentPage={menus?.pagination?.currentPage}
                  pageSize={menus?.pagination?.pageSize}
                  hasNextPage={menus?.pagination?.hasNextPage}
                  isLoading={isLoading}
                  onPageChange={handlePageChange}
               />
            </div>
         </div>
      </Modal>
   );
}
