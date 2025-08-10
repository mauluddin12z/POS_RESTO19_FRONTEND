module.exports = {
   async rewrites() {
      return [
         {
            source: "/api",
            destination: "https://pos-resto-19-frontend.vercel.app",
         },
      ];
   },
};
