'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createFleetAction } from '../actions/create-fleet-action';

export default function CreateFleetModal({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      await createFleetAction(formData);
      setOpen(false);
    } catch (error) {
      console.error('Failed to create fleet:', error);
      // TODO: エラー表示
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Fleet</DialogTitle>
          <DialogDescription>Enter your fleet details below.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input name="title" placeholder="Title" required />
          <Input name="memo" placeholder="Memo" />
          <Button disabled={isPending} type="submit">
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
