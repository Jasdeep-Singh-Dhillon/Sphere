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
import { Switch } from '~/components/ui/switch';

export function CreateRoleSection() {
  const [roleName, setRoleName] = React.useState('');
  const [permissions, setPermissions] = React.useState({
    viewChannel: true,
    manageRoles: false,
    admin: false,
  });

  const handlePermissionChange = (perm: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [perm]: !prev[perm] }));
  };

  const handleCreate = () => {
    // Handle create role logic here
    console.log({ roleName, permissions });
  };

  return (
    <div className="w-full p-0">
      <div className="text-2xl font-extrabold text-accent tracking-tight mb-2 text-center">
        Create Role
      </div>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label htmlFor="roleName" className="mb-2 block text-base font-semibold text-accent">
            ROLE NAME
          </label>
          <Input
            id="roleName"
            placeholder="Role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="mt-2 rounded-lg border-accent/30 focus:border-accent focus:ring-accent/30 transition"
          />
        </div>
        <div>
          <div className="mb-2 text-base font-semibold text-accent">Permissions</div>
          <div className="flex flex-col gap-4">
            {/* View Channels */}
            <div className="rounded-xl bg-muted/60 px-5 py-4 flex items-start justify-between">
              <div>
                <div className="font-semibold text-base text-accent">View Channels</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Allows members to view channels by default (excluding private channels).
                </div>
              </div>
              <Switch
                checked={permissions.viewChannel}
                onCheckedChange={() => handlePermissionChange('viewChannel')}
                className="ml-6 mt-1"
              />
            </div>
            {/* Manage Roles */}
            <div className="rounded-xl bg-muted/60 px-5 py-4 flex items-start justify-between">
              <div>
                <div className="font-semibold text-base text-accent">Manage Roles</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Allows members to create new roles and edit or delete roles lower than their highest role. Also allows members to change permissions of individual channels that they have access to.
                </div>
              </div>
              <Switch
                checked={permissions.manageRoles}
                onCheckedChange={() => handlePermissionChange('manageRoles')}
                className="ml-6 mt-1"
              />
            </div>
            {/* Advanced Permissions */}
            <div className="mt-2">
              <div className="mb-2 text-base font-semibold text-accent">Advanced Permissions</div>
              <div className="rounded-xl bg-muted/60 px-5 py-4 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-base text-accent">Administrator</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Members with this permission will have every permission and will also bypass all channel specific permissions or restrictions (for example, these members would get access to all private channels). <span className="font-semibold text-warning">This is a dangerous permission to grant.</span>
                  </div>
                </div>
                <Switch
                  checked={permissions.admin}
                  onCheckedChange={() => handlePermissionChange('admin')}
                  className="ml-6 mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <Button
          onClick={handleCreate}
          className="bg-accent text-white font-semibold rounded-lg px-6 shadow transition"
          disabled={!roleName.trim()}
        >
          Create Role
        </Button>
      </div>
    </div>
  );
}
