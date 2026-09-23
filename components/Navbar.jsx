"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white">

      <h1 className="text-xl font-bold">
        Product Admin
      </h1>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700"
      >
        Logout
      </button>

    </nav>
  );
}