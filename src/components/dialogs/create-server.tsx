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
import { Textarea } from '~/components/ui/textarea';
import { useRef, useState } from 'react';

export function CreateServerDialog({ children }: { children: React.ReactNode }) {
  const [serverName, setServerName] = useState('');
  const [about, setAbout] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    // Handle create logic here
    console.log({ serverName, about, photo });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-background/80 shadow-2xl border border-accent/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-accent tracking-tight mb-2 text-center">
            Create Your Server
          </DialogTitle>
          <div className="text-muted-foreground text-center mb-4 text-base">
            Give your new server a name, photo, and description.
          </div>
        </DialogHeader>
        <div className="space-y-6">
          {/* Add Photo Section */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-20 h-20">
              <img
                src={photo || '/logo.svg'}
                alt="Server Preview"
                className="w-20 h-20 rounded-full object-cover border border-accent/30 bg-muted"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-accent text-white rounded-full p-1 shadow hover:bg-accent/90 transition"
                aria-label="Add Photo"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 5v14m7-7H5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <div className="text-xs text-muted-foreground">Add a server photo</div>
          </div>
          {/* Name Section */}
          <div>
            <label htmlFor="serverName" className="mb-2 block text-base font-semibold text-accent">
              SERVER NAME
            </label>
            <Input
              id="serverName"
              placeholder="My Server"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="mt-2 rounded-lg border-accent/30 focus:border-accent focus:ring-accent/30 transition"
            />
          </div>
          {/* About Section */}
          <div>
            <label htmlFor="about" className="mb-2 block text-base font-semibold text-accent">
              ABOUT
            </label>
            <Textarea
              id="about"
              placeholder="What's this server about?"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="mt-2 rounded-lg border-accent/30 focus:border-accent focus:ring-accent/30 transition min-h-[64px] field-sizing-content"
            />
          </div>
        </div>
        <DialogFooter className="mt-6 flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-lg px-6">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleCreate}
            className="bg-accent text-white font-semibold rounded-lg px-6 shadow transition"
            disabled={!serverName.trim()}
          >
            Create Server
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}