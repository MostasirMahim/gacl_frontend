import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  item_id: number;
  name: string;
  price: number;
  quantity: number;
  portion: "full" | "half";
  cover_image?: string;
  sku?: string;
}

interface RestaurantCartState {
  carts: Record<string, CartItem[]>; // Keyed by restaurant slug
  addItem: (restaurantSlug: string, item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeItem: (restaurantSlug: string, itemId: number, portion: "full" | "half") => void;
  updateQuantity: (restaurantSlug: string, itemId: number, portion: "full" | "half", quantity: number) => void;
  clearCart: (restaurantSlug: string) => void;
}

export const useRestaurantCartStore = create<RestaurantCartState>()(
  persist(
    (set, get) => ({
      carts: {},

      addItem: (restaurantSlug, item, quantity) => {
        set((state) => {
          const currentCart = state.carts[restaurantSlug] || [];
          const existingIndex = currentCart.findIndex(
            (x) => x.item_id === item.item_id && x.portion === item.portion
          );

          let newCart: CartItem[];
          if (existingIndex > -1) {
            newCart = currentCart.map((x, idx) =>
              idx === existingIndex
                ? { ...x, quantity: x.quantity + quantity }
                : x
            );
          } else {
            newCart = [...currentCart, { ...item, quantity }];
          }

          return {
            carts: {
              ...state.carts,
              [restaurantSlug]: newCart,
            },
          };
        });
      },

      removeItem: (restaurantSlug, itemId, portion) => {
        set((state) => {
          const currentCart = state.carts[restaurantSlug] || [];
          const newCart = currentCart.filter(
            (x) => !(x.item_id === itemId && x.portion === portion)
          );
          return {
            carts: {
              ...state.carts,
              [restaurantSlug]: newCart,
            },
          };
        });
      },

      updateQuantity: (restaurantSlug, itemId, portion, quantity) => {
        set((state) => {
          const currentCart = state.carts[restaurantSlug] || [];
          if (quantity <= 0) {
            const newCart = currentCart.filter(
              (x) => !(x.item_id === itemId && x.portion === portion)
            );
            return {
              carts: {
                ...state.carts,
                [restaurantSlug]: newCart,
              },
            };
          }

          const newCart = currentCart.map((x) =>
            x.item_id === itemId && x.portion === portion
              ? { ...x, quantity }
              : x
          );

          return {
            carts: {
              ...state.carts,
              [restaurantSlug]: newCart,
            },
          };
        });
      },

      clearCart: (restaurantSlug) => {
        set((state) => ({
          carts: {
            ...state.carts,
            [restaurantSlug]: [],
          },
        }));
      },
    }),
    {
      name: "restaurant_cart_storage",
      storage: typeof window !== "undefined"
        ? createJSONStorage(() => localStorage)
        : undefined,
    }
  )
);
