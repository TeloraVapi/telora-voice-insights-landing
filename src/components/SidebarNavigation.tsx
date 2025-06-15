import React, { useState } from "react";
import {
  Home,
  CreditCard,
  List,
  Wallet,
  ChevronDown,
  TrendingUp,
  Shield,
  FileText,
  Gift,
  Settings,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
} from "lucide-react";

const SidebarNavigation = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isCardsExpanded, setIsCardsExpanded] = useState(false);
  const [isProModeEnabled, setIsProModeEnabled] = useState(true);

  const generalItems = [
    { id: "Dashboard", label: "Dashboard", icon: Home, active: true },
    { id: "Payment", label: "Payment", icon: CreditCard },
    { id: "Transaction", label: "Transaction", icon: List },
    { id: "Cards", label: "Cards", icon: Wallet, hasDropdown: true },
  ];

  const supportItems = [
    { id: "Capital", label: "Capital", icon: TrendingUp },
    { id: "Vaults", label: "Vaults", icon: Shield },
    { id: "Reports", label: "Reports", icon: FileText },
    { id: "Earn", label: "Earn", icon: Gift, badge: "€ 150" },
  ];

  const bottomItems = [
    { id: "Settings", label: "Settings", icon: Settings },
    { id: "Help", label: "Help", icon: HelpCircle },
  ];

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full relative">
              <div
                className="absolute inset-0 bg-teal-600"
                style={{
                  clipPath: "polygon(0 0, 50% 0, 50% 50%, 0 50%)",
                }}
              ></div>
            </div>
          </div>
          <span
            className="text-xl font-semibold text-gray-900"
            style={{ fontFamily: "Helvetica, sans-serif" }}
          >
            Sequence
          </span>
        </div>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 px-4 py-6">
        {/* General Section */}
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 px-2">
            GENERAL
          </h3>
          <nav className="space-y-1">
            {generalItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeItem;

              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      setActiveItem(item.id);
                      if (item.id === "Cards") {
                        setIsCardsExpanded(!isCardsExpanded);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-teal-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span style={{ fontFamily: "Helvetica, sans-serif" }}>
                        {item.label}
                      </span>
                    </div>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isCardsExpanded ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Support Section */}
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 px-2">
            SUPPORT
          </h3>
          <nav className="space-y-1">
            {supportItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeItem;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span style={{ fontFamily: "Helvetica, sans-serif" }}>
                      {item.label}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItem;

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span style={{ fontFamily: "Helvetica, sans-serif" }}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Pro Mode Toggle */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-3 h-3 grid grid-cols-2 gap-0.5">
                <div className="w-1 h-1 bg-gray-600 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-sm"></div>
              </div>
            </div>
            <span
              className="text-sm font-medium text-gray-700"
              style={{ fontFamily: "Helvetica, sans-serif" }}
            >
              Pro Mode
            </span>
          </div>
          <button
            onClick={() => setIsProModeEnabled(!isProModeEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isProModeEnabled ? "bg-green-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isProModeEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b1e6?w=32&h=32&fit=crop&crop=face"
                alt="Young Alaska"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p
                className="text-sm font-medium text-gray-900"
                style={{ fontFamily: "Helvetica, sans-serif" }}
              >
                Young Alaska
              </p>
              <p
                className="text-xs text-gray-500"
                style={{ fontFamily: "Helvetica, sans-serif" }}
              >
                alskayng@gmail.com
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* Copyright */}
        <div className="mt-4">
          <p
            className="text-xs text-gray-400 text-center"
            style={{ fontFamily: "Helvetica, sans-serif" }}
          >
            © 2024 Sequence Inc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
