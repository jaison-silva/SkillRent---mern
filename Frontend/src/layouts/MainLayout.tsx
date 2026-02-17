import { Navbar } from "../components/Nabar";
import { Footer } from "../components/Footer";
import { Outlet } from "react-router-dom";

export function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

