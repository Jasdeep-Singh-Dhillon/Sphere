import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "convex/_generated/dataModel";

import { roleSchema } from "convex/schema";

type EditRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: typeof roleSchema;
  onSave: (role: typeof roleSchema) => void;
};

function EditRoleDialog({
  open,
  onOpenChange,
  role,
  onSave,
}: EditRoleDialogProps) {
  const [roleName, setRoleName] = useState<string>(role.name);
  const [permissions, setPermissions] = useState(role.permissions);

  useEffect(() => {
    setRoleName(JSON.stringify(role.name));
    setPermissions(role.permissions);
  }, [role]);

  const handlePermissionChange = (perm: keyof Role["permissions"]) => {
    setPermissions((prev) => ({ ...prev, [perm]: !prev[perm] }));
  };

  const handleSave = () => {
    onSave({ ...role, name: roleName, permissions });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-full rounded-2xl bg-background/80 shadow-2xl border border-accent/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-accent tracking-tight mb-2 text-center">
            Edit Role
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label
              htmlFor="roleName"
              className="mb-2 block text-base font-semibold text-accent"
            >
              ROLE NAME
            </label>
            <input
              id="roleName"
              placeholder="Role name"
              value={JSON.stringify(roleName)}
              onChange={(e) => setRoleName(e.target.value)}
              className="mt-2 rounded-lg border-accent/30 focus:border-accent focus:ring-accent/30 transition w-full px-3 py-2"
            />
          </div>
          <div>
            <div className="mb-2 text-base font-semibold text-accent">
              Permissions
            </div>
            <div className="flex flex-col gap-4">
              <label className="flex items-center justify-between gap-3">
                <span className="font-medium">View Channel</span>
                <button
                  type="button"
                  aria-pressed={permissions.viewChannel}
                  onClick={() => handlePermissionChange("viewChannel")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${permissions.viewChannel ? "bg-accent" : "bg-accent/30"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${permissions.viewChannel ? "translate-x-5" : "translate-x-1"}`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between gap-3">
                <span className="font-medium">Manage Roles</span>
                <button
                  type="button"
                  aria-pressed={permissions.manageRoles}
                  onClick={() => handlePermissionChange("manageRoles")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${permissions.manageRoles ? "bg-accent" : "bg-accent/30"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${permissions.manageRoles ? "translate-x-5" : "translate-x-1"}`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between gap-3">
                <span className="font-medium">Admin</span>
                <button
                  type="button"
                  aria-pressed={permissions.admin}
                  onClick={() => handlePermissionChange("admin")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${permissions.admin ? "bg-accent" : "bg-accent/30"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${permissions.admin ? "translate-x-5" : "translate-x-1"}`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2 justify-end">
          <DialogClose asChild>
            <button className="rounded-lg px-6 py-2 border border-accent/30">
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={handleSave}
            className="bg-accent text-white font-semibold rounded-lg px-6 py-2 shadow transition"
            disabled={!roleName.trim()}
          >
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EditRolesSection() {
  const { serverid } = useParams();
  const roles = useQuery(api.servers.getRoles, {
    serverid: serverid as Id<"servers">,
  });
  const [editingRole, setEditingRole] = useState<typeof roleSchema | null>(
    null,
  );
  return (
    <div className="max-w-2xl mx-auto w-full mt-10">
      <div className="flex items-center mb-6 px-2">
        <div className="flex-1 text-lg font-bold text-accent">Role</div>
        <div className="w-24 text-lg font-bold text-accent text-center">
          Edit
        </div>
      </div>
      <div className="divide-y divide-accent/10">
        {(roles ?? []).map((role) => (
          <div key={role._id} className="flex items-center py-4 px-2">
            <div className="flex-1 text-lg font-semibold text-white">
              {role.name}
            </div>
            <div className="w-24 flex justify-center">
              <button
                onClick={() => setEditingRole(role)}
                className="rounded-lg bg-accent text-white font-semibold px-5 py-2 hover:bg-accent/80 transition"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      {editingRole && (
        <EditRoleDialog
          open={!!editingRole}
          onOpenChange={() => setEditingRole(null)}
          role={editingRole}
          onSave={(updated: Role) =>
            setRoles(roles.map((r) => (r.id === updated.id ? updated : r)))
          }
        />
      )}
    </div>
  );
}
