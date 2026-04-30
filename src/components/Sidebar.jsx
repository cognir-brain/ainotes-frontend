import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Menu, MessageSquare, Clock, LogOut, User } from "lucide-react";
import SidebarItem from "./SidebarItem";
import NoteList from "./NoteList";
import UserAvatar from "./UserAvatar";
import logo from '../assets/logo.png';
import imgDefault from '../assets/logo.png';
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/auth/authSlice";
import { backendUrl } from "../utils/api";
// import { fetchHistory } from "../store/history/action";

export default function Sidebar() {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.auth.profile);
  const history = useSelector((s) => s.history);
  // console.log("Sidebar", history);
  // 🔥 Lazy init (tidak perlu useEffect untuk localStorage)
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const [autoCollapsed, setAutoCollapsed] = useState(false);

  // useEffect(() => {
  //   dispatch(fetchHistory());
  //   console.log("Sidebar:", history);
  // }, [dispatch]);


  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");

    const handler = (e) => {
      setAutoCollapsed(e.matches);
    };

    handler(media);
    media.addEventListener("change", handler);

    return () => media.removeEventListener("change", handler);
  }, []);

  const onLogout = async () => {
    await dispatch(logout());
    window.location.href = '/login';
  }

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", next ? "true" : "false");
  };

  const openGoogle = () => {
    window.location.href = `${backendUrl}/api/auth/google`;
  }

  const isCollapsed = autoCollapsed || collapsed;

  const menu = [
    { href: "/", label: "New AI Notes", Icon: MessageSquare },
    { href: "/", label: "Notes History", Icon: Clock },
  ];

  // 🔥 Dummy user (ganti dengan auth context kamu)
  const user = {
    name: profile?.name || "Guest",
    email: profile?.email || "guest@email.com",
    avatar: profile?.avatar || imgDefault,
  };

  return (
    <motion.aside
      initial={{ width: isCollapsed ? 64 : 288 }}
      animate={{ width: isCollapsed ? 64 : 288 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="sidebar sticky top-0 left-0 z-40 h-screen bg-white shadow-md overflow-hidden flex flex-col rounded-[0_20px_20px_0]"
    >
      {/* Top */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            width={24}
            height={24}
            className="object-contain"
          />

          {!isCollapsed && (
            <div>
              <div className="font-semibold">Cognir AI</div>
              <div className="text-xs text-slate-500">
                AI-Powered Platform
              </div>
            </div>
          )}
        </div>

        <button
          onClick={toggleCollapse}
          className="p-2 rounded hover:bg-slate-100"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Menu */}
      <nav className="px-2">
        <div className="space-y-1">
          {menu.map((m) => (
            <SidebarItem
              key={m.href}
              href={m.href}
              label={m.label}
              Icon={m.Icon}
              collapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>

      <div className="border-t my-4" />

      {/* Notes */}
      <div className="flex-1 overflow-auto px-2">
        {!isCollapsed ? (
          <NoteList history={history}/>
        ) : (
          <div className="flex flex-col gap-2 items-center py-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-slate-300"
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t mt-4" />

      {/* User */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {profile?.name ? (
          <>
            <UserAvatar name={user.name} image={user.avatar} />

            {!isCollapsed && (
              <div className="flex-1">
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>
            )}

            <button
              className="ml-auto p-2 rounded hover:bg-slate-100"
              title="Logout"
              onClick={onLogout}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div className="mt-4 text-center">
            <button
              onClick={openGoogle}
              className="inline-flex items-center gap-2 px-4 py-2 border rounded"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="g"
                className="w-4 h-4"
              />
              Sign in with Google
            </button>
          </div>
        )}
        </div>
      </div>
    </motion.aside>
  );
}
