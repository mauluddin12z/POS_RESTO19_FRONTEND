import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Reusable component for Action Buttons
const ActionButtons = ({
   onEdit,
   onDelete,
   onInfo,
   isPaid,
}: {
   onEdit: () => void;
   onDelete: () => void;
   onInfo: () => void;
   isPaid: boolean;
}) => (
   <div className="flex gap-2 mt-2 justify-between">
      <div className="flex gap-2">
         <button
            onClick={onEdit}
            className="border border-blue-300 rounded-lg text-blue-500 text-xs p-2.5 hover:bg-blue-600 hover:text-white cursor-pointer"
         >
            <FontAwesomeIcon icon={faEdit} />
         </button>
         <button
            onClick={onDelete}
            className="border border-red-300 rounded-lg text-red-500 text-xs p-2.5 hover:bg-red-600 hover:text-white cursor-pointer"
         >
            <FontAwesomeIcon icon={faTrash} />
         </button>
      </div>
      {!isPaid && (
         <button
            onClick={onInfo}
            className="border bg-blue-600 rounded-lg text-xs text-white p-2.5 hover:bg-blue-700 hover:text-white cursor-pointer"
         >
            Pay Bill
         </button>
      )}
   </div>
);
export default ActionButtons;
