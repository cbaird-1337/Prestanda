import React, { useEffect, useState } from 'react';
import './BlogPage.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const mediumUsername = '@prestanda.io';
      const mediumURL = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${mediumUsername}`;
      
      const response = await fetch(mediumURL);
      const data = await response.json();
      const parsedPosts = data.items.map(item => {
        return {
          title: item.title,
          link: item.link,
        };
      });
      setPosts(parsedPosts);
    };

    fetchPosts();
  }, []);

  return (
    <div className="blog-container">
      <h1 className="blog-title">Latest Blog Posts</h1>
      <ul className="blog-posts">
        {posts.map((post, index) => (
          <li key={index} className="blog-post">
            <a href={post.link} target="_blank" rel="noreferrer">
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );  
};

export default Blog;
