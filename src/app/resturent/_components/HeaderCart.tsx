"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

const HeaderCart = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <li className="dropdown">
                <Link href="#" className="dropdown-toggle" data-toggle="dropdown">
                    <i className="far fa-shopping-cart" />
                    <span className="badge">0</span>
                </Link>

                <ul className="dropdown-menu cart-list">
                    <li className="total">
                        <p>Your cart is empty.</p>
                    </li>
                </ul>
            </li>
        </>
    );
};

export default HeaderCart;
