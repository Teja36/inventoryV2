import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  photoUrl: string | null;
  role: string;
  status: boolean;
};

type UserState = {
  user: User;
  setUser: (user: User) => void;
  updateUserDetails: (user: Pick<User, "name" | "phoneNo">) => void;
  updatePhotoUrl: (photoUrl: string) => void;
  clearUser: () => void;
};

const initialState: User = {
  id: "",
  name: "",
  email: "",
  phoneNo: "",
  photoUrl: null,
  role: "",
  status: false,
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: { ...initialState },
      setUser(user) {
        set({ user });
      },
      updateUserDetails(user) {
        set((state) => ({ user: { ...state.user, ...user } }));
      },
      updatePhotoUrl(photoUrl) {
        set((state) => ({ user: { ...state.user, photoUrl: photoUrl } }));
      },
      clearUser() {
        set({
          user: {
            ...initialState,
          },
        });
      },
    }),
    {
      name: "inventory-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserStore;
