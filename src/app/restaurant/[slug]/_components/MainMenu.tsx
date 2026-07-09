import Link from 'next/link';
import Image from 'next/image';
import staticData from "../assets/staticData.json";

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
                <Image src={staticData.ui.mainMenu.logo} width={675} height={332} alt="Logo" />
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={closeMenu}>
                    <i className="fa fa-times"></i>
                </button>
                <ul className={`nav navbar-nav ${navbarPlacement}`} data-in="fadeInDown" data-out="fadeOutUp">
                    <li>
                        <Link href={staticData.ui.mainMenu.items[0].href}>{staticData.ui.mainMenu.items[0].label}</Link>
                    </li>
                    <li>
                        <Link href={staticData.ui.mainMenu.items[1].href}>{staticData.ui.mainMenu.items[1].label}</Link>
                    </li>
                    <li>
                        <Link href={staticData.ui.mainMenu.items[2].href}>{staticData.ui.mainMenu.items[2].label}</Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default MainMenu;
