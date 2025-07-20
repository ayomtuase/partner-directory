import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteUser, useUsers } from "@/hooks/useUserHooks";
import type { Role, User } from "@/types";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Users() {
  const { data, isLoading, mutate } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { trigger: deleteUser, isMutating: isDeleting } = useDeleteUser();

  const handleDelete = (userId: string | number) => {
    deleteUser(
      { userId },
      {
        onSuccess: () => {
          toast.success("User deleted successfully");
          mutate();
        },
        onError: (error) => {
          console.error("Failed to delete user:", error);
          toast.error("Failed to delete user");
        },
      }
    );
  };

  const [newUser, setNewUser] = useState<{
    email: string;
    password: string;
    role: Role;
    partner_id?: number;
  }>({
    email: "",
    password: "",
    role: "VIEWER",
  });

  const filteredUsers = data?.filter(
    (user: User) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    console.log("Creating user:", newUser);
    setNewUser({
      email: "",
      password: "",
      role: "VIEWER",
    });
    setIsCreateDialogOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
          <div className="col-span-4 font-medium">Email</div>
          <div className="col-span-2 font-medium">Role</div>
          <div className="col-span-4 font-medium">Partner</div>
          <div className="col-span-2 text-right font-medium">Actions</div>
        </div>
        {filteredUsers?.map((user: User) => (
          <div
            key={user.id}
            className="grid grid-cols-12 gap-4 p-4 items-center border-b hover:bg-muted/50"
          >
            <div className="col-span-4 font-medium">{user.email}</div>
            <div className="col-span-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {user.role}
              </span>
            </div>
            <div className="col-span-4 text-sm text-muted-foreground">
              {user.partner?.name || "No partner assigned"}
            </div>
            <div className="col-span-2 flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(user.id)}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create User Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password *
                </label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value as Role })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Assign to Partner (Optional)
                </label>
                <select
                  value={newUser.partner_id}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      partner_id: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a partner (optional)</option>
                  {/* Map through partners here */}
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Create User</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
