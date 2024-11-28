import { Footer, Header } from "@/widgets";
import React from "react";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Main Content */}
      <main className="flex-grow p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
