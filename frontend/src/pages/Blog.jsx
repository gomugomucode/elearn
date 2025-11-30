import React, { useEffect, useState } from 'react';
import '../App.css';
import { fetchPosts, fetchPostById } from '../services/postsService';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  // Load posts list
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
    return () => {
      mounted = false;
    };
  }, [page, limit]);

  // Example: fetch and show single post details
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
    <main className="page-container">
      <h1>Blog</h1>

      {loading && <p>Loading posts…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && posts.length === 0 && <p>No posts found.</p>}

      <section className="posts-grid">
        {posts.map((post) => (
          <article className="post-card" key={post.id}>
            <h2 className="post-title">{post.title}</h2>
            <time className="post-date">{new Date(post.createdAt || post.date || '').toLocaleDateString()}</time>
            <p className="post-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt || (post.content && post.content.slice(0, 140)) }} />
            <div className="post-actions">
              <button onClick={() => openPost(post.id)}>Read</button>
              <a href={`/posts/${post.id}`}>Permalink</a>
            </div>
          </article>
        ))}
      </section>

      <footer className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
      </footer>

      {/* Modal / drawer for single post preview */}
      {selectedPost && (
        <div className="post-modal" role="dialog" aria-modal="true">
          <div className="post-modal-content">
            {selectedPost.loading && <p>Loading post…</p>}
            {selectedPost.error && <p className="error">{selectedPost.error}</p>}
            {selectedPost.post && (
              <>
                <h2>{selectedPost.post.title}</h2>
                <p className="meta">
                  By {selectedPost.post.author || 'Unknown'} · {new Date(selectedPost.post.createdAt || '').toLocaleString()}
                </p>
                <div className="post-body" dangerouslySetInnerHTML={{ __html: selectedPost.post.content }} />
              </>
            )}
            <button onClick={closePost}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}