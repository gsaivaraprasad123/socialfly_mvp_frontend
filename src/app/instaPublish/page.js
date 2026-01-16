'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InstaPublish() {
  const router = useRouter();

  // Array to support carousel
  const [mediaUrls, setMediaUrls] = useState(['']);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const isCarousel = mediaUrls.filter(Boolean).length > 1;

  const handleAddField = () => {
    if (mediaUrls.length >= 10) {
      alert('Instagram allows max 10 images');
      return;
    }
    setMediaUrls([...mediaUrls, '']);
  };

  const handleChange = (index, value) => {
    const updated = [...mediaUrls];
    updated[index] = value;
    setMediaUrls(updated);
  };

  const handlePublish = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login');
      return;
    }

    const cleanedUrls = mediaUrls.filter(Boolean);

    if (!cleanedUrls.length) {
      alert('At least one media URL is required');
      return;
    }

    if (cleanedUrls.length === 1) {
      // single image → string
    } else if (cleanedUrls.length < 2) {
      alert('Carousel requires at least 2 images');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption,
          mediaUrl:
            cleanedUrls.length === 1 ? cleanedUrls[0] : cleanedUrls,
        }),
      });

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

        {mediaUrls.map((url, i) => (
          <input
            key={i}
            value={url}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder={`Image URL ${i + 1}`}
            className="w-full border p-2 rounded mb-3"
          />
        ))}

        <button
          type="button"
          onClick={handleAddField}
          className="text-sm text-purple-600 mb-4"
        >
          + Add another image (carousel)
        </button>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
          className="w-full border p-2 rounded mb-4"
          rows={3}
        />

        <button
          onClick={handlePublish}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {loading
            ? 'Publishing…'
            : isCarousel
            ? 'Publish Carousel'
            : 'Publish Image'}
        </button>
      </div>
    </div>
  );
}
