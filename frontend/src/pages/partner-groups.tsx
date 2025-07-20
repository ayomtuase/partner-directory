import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePartnerGroups } from "@/hooks/usePartnerGroups";
import { type PartnerGroup } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";

export function PartnerGroups() {
  const { data, isLoading } = usePartnerGroups();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "" });

  const filteredGroups = data?.filter((group: PartnerGroup) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = () => {
    // Implementation for creating a new partner group
    console.log("Creating group:", newGroup);
    // Reset form and close dialog
    setNewGroup({ name: "" });
    setIsCreateDialogOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Partner Groups</h2>
          <p className="text-muted-foreground">Manage your partner groups</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search groups..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups?.map((group: PartnerGroup) => (
          <div
            key={group.id}
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <p className="text-sm text-muted-foreground">
              {group.partners?.length || 0} partners
            </p>
          </div>
        ))}
      </div>

      {/* Create Group Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Group Name
                </label>
                <Input
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  placeholder="Enter group name"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup}>Create</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
