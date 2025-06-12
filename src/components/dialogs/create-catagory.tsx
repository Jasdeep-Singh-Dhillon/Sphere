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
import { Switch } from '~/components/ui/switch'; // If you have a Switch component

export function CreateCategoryDialog() {
  const [categoryName, setCategoryName] = React.useState('');
  const [isPrivate, setIsPrivate] = React.useState(false);

  const handleCreate = () => {
    // Handle create logic here
    console.log({ categoryName, isPrivate });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-accent text-white font-semibold px-6 py-2 rounded-xl shadow transition">
          + Create Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl bg-background/80 shadow-2xl border border-accent/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-accent tracking-tight mb-2">
            Create Category
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="categoryName" className="mb-2 block text-base font-semibold text-accent">
              CATEGORY NAME
            </Label>
            <Input
              id="categoryName"
              placeholder="New Category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-2 rounded-lg border-accent/30 focus:border-accent focus:ring-accent/30 transition"
            />
          </div>
          <div className="flex items-start gap-3 mt-2">
            <div className="pt-1">
              <span className="inline-block text-xl text-accent">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17 11V7a5 5 0 0 0-10 0v4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2ZM9 7a3 3 0 1 1 6 0v4H9V7Zm8 6v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1Z"/></svg>
              </span>
            </div>
            <div className="flex-1">
              <Label className="font-semibold text-base text-accent flex items-center gap-2">
                Private Category
                <Switch
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                  className="ml-2"
                  aria-label="Private Category"
                />
              </Label>
              <div className="text-xs text-muted-foreground mt-1">
                By making a category private, only select members and roles will be able to view this category. Linked channels in this category will automatically match to this setting.
              </div>
            </div>
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
            disabled={!categoryName.trim()}
          >
            Create Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}