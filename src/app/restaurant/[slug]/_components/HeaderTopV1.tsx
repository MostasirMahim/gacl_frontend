"use client";

import SocialShare from './SocialShare';
import ThemeToggle from './ThemeToggle';
import { User } from 'lucide-react';
import Link from 'next/link';

interface DataType {
    sectionClass?: string;
}

const HeaderTopV1 = ({ sectionClass }: DataType) => {
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

                    {/* Right — Theme toggle + Login */}
                    <div className="col-lg-5 text-end">
                        <div className="item-flex" style={{ justifyContent: "flex-end", gap: "12px" }}>

                            {/* Theme toggle */}
                            <div className="d-flex align-items-center">
                                <ThemeToggle />
                            </div>

                            {/* Login Button */}
                            <div className="d-flex align-items-center">
                                <Link
                                    href="/login"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Login"
                                    title="Login"
                                    style={{
                                        position: "relative",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "1.9em",
                                        height: "1.9em",
                                        padding: 0,
                                        border: "none",
                                        borderRadius: 6,
                                        background: "transparent",
                                        cursor: "pointer",
                                        color: "inherit",
                                        flexShrink: 0,
                                        fontSize: "inherit",
                                        lineHeight: 1,
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
                                    <User style={{ width: "1em", height: "1em" }} />
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
