'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TodoList({ todos, totalPages, currentPage }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      
      if (response.ok) {
        setTitle('');
        setDescription('');
        router.refresh();
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Todos</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Todo
        </button>
      </form>
      
      <div className="space-y-2">
        {todos.map((todo) => (
          <Link
            key={todo._id}
            href={`?selected=${todo._id}&page=${currentPage}`}
            className="block p-3 border rounded hover:bg-gray-50"
          >
            <h3 className="font-medium">{todo.title}</h3>
            <p className="text-sm text-gray-600 truncate">{todo.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(todo.createdAt).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
      
      <div className="flex justify-between mt-4">
        {currentPage > 1 && (
          <Link
            href={`?page=${parseInt(currentPage) - 1}`}
            className="px-4 py-2 border rounded"
          >
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={`?page=${parseInt(currentPage) + 1}`}
            className="px-4 py-2 border rounded ml-auto"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}