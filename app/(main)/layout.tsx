import { SidebarProvider } from "@/globals/contexts/SidebarContext";
import Sidebar from "@/globals/components/shared/Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
