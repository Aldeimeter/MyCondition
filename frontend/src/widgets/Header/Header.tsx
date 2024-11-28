import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { LogoutBtn } from "../LogoutBtn/LogoutBtn";

export const Header: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
            </li>
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
              <li>
                <Link to="/users" className="hover:text-gray-300">
                  Users
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <span>{user.username}</span>
          <LogoutBtn />
        </div>
      </div>
    </header>
  );
};
