import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePartners } from "@/hooks/usePartnerHooks";
import { type Partner } from "@/types";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export function Partners() {
  const { data, isLoading } = usePartners();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    name: "",
    country: "",
    partner_type: "",
    partner_group_id: 0,
  });

  const filteredPartners = data?.filter(
    (partner: Partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.partner_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePartner = () => {
    // Implementation for creating a new partner
    console.log("Creating partner:", newPartner);
    // Reset form and close dialog
    setNewPartner({
      name: "",
      country: "",
      partner_type: "",
      partner_group_id: 0,
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

      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
          <div className="col-span-4 font-medium">Name</div>
          <div className="col-span-2 font-medium">Type</div>
          <div className="col-span-2 font-medium">Country</div>
          <div className="col-span-2 font-medium">Group</div>
          <div className="col-span-2 text-right font-medium">Actions</div>
        </div>
        {filteredPartners?.map((partner: Partner) => (
          <div
            key={partner.id}
            className="grid grid-cols-12 gap-4 p-4 items-center border-b hover:bg-muted/50"
          >
            <div className="col-span-4 font-medium">{partner.name}</div>
            <div className="col-span-2 text-sm text-muted-foreground">
              {partner.partner_type}
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
              {partner.country}
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
              {partner.group?.name || "N/A"}
            </div>
            <div className="col-span-2 flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Partner Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Partner</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Partner Name *
                  </label>
                  <Input
                    value={newPartner.name}
                    onChange={(e) =>
                      setNewPartner({ ...newPartner, name: e.target.value })
                    }
                    placeholder="Enter partner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country *
                  </label>
                  <Input
                    value={newPartner.country}
                    onChange={(e) =>
                      setNewPartner({ ...newPartner, country: e.target.value })
                    }
                    placeholder="Enter country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type *
                  </label>
                  <Input
                    value={newPartner.partner_type}
                    onChange={(e) =>
                      setNewPartner({
                        ...newPartner,
                        partner_type: e.target.value,
                      })
                    }
                    placeholder="Enter partner type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Group *
                  </label>
                  <select
                    value={newPartner.partner_group_id}
                    onChange={(e) =>
                      setNewPartner({
                        ...newPartner,
                        partner_group_id: parseInt(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a group</option>
                    {/* Map through partner groups here */}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreatePartner}>Create Partner</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
