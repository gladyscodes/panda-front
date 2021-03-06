import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';

import Post from '../Post';
import Alert from '../Alert';
import { getBoard } from '../../services/board';
import { createPost, getPosts, upvotePost } from '../../services/post';

const fetch = async (url, setBoard) => {
  try {
    const response = await getBoard(url);
    setBoard(response.data);
  } catch (error) {
    console.log(error);
  }
};

const fetchPosts = async (boardId, setPosts) => {
  try {
    const response = await getPosts(boardId);
    setPosts(response.data);
  } catch (error) {
    console.log(error);
  }
};

const Board = () => {
  const history = useHistory();
  const [board, setBoard] = useState();
  const [title, setTitle] = useState();
  const [details, setDetails] = useState();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (board === undefined) {
      fetch(history.location.pathname, setBoard);
    } else {
      fetchPosts(board._id, setPosts);
    }
  }, [board]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  }, [error]);

  const renderTitle = () => {
    if (board !== undefined) {
      return board.title.charAt(0).toUpperCase() + board.title.slice(1);
    } else {
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const post = await createPost({
        title,
        details,
        board: board._id,
      });
      setTitle('');
      setDetails('');
      setPosts([...posts, { postId: post._id, title, details, upvotes: 1 }]);
    } catch (error) {
      setError(true);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await upvotePost({
        postId,
      });
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            upvotes: post.upvotes + 1,
          };
        } else {
          return post;
        }
      });
      setPosts(updatedPosts);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="mt-12 mx-16">
      {error ? (
        <div>
          <Alert
            error
            title="Oops!"
            text="You need to create an account to do that!"
          />
          <br />
        </div>
      ) : null}
      {localStorage.getItem('user') ? (
        <Link
          to="/home"
          className="mt-3  mb-4 text-indigo-500 inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-arrow-left"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Go back
        </Link>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-4">
        {renderTitle()}
      </h1>
      <div className="flex">
        <section className="text-gray-700 body-font relative">
          <div className="container mx-auto flex">
            <div className="bg-white rounded-lg p-8 flex flex-col w-full mt-10 md:mt-0 relative z-10 border border-gray-300">
              <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
                Create a Post
              </h2>
              <p className="leading-relaxed mb-5 text-gray-600">
                Submit a request or give some feedback
              </p>
              <input
                onChange={(event) => setTitle(event.target.value)}
                value={title}
                className="bg-white rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-base px-4 py-2 mb-4"
                placeholder="Title"
                type="text"
              />
              <textarea
                onChange={(event) => setDetails(event.target.value)}
                value={details}
                className="bg-white rounded border border-gray-400 focus:outline-none h-32 focus:border-indigo-500 text-base px-4 py-2 mb-4 resize-none"
                placeholder="Details"
              ></textarea>
              <button
                onClick={handleSubmit}
                className="text-white bg-indigo-600 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-500 rounded text-lg"
              >
                Post
              </button>
              <p className="text-xs text-gray-500 mt-3">
                Users of the community can upvote this post.
              </p>
            </div>
          </div>
        </section>
        <div className="ml-10 w-3/5">
          {posts.length === 0 ? (
            <p className="text-md text-gray-500 m-6">
              This board is empty 😢
              <br />
              👈 Create some posts now!
            </p>
          ) : null}
          {posts.map((post, i) => {
            return <Post key={i} post={post} handleUpvote={handleUpvote} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Board;
