import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { toast } from "sonner";
import type { NgoRow } from "@/lib/ngos";

export function HelpRequestDialog({
  ngo,
  open,
  onOpenChange,
}: {
  ngo: NgoRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { user } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ngo) return;
    if (!user) {
      toast.error("Please sign in to send a help request.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("help_requests").insert({
      ngo_id: ngo.id,
      citizen_id: user.id,
      name: form.name,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Help request sent");
    onOpenChange(false);
    setForm({ name: "", phone: "", subject: "", message: "" });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send help request</DialogTitle>
          <DialogDescription>
            {ngo ? `Reach out to ${ngo.name} for assistance.` : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="h-name">Your name</Label>
              <Input id="h-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="h-phone">Phone</Label>
              <Input id="h-phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="h-sub">Subject</Label>
            <Input id="h-sub" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="h-msg">Describe your situation</Label>
            <Textarea id="h-msg" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send request"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
