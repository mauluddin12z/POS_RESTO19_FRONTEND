// utils/dateFormat.js

export function formatDateToIndonesian(date: any) {
   const formattedDate = new Intl.DateTimeFormat("id-ID", {
      weekday: "long", // e.g., "Rabu"
      day: "numeric", // e.g., "27"
      month: "long", // e.g., "Januari"
      year: "numeric", // e.g., "2025"
   }).format(new Date(date));

   const formattedTime = new Intl.DateTimeFormat("id-ID", {
      hour: "numeric", // e.g., "14"
      minute: "numeric", // e.g., "30"
      second: "numeric", // e.g., "00"
      hour12: false, // Use 24-hour format
   }).format(new Date(date));

   return { date: formattedDate, time: formattedTime };
}
