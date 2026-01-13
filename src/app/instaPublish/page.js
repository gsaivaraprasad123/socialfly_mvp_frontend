'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InstaPublish() {
  const router = useRouter();
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login');
      return;
    }

    if (!mediaUrl) {
      alert('Media URL required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        'http://localhost:8080/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mediaUrl, // STRING → single image
            caption,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Create post failed');
        return;
      }

      // Publish immediately
      const publishRes = await fetch(
        `http://localhost:8080/posts/${data.post.id}/publish`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const publishData = await publishRes.json();

      if (!publishRes.ok) {
        alert(publishData.error || 'Publish failed');
        return;
      }

      alert('✅ Post published successfully!');
      router.push('/dashboard');
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          Publish to Instagram
        </h1>

        <label className="block mb-2 text-sm font-medium">
          Image URL (JPEG, public)
        </label>
        <input
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2 text-sm font-medium">
          Caption
        </label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          rows={3}
        />

        <button
          onClick={handlePublish}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {loading ? 'Publishing…' : 'Publish Now'}
        </button>
      </div>
    </div>
  );
}
