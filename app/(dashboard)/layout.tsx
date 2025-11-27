import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { defaultNavItems, Sidebar } from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/auth/dal";
import { Suspense } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current user with REAL validation from database
  const user = await getCurrentUser();

  return (
    <div className="flex h-screen flex-col">
      {/* Navbar */}
      <Navbar user={user ?? undefined} />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Suspense fallback={<div className="w-64 border-r bg-gray-50" />}>
          <Sidebar items={defaultNavItems} user={user} />
        </Suspense>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
