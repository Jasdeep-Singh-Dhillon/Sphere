'use client';
import { CreateChannelDialog } from "~/components/dialogs/create-channel";
import { CreateCategoryDialog } from "~/components/dialogs/create-catagory";
import { CreateServerDialog } from "~/components/dialogs/create-server";
import { SetUsernameDialog } from "~/components/dialogs/set-username";
import { Button } from "~/components/ui/button";
import * as React from 'react';

export default function TestPage() {
  return (
    <div>
      <CreateChannelDialog>
        <Button variant={"ghost"}>
          + Create Channel
        </Button>
      </CreateChannelDialog>
      <CreateCategoryDialog>
        <Button variant={"ghost"}>
          + Create Category
        </Button>
      </CreateCategoryDialog><br />
      <CreateServerDialog >
        <Button variant={"ghost"}>
          + Create Server
        </Button>
      </CreateServerDialog>
      <SetUsernameDialog>
        <Button variant={"ghost"}>
          Set Username
        </Button>
      </SetUsernameDialog>
    </div>
  );
}