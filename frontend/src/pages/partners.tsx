import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreatePartner,
  useDeletePartner,
  usePartners,
  useUpdatePartner,
} from "@/hooks/usePartnerHooks";
import type { Partner } from "@/types";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type PartnerFormData = Omit<Partner, "id" | "users" | "logo_url" | "image_url">;

export function Partners() {
  const { data, isLoading, mutate } = usePartners();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const { trigger: deletePartner, isMutating: isDeleting } = useDeletePartner();
  const { trigger: updatePartner } = useUpdatePartner();
  const { trigger: createPartner } = useCreatePartner();

  const [partnerForm, setPartnerForm] = useState<PartnerFormData>({
    name: "",
    country: "",
    partner_type: "",
    partner_group_id: 1,
  });

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setPartnerForm({
      name: partner.name,
      country: partner.country || "",
      partner_type: partner.partner_type || "",
      partner_group_id: partner.partner_group_id || 1,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
    setEditingPartner(null);
    setPartnerForm({
      name: "",
      country: "",
      partner_type: "",
      partner_group_id: 1,
    });
  };

  const handleDelete = (partnerId: number) => {
    deletePartner(
      { partnerId },
      {
        onSuccess: () => {
          toast.success("Partner deleted successfully");
          mutate();
        },
        onError: (error) => {
          console.error("Failed to delete partner:", error);
          toast.error("Failed to delete partner");
        },
      }
    );
  };

  const handleSavePartner = async () => {
    try {
      if (editingPartner) {
        await updatePartner(
          {
            partnerId: editingPartner.id,
            partner: partnerForm as Omit<Partner, "id">,
          },
          {
            onSuccess: () => {
              toast.success("Partner updated successfully");
              mutate();
              handleDialogClose();
            },
            onError: (error) => {
              console.error("Failed to update partner:", error);
              toast.error("Failed to update partner");
            },
          }
        );
      } else {
        await createPartner(partnerForm, {
          onSuccess: () => {
            toast.success("Partner created successfully");
            mutate();
            handleDialogClose();
          },
          onError: (error) => {
            console.error("Failed to create partner:", error);
            toast.error("Failed to create partner");
          },
        });
      }
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(`Failed to ${editingPartner ? "update" : "create"} partner`);
    }
  };

  const filteredPartners = data?.filter(
    (partner: Partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (partner.country &&
        partner.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (partner.partner_type &&
        partner.partner_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Partners</h2>
          <p className="text-muted-foreground">Manage your partners</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-muted/50">
              <th className="p-4 font-medium w-1/3">Name</th>
              <th className="p-4 font-medium w-1/6">Type</th>
              <th className="p-4 font-medium w-1/6">Country</th>
              <th className="p-4 font-medium w-1/6">Group</th>
              <th className="p-4 font-medium text-right w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners?.map((partner: Partner) => (
              <tr key={partner.id} className="border-b hover:bg-muted/50">
                <td className="p-4 font-medium">{partner.name}</td>
                <td className="p-4">
                  {partner.partner_type && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {partner.partner_type}
                    </span>
                  )}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {partner.country || "N/A"}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {/* {partner.group?.name || "N/A"} */}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(partner)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(partner.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Partner Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingPartner ? "Edit Partner" : "Add New Partner"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Partner Name *
                  </label>
                  <Input
                    value={partnerForm.name}
                    onChange={(e) =>
                      setPartnerForm({ ...partnerForm, name: e.target.value })
                    }
                    placeholder="Enter partner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country *
                  </label>
                  <Input
                    value={partnerForm.country || ""}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        country: e.target.value,
                      })
                    }
                    placeholder="Enter country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type *
                  </label>
                  <Input
                    value={partnerForm.partner_type || ""}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        partner_type: e.target.value,
                      })
                    }
                    placeholder="Enter partner type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Group
                  </label>
                  <select
                    value={partnerForm.partner_group_id || ""}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        partner_group_id: e.target.value
                          ? parseInt(e.target.value)
                          : 0,
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a group (optional)</option>
                    {/* Partner groups would be mapped here if available */}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button onClick={handleSavePartner}>
                  {editingPartner ? "Update Partner" : "Create Partner"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
