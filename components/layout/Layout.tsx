import Header from "./Header";
import Sidebar, { DrawerProvider } from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DrawerProvider>
      <Header />
      <Sidebar />
      {children}
    </DrawerProvider>
  );
}
