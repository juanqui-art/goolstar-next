import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { defaultNavItems, Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Get current user from auth when implemented
  const user = null;

  return (
    <div className="flex h-screen flex-col">
      {/* Navbar */}
      <Navbar user={user ?? undefined} />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar items={defaultNavItems} />

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
