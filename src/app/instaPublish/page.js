'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InstaPublish() {
  const router = useRouter();

  const [mediaType, setMediaType] = useState('IMAGE');
  const [mediaUrls, setMediaUrls] = useState(['']);
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [loading, setLoading] = useState(false);

  // ⏰ Scheduling
  const [schedule, setSchedule] = useState(false);
  const [publishDate, setPublishDate] = useState('');
  const [publishTime, setPublishTime] = useState('');

  const updateUrl = (index, value) => {
    const updated = [...mediaUrls];
    updated[index] = value;
    setMediaUrls(updated);
  };

  const addUrl = () => setMediaUrls([...mediaUrls, '']);
  const removeUrl = (i) =>
    setMediaUrls(mediaUrls.filter((_, idx) => idx !== i));

  const handlePublish = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Login required');

    const cleanedUrls = mediaUrls.filter(Boolean);
    if (!cleanedUrls.length) {
      return alert('At least one media URL required');
    }

    // ⏰ Build publishAt if scheduled
    let publishAt = null;
    if (schedule) {
      if (!publishDate || !publishTime) {
        return alert('Select both date and time');
      }

      publishAt = new Date(`${publishDate}T${publishTime}`).toISOString();
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
          mediaType,
          mediaUrls: cleanedUrls,
          caption,
          altText: mediaType === 'IMAGE' ? altText : null,
          publishAt, // ✅ key addition
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      // Publish immediately only if NOT scheduled
      if (!schedule) {
        const publishRes = await fetch(
          `http://localhost:8080/posts/${data.post.id}/publish`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const publishData = await publishRes.json();
        if (!publishRes.ok) return alert(publishData.error);
      }

      alert(schedule ? '⏰ Post scheduled successfully' : '✅ Published successfully');
      router.push('/dashboard');
    } catch {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Publish to Instagram</h1>

      {/* Media Type */}
      <select
        value={mediaType}
        onChange={(e) => {
          setMediaType(e.target.value);
          setMediaUrls(['']);
        }}
        className="border p-2 w-full mb-3"
      >
        <option value="IMAGE">Image</option>
        <option value="REELS">Reel</option>
        <option value="STORIES">Story</option>
        <option value="CAROUSEL">Carousel</option>
      </select>

      {/* Media URLs */}
      {mediaUrls.map((url, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            value={url}
            onChange={(e) => updateUrl(i, e.target.value)}
            placeholder="https://example.com/media.jpg"
            className="border p-2 flex-1"
          />
          {mediaType === 'CAROUSEL' && (
            <button onClick={() => removeUrl(i)}>❌</button>
          )}
        </div>
      ))}

      {mediaType === 'CAROUSEL' && (
        <button onClick={addUrl} className="text-blue-600 mb-3">
          + Add another image
        </button>
      )}

      {/* Caption */}
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption"
        className="border p-2 w-full mb-3"
      />

      {/* Alt Text */}
      {mediaType === 'IMAGE' && (
        <input
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Alt text (optional)"
          className="border p-2 w-full mb-3"
        />
      )}

      {/* ⏰ Scheduling */}
      <div className="border rounded p-3 mb-4">
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={schedule}
            onChange={(e) => setSchedule(e.target.checked)}
          />
          Schedule for later
        </label>

        {schedule && (
          <div className="flex gap-2">
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="border p-2 flex-1"
            />
            <input
              type="time"
              value={publishTime}
              onChange={(e) => setPublishTime(e.target.value)}
              className="border p-2 flex-1"
            />
          </div>
        )}
      </div>

      <button
        onClick={handlePublish}
        disabled={loading}
        className="bg-purple-600 text-white w-full py-2 rounded"
      >
        {loading
          ? 'Processing…'
          : schedule
          ? 'Schedule Post'
          : 'Publish Now'}
      </button>
    </div>
  );
}
