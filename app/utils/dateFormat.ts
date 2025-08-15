// utils/dateFormat.js

export function formatDateToIndonesian(date: any) {
   const formattedDate = new Intl.DateTimeFormat("id-ID", {
      // weekday: "long", // e.g., "Rabu"
      day: "numeric", // e.g., "27"
      month: "long", // e.g., "Januari"
      year: "numeric", // e.g., "2025"
   }).format(new Date(date));

   // Get the time parts individually
   const dateObj = new Date(date);
   const hours = dateObj.getHours().toString().padStart(2, "0");
   const minutes = dateObj.getMinutes().toString().padStart(2, "0");
   const seconds = dateObj.getSeconds().toString().padStart(2, "0");

   // Split the time with ":"
   const formattedTime = `${hours}:${minutes}:${seconds}`;

   return { date: formattedDate, time: formattedTime };
}
