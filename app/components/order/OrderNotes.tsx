import React from "react";
export interface OrderNotesPropsInterface {
   itemId: number;
   onNotesChange: (itemId: number, notes: string) => void;
   currentOrderNotes: string;
}
const OrderNotes: React.FC<OrderNotesPropsInterface> = ({
   itemId,
   onNotesChange,
   currentOrderNotes,
}) => {
   return (
      <input
         id="order-notes"
         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5"
         placeholder="Enter your notes..."
         type="text"
         value={currentOrderNotes}
         onChange={(e) => onNotesChange(itemId, e.target.value)}
      />
   );
};

export default OrderNotes;
