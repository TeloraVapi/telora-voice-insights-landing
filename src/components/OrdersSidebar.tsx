import React from "react";
import {
  BarChart3,
  Package,
  MessageSquare,
  Settings,
  Home,
} from "lucide-react";

const OrdersSidebar = () => {
  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/", active: false },
    {
      icon: Package,
      label: "Orders",
      href: "/orders",
      active: true,
      badge: "33",
    },
    {
      icon: MessageSquare,
      label: "Feedback",
      href: "/feedback",
      active: false,
    },
    { icon: Settings, label: "Settings", href: "/settings", active: false },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="ml-3 text-xl font-semibold text-gray-900">
            Telora
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 ${
                      item.active ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">SJ</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
              <p className="text-xs text-gray-600">Premium Plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersSidebar;
