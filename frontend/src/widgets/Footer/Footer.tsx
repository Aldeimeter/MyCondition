/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 VAVJS. </p>
        <nav className="mt-2">
          <ul className="flex justify-center space-x-4">
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Random
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Footer
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Stuff
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};
