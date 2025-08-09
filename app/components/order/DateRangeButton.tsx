import React from "react";

type DateRangeOption = {
   name: string;
   value: string;
};

type Props = {
   value: string;
   onChange: (value: string) => void;
};

const dateRangeValues: DateRangeOption[] = [
   { name: "All", value: "" },
   { name: "Today", value: "today" },
   { name: "This Month", value: "thisMonth" },
   { name: "This Year", value: "thisYear" },
];

const DateRangeButtonGroup: React.FC<Props> = ({ value, onChange }) => {
   return (
      <div className="flex gap-2 flex-wrap">
         {dateRangeValues.map((dataRange, index) => {
            const isActive = value === dataRange.value;

            return (
               <button
                  key={index}
                  onClick={() => onChange(dataRange.value)}
                  disabled={isActive}
                  className={`flex justify-center items-center
                     ${
                        isActive
                           ? "bg-blue-600 text-white cursor-default"
                           : "bg-gray-100 hover:bg-gray-200 text-gray-900 cursor-pointer"
                     }
                     font-medium rounded-lg text-sm px-2 py-2 text-center transition duration-150`}
               >
                  {dataRange.name}
               </button>
            );
         })}
      </div>
   );
};

export default DateRangeButtonGroup;
