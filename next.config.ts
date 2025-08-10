module.exports = {
   async rewrites() {
      return [
         {
            source: "/api/:path*",
            destination: "https://pos-resto-19-backend.vercel.app/:path*",
         },
      ];
   },
};
