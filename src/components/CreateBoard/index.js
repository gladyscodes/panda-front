import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';

import Alert from '../Alert';
import { createBoard } from '../../services/board';

const CreateBoard = () => {
  const [title, setTitle] = useState();
  const [response, setResponse] = useState({ statusCode: null, message: null });
  const history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      history.push('/');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await createBoard({
        title,
      });
      setResponse({ statusCode: 200, message: response.data });
      setTimeout(() => {
        history.push('/home');
      }, 1200);
    } catch (e) {
      const message = e.response.data.message.split(':').pop();
      setResponse({ statusCode: 400, message });
    }
  };

  return (
    <div className="flex flex-col justify-center mt-12 mx-16">
      {response.statusCode !== null ? (
        <Alert
          error={response.statusCode === 200 ? false : true}
          title={response.statusCode === 200 ? 'Success!' : 'Error!'}
          text={response.message}
        />
      ) : null}
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
      <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-6">
        Create a Board
      </h1>
      <form
        className="w-full max-w-lg items-center border border-gray-300 p-5 rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 ml-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Board Title
            </label>
            <input
              onChange={(event) => setTitle(event.target.value)}
              value={title}
              className="bg-white rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-base px-4 py-2 mb-1"
              placeholder="Title"
              type="text"
            />
          </div>
        </div>
        <div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <div className="mt-6 w-full">
              <button
                className="shadow bg-indigo-600 hover:bg-indigo-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Create Board
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBoard;
