import { NextResponse } from 'next/server';

const API_BASE_URL = 'http://localhost:5000/api';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');
  
  const res = await fetch(`${API_BASE_URL}/todos?page=${page}`);
  const data = await res.json();
  
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  
  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  const data = await res.json();
  
  return NextResponse.json(data);
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();
  
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  const data = await res.json();
  
  return NextResponse.json(data);
}