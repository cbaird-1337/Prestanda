import React, { useEffect, useState } from 'react';
import Parser from 'rss-parser';
import './BlogPage.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const parser = new Parser();
    const mediumRssFeedUrl = 'https://medium.com/feed/@prestanda.io'; // Replace 'yourusername' with your Medium username
    const fetchPosts = async () => {
      try {
        const feed = await parser.parseURL(mediumRssFeedUrl);
        setPosts(feed.items);
      } catch (error) {
        console.error('Error fetching Medium RSS feed:', error);
      }
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
