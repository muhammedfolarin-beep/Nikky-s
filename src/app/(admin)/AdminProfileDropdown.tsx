"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Settings, User as UserIcon } from "lucide-react";

interface AdminProfileDropdownProps {
  name: string;
  role: string;
  imageUrl?: string | null;
}

export default function AdminProfileDropdown({ name, role, imageUrl }: AdminProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 py-1 px-2 rounded-lg transition-colors text-left"
      >
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-500 capitalize">{role.toLowerCase()}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative border border-gray-300 shrink-0">
          {imageUrl ? (
            <Image src={imageUrl} alt={name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-midnight text-white font-semibold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-gray-100 md:hidden">
            <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
            <p className="text-xs text-gray-500 capitalize">{role.toLowerCase()}</p>
          </div>
          
          <Link 
            href="/admin/settings" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-midnight transition-colors"
          >
            <Settings size={16} />
            Settings
          </Link>
          
          <button 
            onClick={() => signOut({ callbackUrl: "/admin-login" })}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left mt-1"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
