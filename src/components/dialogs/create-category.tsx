"use client";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch"; // If you have a Switch component
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export function CreateCategoryDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoryName, setCategoryName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [open, setOpen] = useState(false);
  const createCategory = useMutation(api.mutation.createCategory);
  const params = useParams();
  const serverid = params.serverid as Id<"servers">;
  const handleCreate = async () => {
    // Handle create logic here
    const result = await createCategory({ serverid, name: categoryName });
    if (!result) {
      toast("Error Creating category");
    }
    setCategoryName("");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div>{children}</div>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogContent className="sm:max-w-md rounded-2xl bg-background/80 shadow-2xl border border-accent/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-extrabold text-accent tracking-tight mb-2">
              Create Category
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-6">
            <div>
              <Label
                htmlFor="categoryName"
                className="mb-2 block text-base font-semibold text-accent"
              >
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
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M17 11V7a5 5 0 0 0-10 0v4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2ZM9 7a3 3 0 1 1 6 0v4H9V7Zm8 6v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1Z"
                    />
                  </svg>
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
                <AlertDialogDescription className="text-xs text-muted-foreground mt-1">
                  By making a category private, only select members and roles
                  will be able to view this category. Linked channels in this
                  category will automatically match to this setting.
                </AlertDialogDescription>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="mt-6 flex gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="rounded-lg px-6">
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              onClick={handleCreate}
              className="bg-accent text-white font-semibold rounded-lg px-6 shadow transition"
              disabled={!categoryName.trim()}
            >
              Create Category
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
