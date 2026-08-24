"use client";
import React from "react";

interface Props {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

export default function DashboardCard({ title, value, icon }: Props) {
  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      {icon && <div className="text-rose-500 text-3xl">{icon}</div>}
    </div>
  );
}
