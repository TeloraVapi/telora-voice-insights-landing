import React, { useState } from "react";
import { Search, Bell, HelpCircle, ChevronDown } from "lucide-react";

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      className="fixed top-0 left-60 right-0 h-16 z-30 font-['Inter',system-ui,'SF Pro',sans-serif]"
      style={{ backgroundColor: "rgb(243, 241, 245)" }}
    >
      <div className="flex items-center justify-end h-full px-6">
        {/* Border line that matches content width */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gray-200"></div>
        {/* Right side - Search, notifications, help, user menu */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
            <Search className="w-5 h-5 opacity-70" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <Bell className="w-5 h-5 opacity-70" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Help */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
            <HelpCircle className="w-5 h-5 opacity-70" />
          </button>

          {/* Vertical line separator */}
          <div className="h-6 w-px bg-gray-300"></div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            >
              <div className="w-8 h-8 bg-violet-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-violet-700">G</span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  Gymshark
                </div>
              </div>
              <ChevronDown className="w-4 h-4 opacity-70" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Billing
                </a>
                <hr className="my-1" />
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
