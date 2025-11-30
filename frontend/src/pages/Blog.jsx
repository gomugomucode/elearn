import React, { useEffect, useState } from 'react';
import { fetchPosts, fetchPostById } from '../services/postsService';

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
        console.error('fetchPosts error', err);
        setError(err.message || 'Unable to load posts');
        setPosts([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [page, limit]);

  const openPost = async (id) => {
    setSelectedPost({ loading: true });
    try {
      const post = await fetchPostById(id);
      setSelectedPost({ loading: false, post });
    } catch (err) {
      console.error('fetchPostById error', err);
      setSelectedPost({ loading: false, error: err.message || 'Failed to load post' });
    }
  };

  const closePost = () => setSelectedPost(null);
  const totalPages = Math.max(1, Math.ceil((total || posts.length) / limit));

  return (
    <main className="pt-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 lg:px-20 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Tech Blog</h1>

        {loading && <p className="text-gray-600">Loading posts…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && posts.length === 0 && <p className="text-gray-600">No posts found.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                <time className="text-gray-400 text-sm mb-3 block">
                  {new Date(post.createdAt || post.date || '').toLocaleDateString()}
                </time>
                <p className="text-gray-600 mb-4">{post.excerpt || (post.content && post.content.slice(0, 120) + '...')}</p>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => openPost(post.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Read More
                </button>
                <a
                  href={`/posts/${post.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Permalink
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center items-center gap-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-medium">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for single post */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start pt-24 z-50 overflow-auto">
          <div className="bg-white w-full max-w-3xl rounded-lg p-8 shadow-lg relative">
            {selectedPost.loading && <p className="text-gray-600">Loading post…</p>}
            {selectedPost.error && <p className="text-red-600">{selectedPost.error}</p>}
            {selectedPost.post && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedPost.post.title}</h2>
                <p className="text-gray-500 mb-4">
                  By {selectedPost.post.author || 'Unknown'} · {new Date(selectedPost.post.createdAt || '').toLocaleString()}
                </p>
                <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: selectedPost.post.content }} />
              </>
            )}
            <button
              onClick={closePost}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
