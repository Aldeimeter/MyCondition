import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { LogoutBtn } from "../LogoutBtn/LogoutBtn";

export const Header: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";

  return (
    <header className="bg-gray-800 text-white fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Navigation */}
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/measures" className="hover:text-gray-300">
                Measures
              </Link>
            </li>
            <li>
              <Link to="/methods" className="hover:text-gray-300">
                Methods
              </Link>
            </li>
            {isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/advertisements"
                    className="hover:text-gray-300"
                  >
                    Advertisements
                  </Link>
                </li>
                <li>
                  <Link to="/admin/users" className="hover:text-gray-300">
                    Users
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <span className="font-semibold">{user.username}</span>
          <LogoutBtn />
        </div>
      </div>
    </header>
  );
};
