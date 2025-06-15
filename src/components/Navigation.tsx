import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Package,
  CreditCard,
  Settings,
  ChevronDown,
  Users,
  HelpCircle,
  FileText,
  MessageSquare,
  Shield,
  UserPlus,
  Layers,
} from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active item based on current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path === "/assistants") return "assistants";
    if (path === "/orders") return "orders";
    return "dashboard";
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  const pagesItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: true,
      route: "/dashboard",
    },
    {
      id: "assistants",
      label: "Assistants",
      icon: Bot,
      active: true,
      route: "/assistants",
    },
    {
      id: "orders",
      label: "Orders",
      icon: Package,
      active: true,
      route: "/orders",
    },
  ];

  const mainNavigationItems = [
    { id: "customers", label: "Customers", icon: Users, active: false },
    { id: "billing", label: "Billing", icon: CreditCard, active: false },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      active: false,
      badge: "4",
    },
    { id: "reports", label: "Reports", icon: FileText, active: false },
    { id: "settings", label: "Settings", icon: Settings, active: false },
    { id: "help", label: "Help & Support", icon: HelpCircle, active: false },
  ];

  const moreItems = [
    {
      id: "authentication",
      label: "Authentication",
      icon: Shield,
      active: false,
    },
    { id: "onboarding", label: "Onboarding", icon: UserPlus, active: false },
    { id: "components", label: "Components", icon: Layers, active: false },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 z-40 font-['Inter',sans-serif] rounded-tr-2xl rounded-br-2xl">
      {/* Logo */}
      <div className="flex items-center px-6 py-6">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center opacity-90"
          style={{ backgroundColor: "#7a65ff" }}
        >
          <div className="w-5 h-5 bg-white rounded-sm transform rotate-45"></div>
        </div>
        <span className="ml-3 text-xl font-semibold text-gray-600">Telora</span>
      </div>

      {/* Navigation */}
      <nav className="px-4">
        {/* PAGES Section */}
        <div className="mb-6">
          <h3 className="px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-[0.08em]">
            PAGES
          </h3>

          <ul className="mt-2 space-y-1">
            {pagesItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeItem;
              const isClickable = item.active;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (isClickable && item.route) {
                        setActiveItem(item.id);
                        navigate(item.route);
                      }
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-normal rounded-lg transition-all duration-150 ease-in-out cursor-pointer ${
                      isActive
                        ? ""
                        : isClickable
                        ? "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        : "text-gray-400"
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: "rgba(122, 101, 255, 0.1)",
                            color: "#7a65ff",
                          }
                        : {}
                    }
                  >
                    <Icon
                      className={`w-5 h-5 mr-3 transition-colors duration-150 ease-in-out opacity-70 ${
                        isActive
                          ? ""
                          : isClickable
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                      style={isActive ? { color: "#7a65ff" } : {}}
                    />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Main Navigation Items */}
        <ul className="space-y-1 mb-6">
          {mainNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;
            const isClickable = item.active;

            return (
              <li key={item.id}>
                <button
                  onClick={() => isClickable && setActiveItem(item.id)}
                  className={`group w-full flex items-center justify-between px-3 py-2 text-sm font-normal rounded-lg transition-all duration-150 ease-in-out cursor-pointer ${
                    isActive
                      ? ""
                      : isClickable
                      ? "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      : "text-gray-700"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: "rgba(122, 101, 255, 0.1)",
                          color: "#7a65ff",
                        }
                      : {}
                  }
                >
                  <div className="flex items-center">
                    <Icon
                      className={`w-5 h-5 mr-3 transition-colors duration-150 ease-in-out opacity-70 ${
                        isActive
                          ? ""
                          : isClickable
                          ? "text-gray-600"
                          : "text-gray-700"
                      }`}
                      style={isActive ? { color: "#7a65ff" } : {}}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      style={{ backgroundColor: "#7a65ff" }}
                      className="text-white text-xs font-medium px-2 py-0.5 rounded-full"
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* MORE Section */}
        <div>
          <h3 className="px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-[0.08em]">
            MORE
          </h3>
          <ul className="mt-2 space-y-1">
            {moreItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <button className="group w-full flex items-center justify-between px-3 py-2 text-sm font-normal text-gray-700 cursor-pointer transition-all duration-150 ease-in-out">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3 text-gray-700 opacity-70" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
