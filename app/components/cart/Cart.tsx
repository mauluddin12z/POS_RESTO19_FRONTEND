import { CartPropsInterface } from "@/app/types";
import { priceFormat } from "@/app/utils/priceFormat";
import { faCartShopping, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import CartItem from "./CartItem";
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
      <div className="w-full h-full overflow-y-auto flex flex-col border border-gray-200 rounded-lg px-4 bg-white">
         <div className="flex justify-between  mb-2 pb-2 border-b border-gray-200 gap-x-2 items-center sticky top-0 bg-white pt-4">
            <h2 className="text-lg font-semibold">
               <FontAwesomeIcon icon={faCartShopping} />
               Order #
               {cartItems.length === 0 ? "" : orderId ? orderId + 1 : "1"}
            </h2>
            <button
               onClick={() => {
                  onRemove(0), closeCart();
               }}
               className="h-full flex justify-center items-center p-2 text-xs text-white bg-red-400 rounded-lg border border-gray-200 hover:bg-red-600 cursor-pointer"
            >
               <FontAwesomeIcon icon={faTrashAlt} />
            </button>
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
               </div>
            </>
         )}
      </div>
   );
};

export default Cart;
