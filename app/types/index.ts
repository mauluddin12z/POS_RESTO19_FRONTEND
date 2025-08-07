// Menu and Category Interfaces
export interface CategoryInterface {
   categoryId: number;
   categoryName: string;
}

export interface MenuInterface {
   menuId: number;
   menuName: string;
   menuDescription: string;
   menuImageUrl: string;
   price: number;
   stock: number;
   categoryId: number | null;
   category: CategoryInterface;
}
export interface AddMenuFormInterface {
   menuName: string;
   menuDescription: string;
   price: number;
   stock: number;
   categoryId: number | null;
   menuImage?: File | null;
}

export interface EditMenuFormInterface {
   menuId: number;
   menuName: string;
   menuDescription: string;
   price: number;
   stock: number;
   categoryId: number | null;
   menuImage?: File | null;
   imagePreview?: string;
}
export interface AddUserFormInterface {
   name: string;
   username: string;
   password: string;
   role: string;
}
export interface EditUserFormInterface {
   userId: number;
   name: string;
   username: string;
   password: string;
   role: string;
}

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertPropsInterface {
   type: AlertType;
   message: string;
   onClose: () => void;
}

export interface MenuFilterInterface {
   categoryId?: number | null;
   categoryName?: string;
   menuName?: string;
   minPrice?: number | null;
   maxPrice?: number | null;
   searchQuery?: string;
   sortBy?: "menuName" | "categoryId" | "price" | "stock";
   sortOrder?: "asc" | "desc";
   page?: number | null;
   pageSize?: number | null;
}

// Product Interfaces
export interface ProductInterface {
   id: number;
   name: string;
   image: string;
   price: number;
   stock: number;
}

export interface ProductCardPropsInterface {
   id: number;
   productName: string;
   productImageUrl: string;
   productPrice: number;
   stock: number;
   onAddToCart: (product: ProductInterface) => void;
}

export interface MenuGridPropsInterface {
   menus: MenuInterface[];
   loading: boolean;
   onAddToCart: (product: ProductInterface) => void;
}

// Cart Interfaces
export interface CartInterface {
   total: string;
   cartItems: CartItemInterface[];
}

export interface CartItemInterface {
   id: number;
   name: string;
   price: number;
   quantity: number;
   subtotal: number;
   notes: string;
   stock: number;
}

export interface CartPropsInterface {
   orderId: number | null;
   cart: CartInterface;
   cartItems: CartItemInterface[];
   stockMessage: string;
   onRemove: (id: number) => void;
   onQuantityChange: (id: number, quantity: number) => void;
   onNotesChange: (id: number, notes: string) => void;
   onOrder: () => void;
   isSubmitting: boolean;
   closeCart: () => void;
}
export interface CartItemPropsInterface {
   item: CartItemInterface;
   stockMessage: string;
   onQuantityChange: (id: number, quantity: number) => void;
   onNotesChange: (id: number, notes: string) => void;
   onRemove: (id: number) => void;
}

export interface ShowCartModalButtonProps {
   setCartModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
   cartItemLength: number | null;
}

// User Interface (for login or user info)
export interface UserInterface {
   userId: number;
   name: string;
   username: string;
   password: string;
   role: string;
}

// Order Interface (related to orders transactions)
export interface OrderInterface {
   orderId: number;
   createdAt: string;
   orderDetails: OrderDetailInterface[];
   total: number;
   subtotal: number;
   paymentMethod?: string;
   paymentStatus?: string;
}

export interface OrderDetailInterface {
   quantity: number;
   menu: {
      menuName: string;
   };
   price: number;
   subtotal: number;
   notes: string;
}

// Pagination Interface
export interface PaginationPropsInterface {
   totalItems: number;
   totalPages: number;
   currentPage: number;
   pageSize: number;
   hasNextPage: boolean;
   isLoading: boolean;
   onPageChange: (page: number) => void;
}

// Category Card Interface (for rendering categories in a sidebar or menu)
export interface CategoryCardPropsInterface {
   categoryId: number | null;
   categoryName: string;
   activeCategoryId: number | null | undefined;
   onClick: (categoryId: number | null, categoryName: string) => void;
}
