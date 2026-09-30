"use client";

import SocialShare from './SocialShare';
import ThemeToggle from './ThemeToggle';
import { User, Home, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePermissions } from '@/hooks/usePermissions';

interface DataType {
    sectionClass?: string;
}

const HeaderTopV1 = ({ sectionClass }: DataType) => {
    const { isAuthenticated, isMember } = usePermissions();

    const authTarget = !isAuthenticated
        ? { href: "/login", label: "Login" }
        : isMember
        ? { href: "/portal", label: "Portal" }
        : { href: "/", label: "Dashboard" };

    return (
        <div className={`top-bar-area top-bar-style-one bg-theme text-light ${sectionClass ?? ""}`}>
            <div className="container">
                <div className="row align-center">

                    {/* Left — Social icons */}
                    <div className="col-lg-7">
                        <div className="social">
                            <ul>
                                <SocialShare />
                            </ul>
                        </div>
                    </div>

                    {/* Right — Home + Theme toggle + Login / Portal */}
                    <div className="col-lg-5 text-end">
                        <div className="item-flex" style={{ justifyContent: "flex-end", gap: "12px" }}>

                            {/* Restaurant Home Button (Opens in new tab to prevent CSS bleeding) */}
                            <div className="d-flex align-items-center">
                                <Link
                                    href="/restaurant"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Restaurant Home"
                                    title="Restaurant Home"
                                    style={{
                                        position: "relative",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "1.9em",
                                        padding: "0 10px",
                                        gap: "6px",
                                        border: "none",
                                        borderRadius: 6,
                                        background: "transparent",
                                        cursor: "pointer",
                                        color: "inherit",
                                        flexShrink: 0,
                                        fontSize: "inherit",
                                        lineHeight: 1,
                                        textDecoration: "none",
                                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
                                        transition: "box-shadow 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.7)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.25)";
                                    }}
                                >
                                    <Home style={{ width: "1em", height: "1em" }} />
                                    <span style={{ fontSize: "12px", fontWeight: 500, lineHeight: 1 }}>Home</span>
                                </Link>
                            </div>

                            {/* Theme toggle */}
                            <div className="d-flex align-items-center">
                                <ThemeToggle />
                            </div>

                            {/* Login / Portal / Dashboard Button (Opens in new tab to load clean CSS) */}
                            <div className="d-flex align-items-center">
                                <Link
                                    href={authTarget.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={authTarget.label}
                                    title={authTarget.label}
                                    style={{
                                        position: "relative",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "1.9em",
                                        padding: "0 10px",
                                        gap: "6px",
                                        border: "none",
                                        borderRadius: 6,
                                        background: "transparent",
                                        cursor: "pointer",
                                        color: "inherit",
                                        flexShrink: 0,
                                        fontSize: "inherit",
                                        lineHeight: 1,
                                        textDecoration: "none",
                                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
                                        transition: "box-shadow 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.7)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.25)";
                                    }}
                                >
                                    {authTarget.label === "Dashboard" ? (
                                        <LayoutDashboard style={{ width: "1em", height: "1em" }} />
                                    ) : (
                                        <User style={{ width: "1em", height: "1em" }} />
                                    )}
                                    <span style={{ fontSize: "12px", fontWeight: 500, lineHeight: 1 }}>{authTarget.label}</span>
                                </Link>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HeaderTopV1;
