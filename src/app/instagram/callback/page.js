'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InstagramCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const fragment = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = fragment.get('access_token');
      const expiresIn = fragment.get('expires_in');
      const state = fragment.get('state');

      console.log('Callback parameters:', { accessToken, expiresIn, state });

      if (!accessToken || !expiresIn || !state) {
        alert('Invalid callback parameters');
        router.push('/dashboard');
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/instagram/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: accessToken,
            expires_in: parseInt(expiresIn),
            state: state,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          router.push('/instagram');
        } else {
          alert(data.error || 'Failed to connect Instagram account');
          router.push('/dashboard');
        }
      } catch (error) {
        alert('Network error');
        router.push('/dashboard');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Instagram-like logo */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Connecting to Instagram</h1>
          <p className="text-gray-600">Please wait while we link your account</p>
        </div>

        {/* Loading spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Authenticating...</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span>Connecting account...</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span>Almost done...</span>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-xs text-gray-500 mt-6">
          This process is secure and encrypted
        </p>
      </div>
    </div>
  );
}