// Lightweight posts API service used by the frontend.
// Uses the backend endpoints at /api/posts.
// Adjust BASE_URL if your API is hosted elsewhere.

const BASE_URL = '/api/posts';

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
    const message = body && body.message ? body.message : res.statusText || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return isJson ? res.json().catch(() => null) : null;
}

// Fetch list of posts with optional pagination (page starts at 1) and limit
export async function fetchPosts({ page = 1, limit = 10, q = '' } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (q) params.set('q', q);
  const url = `${BASE_URL}?${params.toString()}`;
  const res = await fetch(url, { credentials: 'include' });
  const data = await handleResponse(res);
  // Expecting { posts: [...], total?: n } from server; fallback if only array returned
  return {
    posts: Array.isArray(data) ? data : (data.posts || []),
    total: data.total || (Array.isArray(data) ? data.length : (data.posts ? data.posts.length : 0)),
  };
}

// Fetch a single post by id
export async function fetchPostById(id) {
  if (!id) throw new Error('Post id is required');
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, { credentials: 'include' });
  const data = await handleResponse(res);
  return data.post || data;
}

// Create a new post (admin)
export async function createPost(post) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(post),
  });
  const data = await handleResponse(res);
  return data.post || data;
}

// Update an existing post
export async function updatePost(id, updates) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  const data = await handleResponse(res);
  return data.post || data;
}

// Delete a post
export async function deletePost(id) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await handleResponse(res);
  return data.post || data;
}