'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClientComponentClient } from '@/lib/supabase/client';
const supabase = createClientComponentClient();

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTodos(data || []);
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title: newTodo.trim(), user_id: user.id }])
        .select();

      if (error) throw error;
      setTodos([data[0], ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) throw error;
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  if (!user) {
    return (
      <div>
        Please sign in to access this page.{' '}
        <Link
          href='/login'
          className='transition-colors hover:text-primary'
        >
          Sign in here.
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <Button variant='outline' onClick={signOut}>
          Sign Out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
          <CardDescription>
            What do you need to do today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTodo} className='flex gap-2'>
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder='Enter a new todo...'
              className='flex-1'
            />
            <Button type='submit'>Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'>Your Todos</h2>
        {loading ? (
          <p>Loading todos...</p>
        ) : todos.length === 0 ? (
          <p>No todos yet. Add one above!</p>
        ) : (
          <div className='space-y-2'>
            {todos.map((todo) => (
              <div
                key={todo.id}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={todo.completed}
                    onChange={() =>
                      toggleTodo(todo.id, todo.completed)
                    }
                    className='h-4 w-4'
                  />
                  <span
                    className={
                      todo.completed
                        ? 'line-through text-gray-500'
                        : ''
                    }
                  >
                    {todo.title}
                  </span>
                </div>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
