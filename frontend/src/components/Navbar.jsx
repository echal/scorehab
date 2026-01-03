import { Link } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';
import logoGaspul from '../assets/images/logo-gaspul.png';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg bg-white border-b-4 border-orange-500">
      <nav className="container flex items-center justify-between px-4 py-3 mx-auto">
        
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoGaspul} alt="Gaspul Logo" className="h-10" />
          <span className="text-xl font-bold tracking-wide text-gray-800">
            ScoreHAB
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="items-center hidden gap-6 md:flex">
          <Link to="/" className="font-medium text-gray-700 transition hover:text-orange-600">
            Beranda
          </Link>

          <Link to="/matches" className="font-medium text-gray-700 transition hover:text-orange-600">
            Pertandingan
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" className="font-medium text-gray-700 transition hover:text-orange-600">
                  Admin
                </Link>
              )}

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">
                  {user?.name} ({user?.role})
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 font-semibold text-white transition bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-orange-600 hover:to-red-600"
                >
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 font-semibold text-white transition bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-orange-600 hover:to-red-600"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="text-2xl text-gray-700 md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="text-gray-800 bg-white shadow-lg md:hidden">
          <div className="flex flex-col p-4 space-y-3">

            <Link to="/" onClick={() => setOpen(false)} className="hover:text-orange-600">
              Beranda
            </Link>

            <Link to="/matches" onClick={() => setOpen(false)} className="hover:text-orange-600">
              Pertandingan
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="hover:text-orange-600"
                  >
                    Admin
                  </Link>
                )}

                <div className="pt-3 border-t">
                  <p className="mb-2 text-sm">
                    {user?.name} ({user?.role})
                  </p>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2 font-semibold text-white transition bg-orange-600 rounded-lg hover:bg-orange-700"
                  >
                    Keluar
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="w-full py-2 font-semibold text-center text-white transition bg-orange-600 rounded-lg hover:bg-orange-700"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
