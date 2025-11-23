'use client'

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      <div className="flex h-12 items-center justify-center px-4">
        <p className="text-sm text-gray-600">
          &copy; {currentYear} GoolStar. Tournament Management System.
        </p>
      </div>
    </footer>
  );
}
