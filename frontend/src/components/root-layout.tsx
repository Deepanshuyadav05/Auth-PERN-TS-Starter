import { Outlet } from "react-router";
import { useAuthInit } from "../hooks/use-auth-init.ts";
import { useAuthStore } from "../store/auth-store.ts";

function RootLayout() {
    useAuthInit();
    const isLoading = useAuthStore((s) => s.isLoading);

    if (isLoading) return <div>Loading...</div>;

    // a placeholder from React Router meaning "put the matching child page here". At /login it shows <Login />, and at /dashboard it shows <Dashboard />.
    // The layout wraps every page without you repeating code
    return <Outlet />;   // shows the page that matches the URL
}

export default RootLayout;