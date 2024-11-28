import React from "react";
interface SidebarProps extends React.PropsWithChildren {}
export const RightSidebar = ({ children }: SidebarProps) => {
  return <div>{children}</div>;
};
