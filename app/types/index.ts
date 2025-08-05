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

export interface EditMenuFormInterface {
   menuId: number;
   menuName: string;
   menuDescription: string;
   price: number;
   stock: number;
   categoryId: number | null;
   image?: File | null;
}
export interface AddMenuFormInterface {
   menuName: string;
   menuDescription: string;
   price: number;
   stock: number;
   categoryId: number | null;
   image?: File | null;
}

export interface MenuFilterInterface {
   categoryId: number | null;
   categoryName?: string;
   menuName?: string;
   minPrice?: number | null;
   maxPrice?: number | null;
   searchQuery?: string;
   sortBy?: "menuName" | "category" | "price" | "stock";
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
export interface MenuPropsInterface {
   menus: MenuInterface[];
   loading: boolean;
}

// Cart Interfaces
export interface CartInterface {
   total: string;
   paymentMethod: string;
   notes: string;
   cartItems: CartItemInterface[];
}

export interface CartItemInterface {
   id: number;
   name: string;
   image: string;
   price: number;
   quantity: number;
   stock: number;
}

export interface CartPropsInterface {
   orderId: number | null;
   cart: CartInterface;
   cartItems: CartItemInterface[];
   stockMessage: string;
   onRemove: (id: number) => void;
   onQuantityChange: (id: number, quantity: number) => void;
   onCheckout: () => void;
   onPaymentMethod: (paymentMethod: string) => void;
   onOrderNotes: (notes: string) => void;
   closeCart: () => void;
}

export interface CartModalPropsInterface {
   orderId: number | null;
   cart: CartInterface;
   cartItems: CartItemInterface[];
   setCart: React.Dispatch<React.SetStateAction<CartInterface>>;
   stockMessage: string;
   onRemove: (id: number) => void;
   onQuantityChange: (id: number, quantity: number) => void;
   onCheckout: () => void;
   onPaymentMethod: (paymentMethod: string) => void;
   onOrderNotes: (notes: string) => void;
   cartModalVisible: boolean;
   setCartModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ShowCartModalButtonProps {
   setCartModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
   cartItemLength: number | null;
}

// Checkout Interfaces
export interface PaymentMethodPropsInterface {
   paymentOptions: string[]; // Predefined payment methods could be improved with an Enum
   onPaymentMethod: (paymentMethod: string) => void;
   currentPaymentMethod: string;
}

export interface OrderNotesPropsInterface {
   onOrderNotes: (notes: string) => void;
   currentOrderNotes: string;
}

// User Interface (for login or user info)
export interface UserInterface {
   userId: number;
   username: string;
   password: string;
   role: string;
}

// Sale Interface (related to sales transactions)
export interface SaleInterface {
   userId: number;
   total: number;
   paymentMethod: string;
   notes: string;
}

export interface UseCheckoutPropsInterface {
   cart: CartInterface;
   user: UserInterface | null;
   setCart: React.Dispatch<React.SetStateAction<CartInterface>>;
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
   activeCategoryId: number | null;
   onClick: (categoryId: number | null, categoryName: string) => void;
}
