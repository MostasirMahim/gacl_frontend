"use client"
import MainMenu from './MainMenu';
import useSubMenuToggle from './hooks/useSubMenuToggle';
import useSidebarMenu from './hooks/useSidebarMenu';
import Link from 'next/link';
import Image from 'next/image';
import useStickyMenu from './hooks/useStickyMenu';
import HeaderCart from './HeaderCart';

interface DataType {
    logoWhite?: boolean
}

const HeaderV6 = ({ logoWhite }: DataType) => {

    const { toggleSubMenu, isMenuOpen, getMenuStyle } = useSubMenuToggle();
    const { isOpen, openMenu, closeMenu } = useSidebarMenu();
    const isMenuSticky = useStickyMenu();

    return (
        <>
            <header>
                <nav className={`navbar mobile-sidenav nav-top-margin navbar-sticky navbar-default validnavs navbar-fixed white  nav-border ${isOpen ? "force-sticky navbar-responsive" : ""} ${isMenuSticky ? "sticked" : "no-background"}`}>
                    <div className="container d-flex justify-content-between align-items-center">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={openMenu}>
                                <i className="fa fa-bars"></i>
                            </button>
                            <Link className="navbar-brand" href="/resturent/food-menu">
                                <Image src="/assets/img/logo-light.png" width={675} height={332} className="logo logo-display" alt="Logo" />

                                {logoWhite ?
                                    <Image src="/assets/img/logo-light.png" width={675} height={332} className="logo logo-scrolled" alt="Logo" /> :
                                    <Image src="/assets/img/logo.png" width={675} height={332} className="logo logo-scrolled" alt="Logo" />
                                }

                            </Link>
                        </div>

                        <div className={`collapse navbar-collapse collapse-mobile ${isOpen ? "show" : ""}`} id="navbar-menu">
                            <Image src="/assets/img/logo.png" width={675} height={332} alt="Logo" />
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={closeMenu}>
                                <i className="fa fa-times"></i>
                            </button>

                            <MainMenu
                                navbarPlacement="navbar-right"
                                isOpen={isOpen}
                                closeMenu={closeMenu}
                                toggleSubMenu={toggleSubMenu}
                                isMenuOpen={isMenuOpen}
                                getMenuStyle={getMenuStyle}
                            />

                        </div>

                        <div className="attr-right">
                            <div className="attr-nav attr-box">
                                <ul>
                                    <HeaderCart />
                                    <li className="button"><Link href="#schedule">Reservation</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={`overlay-screen ${isOpen ? "opened" : ""}`} onClick={closeMenu}></div>
                </nav>
            </header>
        </>
    );
};

export default HeaderV6;
