import { NextResponse } from 'next/server';

const API_BASE_URL = 'http://localhost:5000/api';

export async function GET(request, { params }) {
  const { id } = params;
  
  const res = await fetch(`${API_BASE_URL}/todos/${id}`);
  const data = await res.json();
  
  return NextResponse.json(data);
}