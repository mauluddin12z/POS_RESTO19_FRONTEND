const statusStyles: { [key: string]: string } = {
   paid: "bg-green-100 text-green-600",
   unpaid: "bg-red-100 text-red-600",
   unknown: "bg-gray-100 text-gray-600", // Added fallback style for unknown status
};

const PaymentStatus: React.FC<{ status: string | undefined }> = ({
   status,
}) => {
   // Provide a fallback if status is undefined
   const statusKey = status ?? "unknown"; // Default to "unknown" if status is undefined

   return (
      <div
         className={`text-xs border rounded-full font-semibold px-3.5 py-1.5 ${statusStyles[statusKey]}`}
      >
         {status || "Unknown"}
      </div>
   );
};


export default PaymentStatus