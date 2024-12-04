import React from "react";

interface SidebarProps extends React.PropsWithChildren {}

export const RightSidebar = ({ children }: SidebarProps) => {
  return (
    <div className="p-4 h-full border-l border-gray-200 bg-white shadow-lg">
      {children}
    </div>
  );
};
