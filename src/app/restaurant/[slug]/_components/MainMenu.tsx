import Link from 'next/link';
import Image from 'next/image';

interface DataType {
    isOpen: boolean;
    closeMenu: () => void;
    toggleSubMenu: (menuId: string) => void;
    isMenuOpen: (menuId: string) => boolean;
    getMenuStyle: (menuId: string) => React.CSSProperties;
    navbarPlacement: string;
}

const MainMenu = ({ isOpen, closeMenu, navbarPlacement, toggleSubMenu, isMenuOpen, getMenuStyle }: DataType) => {
    return (
        <>
            <div className={`collapse navbar-collapse collapse-mobile ${isOpen ? "show" : ""}`} id="navbar-menu">
                <Image src="/assets/img/logo-2.png" width={675} height={332} alt="Logo" />
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={closeMenu}>
                    <i className="fa fa-times"></i>
                </button>
                <ul className={`nav navbar-nav ${navbarPlacement}`} data-in="fadeInDown" data-out="fadeOutUp">
                    <li>
                        <Link href="/resturent/food-menu">
                            Food Menu
                        </Link>
                    </li>
                    <li>
                        <Link href="/resturent/shop-single/1">
                            Shop Single (1)
                        </Link>
                    </li>
                    <li>
                        <Link href="/resturent/shop-single/2">
                            Shop Single (2)
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default MainMenu;
