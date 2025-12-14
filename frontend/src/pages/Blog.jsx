import React, { useEffect, useState } from 'react';
import { fetchPosts, fetchPostById } from '../services/postsService';

/* ---------- FALLBACK IMAGES (EDUCATION + TECH) ---------- */
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80',
];

/* ---------- DETERMINISTIC IMAGE PICKER ---------- */
const getFallbackImage = (key) => {
  if (!key) return FALLBACK_IMAGES[0];
  return FALLBACK_IMAGES[key % FALLBACK_IMAGES.length];
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    fetchPosts({ page, limit })
      .then(({ posts, total }) => {
        if (!mounted) return;
        setPosts(posts);
        setTotal(total || posts.length);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load posts');
        setPosts([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [page, limit]);

  const openPost = async (id) => {
    setSelectedPost({ loading: true });
    try {
      const post = await fetchPostById(id);
      setSelectedPost({ loading: false, post });
    } catch (err) {
      setSelectedPost({
        loading: false,
        error: err.message || 'Failed to load post',
      });
    }
  };

  const closePost = () => setSelectedPost(null);

  const totalPages = Math.max(1, Math.ceil((total || posts.length) / limit));

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-6 lg:px-20 py-16">

        <h1 className="text-5xl font-extrabold text-gray-900 mb-12 text-center">
          Tech Blog
        </h1>

        {loading && (
          <p className="text-center text-gray-600 text-lg">Loading posts…</p>
        )}

        {error && (
          <p className="text-center text-red-600 mb-8">{error}</p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-center text-gray-600 text-lg">No posts found.</p>
        )}

        {/* ---------- BLOG GRID ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col overflow-hidden"
            >
              <img
                src={
                  post.image && post.image.trim() !== ''
                    ? post.image
                    : getFallbackImage(post.id)
                }
                alt={post.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-6 flex flex-col flex-1">
                <time className="text-sm text-gray-500 mb-2">
                  {new Date(post.createdAt || post.date || '').toLocaleDateString(
                    'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </time>

                <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-gray-700 flex-1 line-clamp-3">
                  {post.excerpt ||
                    post.content
                      ?.replace(/<[^>]*>/g, '')
                      .slice(0, 150) + '...'}
                </p>

                <button
                  onClick={() => openPost(post.id)}
                  className="mt-6 bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* ---------- PAGINATION ---------- */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-lg font-medium text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ---------- MODAL ---------- */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center pt-20 px-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl my-8 relative">
            <button
              onClick={closePost}
              className="absolute top-6 right-6 text-3xl text-gray-500 hover:text-black"
            >
              ×
            </button>

            <div className="p-10">
              {selectedPost.loading && (
                <p className="text-center text-gray-600">Loading post…</p>
              )}

              {selectedPost.error && (
                <p className="text-center text-red-600">
                  {selectedPost.error}
                </p>
              )}

              {selectedPost.post && (
                <>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    {selectedPost.post.title}
                  </h2>

                  <p className="text-gray-600 mb-8">
                    By {selectedPost.post.author || 'Unknown'} ·{' '}
                    {new Date(
                      selectedPost.post.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <img
                    src={
                      selectedPost.post.image &&
                      selectedPost.post.image.trim() !== ''
                        ? selectedPost.post.image
                        : getFallbackImage(selectedPost.post.id)
                    }
                    alt={selectedPost.post.title}
                    className="w-full rounded-lg mb-8 max-h-96 object-cover"
                  />

                  <div
                    className="prose prose-lg max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: selectedPost.post.content,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
