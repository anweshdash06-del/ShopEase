import React from "react";

export const Spinner = ({ full = false }) => (
  <div className={`flex items-center justify-center ${full ? "min-h-[60vh]" : "py-10"}`}>
    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
  </div>
);

export const PageHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
    {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4">
    {icon}
    <h3 className="text-lg font-semibold text-gray-800 mt-4">{title}</h3>
    {description && <p className="text-gray-500 mt-1 max-w-sm">{description}</p>}
    {action}
  </div>
);
