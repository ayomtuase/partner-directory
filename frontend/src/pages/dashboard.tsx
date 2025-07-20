import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePartnerGroups } from "@/hooks/usePartnerGroups";
import { usePartners } from "@/hooks/usePartnerHooks";
import { useUsers } from "@/hooks/useUserHooks";

export function Dashboard() {
  const { data: groupsData } = usePartnerGroups();
  const { data: partnersData } = usePartners();
  const { data: usersData } = useUsers();

  const stats = [
    {
      name: "Partner Groups",
      value: groupsData?.length || 0,
      description: "Total number of partner groups",
    },
    {
      name: "Partners",
      value: partnersData?.length || 0,
      description: "Total number of partners",
    },
    {
      name: "Users",
      value: usersData?.length || 0,
      description: "Total number of users",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your partner directory
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
