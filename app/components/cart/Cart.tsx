import { priceFormat } from "@/app/utils/priceFormat";
import { faCartShopping, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import CartItem from "./CartItem";
import { CartInterface, CartItemInterface } from "@/app/types";

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

const Cart: React.FC<CartPropsInterface> = ({
   orderId,
   cartItems,
   stockMessage,
   onRemove,
   onQuantityChange,
   onNotesChange,
   onOrder,
   isSubmitting,
   closeCart,
}) => {
   const total = cartItems.reduce(
      (sum, cartItems) => sum + cartItems.price * cartItems.quantity,
      0
   );

   return (
      <div className="w-full h-full overflow-y-auto flex flex-col border border-gray-200 lg:rounded-lg px-4 bg-white">
         <div className="flex justify-between mb-2 pb-2 border-b border-gray-200 gap-x-2 items-center sticky top-0 bg-white pt-4">
            <h2 className="text-lg font-semibold">
               <FontAwesomeIcon icon={faCartShopping} />
               Order #
               {cartItems.length === 0 ? "" : orderId ? orderId + 1 : "1"}
            </h2>
         </div>

         {cartItems.length === 0 ? (
            <div className="text-gray-500 text-center px-4 pt-10 pb-14">
               Your cart is empty.
            </div>
         ) : (
            <div className="flex flex-col gap-4">
               {cartItems.map((item) => (
                  <CartItem
                     key={item.id}
                     item={item}
                     stockMessage={stockMessage}
                     onQuantityChange={onQuantityChange}
                     onNotesChange={onNotesChange}
                     onRemove={onRemove}
                  />
               ))}
            </div>
         )}

         {cartItems.length > 0 && (
            <>
               {/* Summary + Order */}
               <div className="sticky bottom-0 bg-white pt-2 pb-4 border-t border-gray-200 mt-auto">
                  <div className="flex justify-between mb-3">
                     <span className="text-sm font-medium">Total:</span>
                     <span className="text-sm font-semibold">
                        {priceFormat(total)}
                     </span>
                  </div>
                  <button
                     onClick={() => {
                        onOrder();
                        closeCart();
                     }}
                     className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium ${
                        isSubmitting
                           ? "opacity-50 cursor-not-allowed"
                           : "cursor-pointer"
                     }`}
                  >
                     {isSubmitting ? "Loading..." : "Add a new order"}
                  </button>
                  <button
                     onClick={() => {
                        onRemove(0), closeCart();
                     }}
                     className={`w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-200 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer mt-2`}
                  >
                     Cancel Order
                  </button>
               </div>
            </>
         )}
      </div>
   );
};

export default Cart;
