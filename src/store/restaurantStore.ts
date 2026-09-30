
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


export const useRestaurantCartStore = create<any>()(
  persist(
    (set) => ({
      cart: [],
      restaurant: null,
      setRestaurantCart: (item: any) => set((state: any) => ({ cart: [...state.cart, item] })),
      setRestaurant: (restaurant: any) => set({ restaurant }),
      clearCart: () => set({ cart: [] }),
      removeItem: (id: any) =>
        set((state: any) => ({
          cart: state.cart.filter((item: any) => item.id !== id),
        })),
      addItem: (item: any, quantity: number = 1) =>
        set((state: any) => {
          const exists = state.cart.find((x: any) => x.id === item.id);
          if (exists) {
            return {
              cart: state.cart.map((x: any) =>
                x.id === item.id ? { ...x, quantity: x.quantity + quantity } : x
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              {
                id: item.id,
                name: item.name,
                selling_price: Number(item.selling_price || item.price || 0),
                quantity: quantity,
                item_code: item.item_code,
              },
            ],
          };
        }),
      updateQuantity: (id: any, delta: number) =>
        set((state: any) => ({
          cart: state.cart
            .map((item: any) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean),
        })),
    }),
    {
      name: "restaurant_cart_storage",
      storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined,
    }
  )
);