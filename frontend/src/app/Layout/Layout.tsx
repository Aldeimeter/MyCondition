import { Advertisement, Footer, Header } from "@/widgets";
import React from "react";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-grow relative">
        {/* Footer (stacked above the Outlet and Sidebar) */}
        <Footer />

        {/* Content including Sidebar */}
        <main className="pt-16 pb-20">
          <Outlet />
        </main>
      </div>

      {/* Advertisement */}
      <Advertisement />
    </div>
  );
};
