import React, { useState } from 'react';

interface Post {
  id: number;
  author: string;
  content: string;
}

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Admin',
      content: 'Welcome to the community forum!',
    },
  ]);
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      setPosts([
        ...posts,
        {
          id: posts.length + 1,
          author: 'You',
          content: newPost.trim(),
        },
      ]);
      setNewPost('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Community Forum</h1>
      <div className="mt-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 mb-4 border rounded-lg">
            <p className="font-bold">{post.author}</p>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handlePostSubmit} className="mt-4">
        <textarea
          className="w-full p-2 border rounded-lg"
          rows={3}
          placeholder="Write a new post..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CommunityPage;