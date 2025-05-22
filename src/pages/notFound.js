import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-7xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page non trouvée</h2>
      <p className="text-gray-600 mb-6">
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>

      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow transition duration-300"
      >
        Revenir à l’accueil
      </Link>

      <img
      src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        alt="404 Illustration"
        className="w-full max-w-md mt-10"
      />
    </div>
  );
}
