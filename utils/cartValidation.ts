import { CartInterface } from "@/types";

export const validateCart = (cart: CartInterface) => {
  if (cart.cartItems.length === 0) {
    return {
      valid: false,
      message: "Keranjang masih kosong.",
    };
  }

  for (const item of cart.cartItems) {
    // Custom price must be filled
    if (item.isCustomPrice && item.price <= 0) {
      return {
        valid: false,
        message: `Harga "${item.name}" belum diisi.`,
      };
    }
  }

  return {
    valid: true,
  };
};
