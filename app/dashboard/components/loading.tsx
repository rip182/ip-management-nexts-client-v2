"use client";

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-700">Validating session...</p>
      </div>
    </div>
  );
}
