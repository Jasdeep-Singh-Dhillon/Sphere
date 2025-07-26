import { LucideIcon } from "lucide-react";
import { Label } from "./label";
import { Input } from "./input";

export default function InputIcon({
  Icon,
  placeholder,
}: {
  Icon: LucideIcon;
  placeholder: string;
}) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="search">Search</Label>
      <div className="relative">
        <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <Input
          id="search"
          type="search"
          placeholder={placeholder}
          className="w-full rounded-lg bg-background pl-8"
        />
      </div>
    </div>
  );
}
