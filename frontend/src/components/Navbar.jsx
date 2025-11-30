// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Search } from "lucide-react";

import "./Navbar.css";

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewportSize, setViewportSize] = useState(getViewportSize());
  const [showDropdown, setShowDropdown] = useState(false);

  // Ref to track dropdown/hamburger container
  const dropdownRef = useRef(null);

  function getViewportSize() {
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width >= 768 && width < 1030) return "tablet";
    return "desktop";
  }

  useEffect(() => {
    const handleResize = () => setViewportSize(getViewportSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewportSize === "mobile";
  const isTablet = viewportSize === "tablet";
  const isDesktop = viewportSize === "desktop";

  // Mock data
  const courses = [
    { id: 1, title: "Web Development", category: "Programming" },
    { id: 2, title: "Machine Learning", category: "AI" },
    { id: 3, title: "IELTS Prep", category: "Language" },
  ];

  const categories = [
    { id: 1, title: "Programming" },
    { id: 2, title: "AI & Data Science" },
    { id: 3, title: "Language Learning" },
  ];

  const filteredSuggestions = searchTerm
    ? [
        ...categories.map((cat) => ({ type: "category", title: cat.title })),
        ...courses.map((course) => ({
          type: "course",
          title: course.title,
          category: categories.find((c) => c.title === course.category)?.title,
        })),
      ]
        .filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const matchedCategory = categories.find((cat) =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matchedCategory) {
      navigate(
        `/category/${matchedCategory.title.toLowerCase().replace(/\s+/g, "-")}`
      );
      resetSearch();
      return;
    }

    const matchedCourse = courses.find((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matchedCourse) {
      navigate(
        `/course/${matchedCourse.title.toLowerCase().replace(/\s+/g, "-")}`
      );
      resetSearch();
      return;
    }

    alert("No matching course or category found.");
  };

  const resetSearch = () => {
    setSearchTerm("");
    setShowDropdown(false);
  };

  const navItems = [
    { name: "Courses", path: "/course" },
    { name: "Blogs", path: "/blogs" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const getProfilePath = () => {
  if (user?.role === "student") return "/student/profile";
  if (user?.role === "teacher") return "/teacher/profile";
  if (user?.role === "admin") return "/admin/profile";
  return "/profile"; // fallback
};


const userItems = isLoggedIn
  ? [
      {
        title: "Profile",
        icon: <IoPersonCircleOutline size={20} />,
        path: getProfilePath(),
        className: "navbar-mobile-auth-link-signin",
        linkClass: "flex items-center gap-2",
      },
      {
        title: "Logout",
        icon: <AiOutlineClose size={20} />,
        path: "#",
        onClick: () => {
          logout();
          navigate("/login");
        },
        className: "navbar-mobile-auth-link-logout",
        linkClass: "flex items-center gap-2",
      },
    ]
  : [
      {
        title: "Login",
        path: "/login",
        className: "navbar-auth-link-signin",
      },
    ];


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container" ref={dropdownRef}>
        {/* Logo */}
        <div className="navbar-logo">
          <div className="navbar-logo-icon">
            <img src="/logo.png" alt="Logo" className="navbar-logo-img" />
          </div>
          <Link to="/" className="navbar-logo-text">
            E-Learning
          </Link>
        </div>


       {/* Desktop: Nav + Search + Auth Links */}
{isDesktop && (
  <div className="navbar-desktop-menu">
    <div className="navbar-nav-list">
      {navItems.map((item, idx) => (
        <Link key={idx} to={item.path} className="navbar-nav-link">
          {item.name}
        </Link>
      ))}
    </div>

    <div className="navbar-search-container">
      {/* Search input and icon */}
      <input
        type="search"
        placeholder="Search courses or categories..."
        className="navbar-search-input"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Search className="navbar-search-icon" />
      {showDropdown && filteredSuggestions.length > 0 && (
        <ul className="navbar-suggestions">
          {filteredSuggestions.map((item, i) => (
            <li
              key={i}
              className="navbar-suggestion-item"
              onClick={() => {
                if (item.type === "category") {
                  navigate(`/category/${item.title.toLowerCase().replace(/\s+/g, "-")}`);
                } else {
                  navigate(`/course/${item.title.toLowerCase().replace(/\s+/g, "-")}`);
                }
                resetSearch();
              }}
            >
              <span>{item.type === "category" ? "📁" : "📚"}</span>
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Show Profile Dropdown if logged in, else show Login link */}
    {isLoggedIn ? (
      <div className="navbar-user-menu">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="navbar-profile-button"
        >
          <IoPersonCircleOutline size={32} color="white" />
        </button>

        {menuOpen && (
          <div className="navbar-dropdown-menu">
<Link
  to={getProfilePath()}
  className="navbar-dropdown-item"
  onClick={() => setMenuOpen(false)}
>
  <IoPersonCircleOutline size={18} />
  <span>Profile</span>
</Link>

            <button
              onClick={() => {
                logout();
                navigate("/login");
                setMenuOpen(false);
              }}
              className="navbar-dropdown-item text-left"
            >
              <AiOutlineClose size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    ) : (
      <Link
        to="/login"
        className="navbar-auth-link-signin navbar-desktop-login"
      >
        Login
      </Link>
    )}
  </div>
)}

        {/* Tablet: Search + Conditional Button (Hamburger or Profile) */}
        {isTablet && (
          <>
            {/* Search Bar */}
            <div className="navbar-tablet-search-container">
              <input
                type="search"
                placeholder="Search..."
                className="navbar-tablet-search-input"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="navbar-tablet-search-icon" />
              {showDropdown && filteredSuggestions.length > 0 && (
                <ul className="navbar-tablet-suggestions">
                  {filteredSuggestions.map((item, i) => (
                    <li
                      key={i}
                      className="navbar-tablet-suggestion-item"
                      onClick={() => {
                        if (item.type === "category") {
                          navigate(
                            `/category/${item.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`
                          );
                        } else {
                          navigate(
                            `/course/${item.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`
                          );
                        }
                        resetSearch();
                      }}
                    >
                      {item.type === "category" ? "📁" : "📚"} {item.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Conditional Button */}
            <div className="navbar-user-menu">
              {isLoggedIn ? (
                <div className="navbar-profile-dropdown">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="navbar-profile-button"
                  >
                    <IoPersonCircleOutline size={28} color="white" />
                  </button>

                  {menuOpen && (
                    <div className="navbar-dropdown-menu">
                      <Link
                        to={getProfilePath()}
                        className="navbar-dropdown-item"
                        onClick={() => setMenuOpen(false)}
                      >
                        <IoPersonCircleOutline size={18} />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/login");
                          setMenuOpen(false);
                        }}
                        className="navbar-dropdown-item text-left"
                      >
                        <AiOutlineClose size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="navbar-hamburger"
                >
                  {menuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </button>
              )}
            </div>
          </>
        )}

        {/* Mobile: Always show hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="navbar-hamburger"
          >
            {menuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile & Tablet Menu (Hamburger Menu) */}
      {(isMobile || (isTablet && !isLoggedIn)) && menuOpen && (
        <div className="navbar-mobile-menu animate-fadeIn">
          <div className="navbar-mobile-nav">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="navbar-mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Search */}
          {isMobile && (
            <div className="navbar-mobile-search">
              <input
                type="search"
                placeholder="Search..."
                className="navbar-mobile-search-input"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="navbar-mobile-search-icon" />
              {showDropdown && filteredSuggestions.length > 0 && (
                <ul className="navbar-mobile-suggestions">
                  {filteredSuggestions.map((item, i) => (
                    <li
                      key={i}
                      className="navbar-mobile-suggestion-item"
                      onClick={() => {
                        if (item.type === "category") {
                          navigate(
                            `/category/${item.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`
                          );
                        } else {
                          navigate(
                            `/course/${item.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`
                          );
                        }
                        resetSearch();
                        setMenuOpen(false);
                      }}
                    >
                      {item.type === "category" ? "📁" : "📚"} {item.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="navbar-mobile-auth">
            {userItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.onClick) item.onClick();
                  setMenuOpen(false);
                }}
                className={`${item.className} ${item.linkClass || ""}`}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;