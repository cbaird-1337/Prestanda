import React, { useEffect, useState } from 'react';
import './BlogPage.css';
import * as xml2js from 'xml2js';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const feedURL = 'https://medium.com/feed/@prestanda.io'; 
      const response = await fetch(feedURL);
      const text = await response.text();
      const parsed = await xml2js.parseStringPromise(text, { explicitArray: false });
      setPosts(parsed.rss.channel.item);
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
