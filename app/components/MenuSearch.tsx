import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
   searchQuery: string;
   setSearchQuery: (value: string) => void;
}

export default function MenuSearch({ searchQuery, setSearchQuery }: Props) {
   return (
      <div className="w-full sm:w-4/12 lg:w-3/12" role="search">
         <label htmlFor="menu-search" className="sr-only">
            Search for menu
         </label>
         <div className="relative">
            <div className="flex justify-center items-center absolute inset-y-0 left-3 h-full">
               <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
            </div>
            <input
               id="menu-search"
               type="search"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search menus..."
               className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
               aria-label="Search menus"
            />
         </div>
      </div>
   );
}
