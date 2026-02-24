import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AppState {
  isSidebarOpen: boolean;
  currentUser: User | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  currentUser: {
    id: '1',
    name: 'Alex Architect',
    email: 'alex@gmate.dev',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setCurrentUser: (user) => set({ currentUser: user }),
}));
