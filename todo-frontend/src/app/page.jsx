import TodoList from '@/components/TodoList';
import TodoDetail from '@/components/TodoDetail';

export default async function Home({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const selectedId = searchParams.selected || null;
  
  try {
    // Fetch todos on the server
    const res = await fetch(`http://localhost:5000/api/todos?page=${page}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch todos');
    }
    
    const data = await res.json();
    
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Todo App</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <TodoList 
              todos={data.todos} 
              totalPages={data.totalPages} 
              currentPage={page} 
            />
          </div>
          <div className="md:col-span-2">
            <TodoDetail selectedId={selectedId} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching todos:', error);
    
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Todo App</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to load todos. Please try again later.
        </div>
      </div>
    );
  }
}