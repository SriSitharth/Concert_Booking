import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

export const metadata = {
    title: "41 Sounds - Live Concert",
    description: "pixels is a next.js template for building modern, fast, and secure saas applications.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, width: '100%' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
}