
import hamburgerMenu from "../assets/icons/hamburger-menu.png";
import profilePicture from "../assets/icons/dummy_profile_picture.png";
import Logo from "../assets/images/logo.png"
import '../components/header.css'

const Header = ({ toggleSidebar }) => {

    return (
        <header className="topbar">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
                <img src={hamburgerMenu} alt="mobile-menu" className="mobile-menu" />
            </button>
            <div className="logo">
                <img src={Logo} alt="Ujaas Logo" />
            </div>
            <img
                src={profilePicture}
                alt="User"
                className="profile-img"
            />
        </header>
    )
}
export default Header;