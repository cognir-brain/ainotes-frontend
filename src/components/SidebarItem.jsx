"use client";
import { Link } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
export default function SidebarItem({ href, label, Icon, collapsed = false, onClick }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className="flex items-center gap-3 px-2 py-2 rounded hover:bg-slate-50"
    >
      <Icon size={18} />
      {!collapsed && <span className="text-sm">{label}</span>}
    </Link>
  );
}
