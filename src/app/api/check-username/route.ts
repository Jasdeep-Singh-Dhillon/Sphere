import { NextResponse } from 'next/server';

// Dummy usernames for demonstration. Replace with your DB check.
const takenUsernames = ['admin', 'user', 'test'];

export async function POST(req: Request) {
  const { username } = await req.json();
  // Simulate DB check
  const isTaken = takenUsernames.includes(username?.toLowerCase());
  return NextResponse.json({ taken: isTaken });
}
