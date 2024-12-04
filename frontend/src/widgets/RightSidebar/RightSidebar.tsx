import React from "react";

interface SidebarProps extends React.PropsWithChildren {}

export const RightSidebar = ({ children }: SidebarProps) => {
  return (
    <div className="p-4 rounded-lg min-h-full border border-gray-200 bg-white shadow-sm">
      {children}
    </div>
  );
};
