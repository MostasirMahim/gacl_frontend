
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
    }),
    {
      name: "restaurant_cart_storage",
      storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined,
    }
  )
);