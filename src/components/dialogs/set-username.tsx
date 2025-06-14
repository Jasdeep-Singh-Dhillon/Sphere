'use client';
import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useEffect, useState } from 'react';

export function SetUsernameDialog({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = React.useState('');
  const [checking, setChecking] = useState(false);
  const [taken, setTaken] = useState(false);
  const [invalid, setInvalid] = useState(false);

  // Only allow a-z, 0-9, _ and . (no spaces, no other special chars)
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;

  useEffect(() => {
    if (!username) {
      setTaken(false);
      setInvalid(false);
      return;
    }
    if (!usernameRegex.test(username)) {
      setInvalid(true);
      setTaken(false);
      return;
    } else {
      setInvalid(false);
    }
    setChecking(true);
    const timeout = setTimeout(() => {
      fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      })
        .then((res) => res.json())
        .then((data) => setTaken(data.taken))
        .finally(() => setChecking(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [username]);

  const handleSet = () => {
    // Handle set username logic here
    console.log({ username });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl bg-background/80 shadow-2xl border border-accent/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-accent tracking-tight mb-2 text-center">
            Set Your Username
          </DialogTitle>
          <div className="text-muted-foreground text-center mb-4 text-base">
            Choose a unique username for your account.
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="mb-2 block text-base font-semibold text-accent">
              USERNAME
            </label>
            <Input
              id="username"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
              className="mt-2 rounded-lg border-accent/30 focus:border-accent focus:ring-accent/30 transition"
            />
            {username && (
              <div className="mt-1 text-xs h-5">
                {invalid ? (
                  <span className="text-red-500">Only letters, numbers, '_' and '.' allowed</span>
                ) : checking ? (
                  <span className="text-muted-foreground">Checking...</span>
                ) : taken ? (
                  <span className="text-red-500">Username is already taken</span>
                ) : (
                  <span className="text-green-500">Username is available</span>
                )}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-6 flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-lg px-6">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSet}
            className="bg-accent text-white font-semibold rounded-lg px-6 shadow transition"
            disabled={!username.trim() || taken || checking || invalid}
          >
            Set Username
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
