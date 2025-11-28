import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);

  const menuRef = useRef(null);

  // Fetch user
  useEffect(() => {
    if (!token) return setUser(null);

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: token },
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          return null;
        }
        return res.json();
      })
      .then((data) => data && setUser(data))
      .catch((err) => console.error("NAVBAR USER ERROR:", err));
  }, [token]);

  const avatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${user?.name || "U"}&background=6366f1&color=fff&rounded=true&size=128`;

  // Close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smooth scroll
  const smoothScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // FIX: Proper Zyris click behaviour
  const goToTop = () => {
    if (!token) {
      // Landing page only scrolls
      smoothScrollTop();
      return;
    }

    if (location.pathname === "/dashboard") {
      smoothScrollTop();
      return;
    }

    // Any other route → go dashboard + scroll
    navigate("/dashboard");
    setTimeout(() => smoothScrollTop(), 250);
  };

  const smoothScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (section) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => smoothScroll(section), 200);
    } else {
      smoothScroll(section);
    }
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="
          w-full fixed top-0 left-0 z-50
          backdrop-blur-xl bg-white/30
          border-b border-white/40
          shadow-[0_4px_15px_rgba(0,0,0,0.06)]
        "
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

          {/* LEFT SIDE */}
          {!token ? (
            // LOGGED OUT (Landing)
            <button
              onClick={goToTop}
              className="flex items-center gap-2 group"
            >
              <img
                src="/logo.png"
                alt="Zyris Logo"
                className="h-9 w-9 object-contain"
              />
              <span
                className="
                  text-[28px] font-extrabold tracking-tight
                  bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-700
                  bg-clip-text text-transparent
                "
              >
                Zyris
              </span>
            </button>
          ) : (
            // LOGGED IN (Dashboard + tools)
            <button onClick={goToTop} className="flex items-center group">
              <span
                className="
                  text-[28px] font-extrabold tracking-tight
                  bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-600
                  bg-clip-text text-transparent
                  transition group-hover:brightness-110
                "
              >
                Zyris
              </span>
            </button>
          )}

          {/* RIGHT SIDE */}
          {!token ? (
            <div className="flex items-center space-x-8 sm:space-x-12">
              <button
                onClick={() => handleNavClick("features")}
                className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick("faq")}
                className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition"
              >
                FAQ
              </button>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <img
                src={avatar}
                alt="avatar"
                onClick={() => setShowMenu(!showMenu)}
                className="
                  h-11 w-11 rounded-full cursor-pointer
                  border border-gray-300 object-cover
                  hover:scale-[1.05] transition
                "
              />

              {showMenu && (
                <div
                  className="
                    absolute right-0 mt-3 w-44
                    bg-white/95 backdrop-blur-xl
                    shadow-xl rounded-xl
                    border border-gray-200 overflow-hidden
                  "
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* PROFILE MODAL */}
      {showProfileModal && user && (
        <div
          className="
            fixed inset-0 flex items-center justify-center z-[999]
            backdrop-blur-md bg-black/40
          "
        >
          <div
            className="
              bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl
              max-w-sm w-full text-center relative
            "
          >
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-xl"
            >
              ✕
            </button>

            <img
              src={avatar}
              className="h-24 w-24 rounded-full mx-auto mb-4 shadow-md"
              alt=""
            />

            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div
          className="
            fixed inset-0 flex items-center justify-center z-[999]
            backdrop-blur-md bg-black/40
          "
        >
          <div
            className="
              bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl
              max-w-sm w-full text-center
            "
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-6 py-2 rounded-xl border border-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-6 py-2 rounded-xl bg-red-500 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
