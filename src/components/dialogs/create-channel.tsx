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
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

export function CreateChannelDialog() {
  const [channelType, setChannelType] = React.useState<'text' | 'voice'>('text');
  const [channelName, setChannelName] = React.useState('');
  const [isPrivate, setIsPrivate] = React.useState(false);

  const handleCreate = () => {
    console.log({ channelType, channelName, isPrivate });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-accent text-white font-semibold px-6 py-2 rounded-xl shadow hover:bg-accent/90 transition">
          + Create Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl bg-background/80 shadow-2xl border border-accent/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-accent tracking-tight mb-2">
            Create a New Channel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="mb-2 block text-base font-semibold text-accent">Channel Type</Label>
            {/* Button group with animated highlight */}
            <div className="relative flex gap-2 mt-2">
              {/* Animated highlight */}
              <div
                className="absolute top-0 left-0 h-full w-1/2 rounded-lg bg-accent z-0 transition-transform duration-300"
                style={{
                  transform: channelType === 'text' ? 'translateX(0%)' : 'translateX(100%)',
                }}
              />
              <Button
                type="button"
                variant="ghost"
                className={`w-1/2 z-10 transition-colors duration-300 ${
                  channelType === 'text' ? 'text-white font-bold' : 'text-accent'
                }`}
                onClick={() => setChannelType('text')}
                style={{ background: 'none' }}
              >
                Text
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={`w-1/2 z-10 transition-colors duration-300 ${
                  channelType === 'voice' ? 'text-white font-bold' : 'text-accent'
                }`}
                onClick={() => setChannelType('voice')}
                style={{ background: 'none' }}
              >
                Voice
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {channelType === 'text'
                ? 'Send messages, images, GIFs, emoji and files'
                : 'Hang out together with voice, video and screen sharing'}
            </div>
          </div>

          <div>
            <Label htmlFor="channelName" className="text-base font-semibold text-accent">
              Channel Name
            </Label>
            <Input
              id="channelName"
              placeholder="# new-channel"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="mt-2 rounded-lg border-accent/30 focus:border-accent focus:ring-accent/30 transition"
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
            className="bg-accent text-white font-semibold rounded-lg px-6 shadow hover:bg-accent/90 transition"
          >
            Create Channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
