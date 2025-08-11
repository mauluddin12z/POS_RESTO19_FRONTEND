import QuantityControl from "../cart/QuantityControl";
import Image, { ImageLoader } from "next/image";
import { priceFormat } from "@/app/utils/priceFormat";
import { CartInterface, ProductInterface } from "@/app/types";

export interface ProductCardPropsInterface {
   id: number;
   productName: string;
   productImageUrl: string;
   productPrice: number;
   stock: number;
   onAddToCart: (product: ProductInterface) => void;
   cart: CartInterface;
   onQuantityChange: (id: number, quantity: number) => void;
}

export default function ProductCard({
   id,
   productName,
   productImageUrl,
   productPrice,
   stock,
   onAddToCart,
   cart,
   onQuantityChange,
}: ProductCardPropsInterface) {
   const myLoader: ImageLoader = ({ src }) => src;
   const cartItem = cart.cartItems.find((item) => item.id === id);

   return (
      <div
         className={`flex flex-col h-full w-full duration-200 bg-white border border-gray-200 overflow-hidden rounded-lg shadow-sm relative ${
            stock > 0 && "hover:scale-[101%]"
         }`}
      >
         {/* Overlay if out of stock */}
         {stock === 0 && (
            <div className="absolute inset-0 bg-gray-900/80 z-10 flex items-center justify-center text-white text-lg font-semibold rounded-lg">
               Out of Stock
            </div>
         )}

         {/* Product Image */}
         <div className="w-full aspect-[5/4] relative">
            <Image
               className="object-cover rounded-t-lg"
               loader={myLoader}
               src={productImageUrl ?? "no-image.png"}
               fill
               priority
               unoptimized
               alt={productName}
            />
         </div>

         {/* Item Content */}
         <div className="flex flex-col flex-grow h-full p-4 gap-3">
            <div>
               <h5 className="text-xs sm:text-sm font-semibold tracking-tight text-gray-900">
                  {productName}
               </h5>
               <span className="text-sm sm:text-base font-bold text-gray-900">
                  {priceFormat(productPrice)}
               </span>
            </div>

            <div className="flex mt-auto w-full justify-center">
               {cartItem ? (
                  <QuantityControl
                     item={cartItem}
                     onQuantityChange={onQuantityChange}
                  />
               ) : (
                  <button
                     className={`w-full h-8 bg-white text-green-700 border border-green-700 font-medium rounded-full text-sm text-center ${
                        stock > 0 &&
                        "cursor-pointer hover:text-white hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300"
                     }`}
                     onClick={() =>
                        onAddToCart({
                           id,
                           name: productName,
                           imageUrl: productImageUrl,
                           price: productPrice,
                           stock: stock,
                        })
                     }
                     disabled={stock === 0}
                  >
                     Order
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}
