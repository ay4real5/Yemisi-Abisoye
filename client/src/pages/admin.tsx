import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Users, Calendar, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Rsvp } from "@shared/schema";

export default function Admin() {
  const [editingRsvp, setEditingRsvp] = useState<Rsvp | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Rsvp | null>(null);
  const [editForm, setEditForm] = useState({
    guestName: "",
    attending: false,
    plusOneName: "",
  });

  const { data: rsvps, isLoading } = useQuery<Rsvp[]>({
    queryKey: ["/api/rsvps"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Rsvp> }) => {
      return apiRequest("PATCH", `/api/rsvps/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rsvps"] });
      setEditingRsvp(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/rsvps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rsvps"] });
      setDeleteConfirm(null);
    },
  });

  const openEditDialog = (rsvp: Rsvp) => {
    setEditForm({
      guestName: rsvp.guestName,
      attending: rsvp.attending,
      plusOneName: rsvp.plusOneName || "",
    });
    setEditingRsvp(rsvp);
  };

  const handleSave = () => {
    if (editingRsvp) {
      updateMutation.mutate({
        id: editingRsvp.id,
        data: {
          guestName: editForm.guestName,
          attending: editForm.attending,
          plusOneName: editForm.plusOneName || null,
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading RSVPs...</p>
        </div>
      </div>
    );
  }

  const attendingCount = rsvps?.filter((r) => r.attending).length || 0;
  const notAttendingCount = (rsvps?.length || 0) - attendingCount;
  const totalGuests = attendingCount + (rsvps?.filter((r) => r.attending && r.plusOneName).length || 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
            RSVP Management
          </h1>
          <p className="text-lg text-muted-foreground">
            View and edit guest responses for your wedding
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rsvps?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attending</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{attendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Attending</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{notAttendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalGuests}</div>
              <p className="text-xs text-muted-foreground mt-1">Including plus-ones</p>
            </CardContent>
          </Card>
        </div>

        {/* RSVP List */}
        <Card>
          <CardHeader>
            <CardTitle>Guest List</CardTitle>
            <CardDescription>Click the edit button to modify any RSVP entry</CardDescription>
          </CardHeader>
          <CardContent>
            {!rsvps || rsvps.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No RSVPs yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="flex items-start justify-between p-4 border border-border rounded-lg hover-elevate"
                    data-testid={`rsvp-${rsvp.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg text-foreground">
                          {rsvp.guestName}
                        </h3>
                        <Badge variant={rsvp.attending ? "default" : "secondary"}>
                          {rsvp.attending ? "Attending" : "Not Attending"}
                        </Badge>
                      </div>
                      
                      {rsvp.plusOneName && rsvp.attending && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Plus One: {rsvp.plusOneName}</span>
                        </div>
                      )}

                      {rsvp.createdAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Submitted: {new Date(rsvp.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(rsvp)}
                        data-testid={`edit-rsvp-${rsvp.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteConfirm(rsvp)}
                        data-testid={`delete-rsvp-${rsvp.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingRsvp} onOpenChange={(open) => !open && setEditingRsvp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit RSVP</DialogTitle>
            <DialogDescription>
              Make changes to this guest's RSVP response
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Guest Name</Label>
              <Input
                id="guestName"
                value={editForm.guestName}
                onChange={(e) => setEditForm({ ...editForm, guestName: e.target.value })}
                data-testid="input-edit-guest-name"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="attending">Attending</Label>
              <Switch
                id="attending"
                checked={editForm.attending}
                onCheckedChange={(checked) => setEditForm({ ...editForm, attending: checked })}
                data-testid="switch-edit-attending"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plusOneName">Plus One Name (optional)</Label>
              <Input
                id="plusOneName"
                value={editForm.plusOneName}
                onChange={(e) => setEditForm({ ...editForm, plusOneName: e.target.value })}
                placeholder="Leave empty if no plus one"
                data-testid="input-edit-plus-one"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRsvp(null)} data-testid="button-cancel-edit">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={updateMutation.isPending}
              data-testid="button-save-edit"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete RSVP</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the RSVP for "{deleteConfirm?.guestName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete} 
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
