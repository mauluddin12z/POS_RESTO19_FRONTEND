import React from "react";
import { OrderNotesPropsInterface } from "../types";

const OrderNotes: React.FC<OrderNotesPropsInterface> = ({
   onOrderNotes,
   currentOrderNotes,
}) => {
   return (
      <div className="flex flex-col mb-3">
         <div className="flex flex-col">
            <label htmlFor="order-notes" className="text-sm font-medium">
               Notes
            </label>
            <input
               id="order-notes"
               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5"
               placeholder="Enter your notes..."
               type="text"
               value={currentOrderNotes}
               onChange={(e) => onOrderNotes(e.target.value)}
            />
         </div>
      </div>
   );
};

export default OrderNotes;
