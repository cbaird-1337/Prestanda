import React, { useEffect, useState } from 'react';
import './BlogPage.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const feedURL = 'https://medium.com/feed/@prestanda.io'; 
      const response = await fetch(feedURL);
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      const items = xmlDoc.getElementsByTagName('item');
      const parsedPosts = Array.from(items).map(item => {
        return {
          title: item.getElementsByTagName('title')[0].textContent,
          link: item.getElementsByTagName('link')[0].textContent,
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
