'use client';

import { useEffect, useState } from 'react';

export default function TodoDetail({ selectedId }) {
  const [todo, setTodo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedId) {
      const fetchTodo = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/todos/${selectedId}`);
          if (!res.ok) {
            throw new Error('Failed to fetch todo');
          }
          const data = await res.json();
          setTodo(data);
          setTitle(data.title);
          setDescription(data.description);
        } catch (err) {
          console.error('Error fetching todo:', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTodo();
    }
  }, [selectedId]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/todos/${selectedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodo(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
      setError(error.message);
    }
  };

  if (!selectedId) {
    return (
      <div className="bg-white p-4 rounded-lg shadow h-full flex items-center justify-center">
        <p className="text-gray-500">Select a todo to view details</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow h-full flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow h-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="bg-white p-4 rounded-lg shadow h-full flex items-center justify-center">
        <p className="text-gray-500">Todo not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows="5"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">{todo.title}</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{todo.description}</p>
          <div className="text-sm text-gray-500">
            <p>Created: {new Date(todo.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(todo.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}