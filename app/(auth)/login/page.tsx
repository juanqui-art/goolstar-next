import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <div className="space-y-6 p-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">GoolStar</h1>
            <p className="mt-2 text-sm text-gray-600">
              Tournament Management System
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </Card>
    </div>
  );
}
