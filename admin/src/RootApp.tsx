import React from "react";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginView } from "./components/auth/LoginView";
import App from "./App";

const AdminShell: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#736854]">
          <Loader2 className="w-8 h-8 animate-spin text-[#173D2A]" />
          <p className="text-sm font-medium">Loading admin session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <App />;
};

const RootApp: React.FC = () => {
  return (
    <AuthProvider>
      <AdminShell />
    </AuthProvider>
  );
};

export default RootApp;
