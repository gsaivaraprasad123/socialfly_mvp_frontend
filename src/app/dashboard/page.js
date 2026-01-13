'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [instagramConnected, setInstagramConnected] = useState(false);

  useEffect(() => {
    const fetchInstagramStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/instagram/status', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setInstagramConnected(data.connected === true);
      } catch (err) {
        console.error('Failed to fetch Instagram status');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramStatus();
  }, [router]);

  const handleConnectInstagram = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('http://localhost:8080/instagram/connect', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      window.location.href = data.authUrl;
    } else {
      alert(data.error || 'Failed to connect Instagram');
    }
  };

  const handleManageInstagram = () => {
    router.push('/instagram');
  };

  if (loading) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Instagram Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-white font-bold">IG</span>
          </div>

          <h3 className="text-xl font-bold mb-2">Instagram</h3>

          {instagramConnected ? (
            <>
              <p className="text-green-600 mb-6 font-medium">
                ✅ Instagram account connected
              </p>
              <button
                onClick={handleManageInstagram}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl"
              >
                Manage Instagram
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Connect your Instagram Business account
              </p>
              <button
                onClick={handleConnectInstagram}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 rounded-xl"
              >
                Connect Instagram
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
