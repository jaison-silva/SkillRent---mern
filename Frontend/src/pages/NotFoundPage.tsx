import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
