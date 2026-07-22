import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen relative">
      <Sidebar />
      <main className="md:pl-60 min-h-screen relative z-10">
        <div className="px-4 sm:px-6 lg:px-10 py-6 md:py-10 pb-24 md:pb-10 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
