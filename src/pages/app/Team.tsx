import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, MailPlus, Shield, User as UserIcon, Crown } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsage } from "@/hooks/useUsage";
import { planHasTeam } from "@/lib/plans";

type TeamRole = "admin" | "member";

const mockMembers: Array<{ id: string; name: string; email: string; role: TeamRole }> = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
  { id: "2", name: "Ava Miller", email: "ava@example.com", role: "member" },
];

export default function Team() {
  const navigate = useNavigate();
  const { plan } = useUsage();
  const teamEnabled = useMemo(() => planHasTeam(plan), [plan]);
  const [inviteEmail, setInviteEmail] = useState("");

  if (!teamEnabled) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <PageHeader
          title="Team collaboration (Standard & Pro)"
          description="Invite teammates, assign roles, and collaborate on templates and document processing."
        />

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Upgrade to unlock Team</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <MailPlus className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span>Invite colleagues</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span>Assign Admin and Member roles</span>
              </li>
              <li className="flex items-start gap-2">
                <UserIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span>Collaborate on templates</span>
              </li>
              <li className="flex items-start gap-2">
                <Crown className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span>Control access</span>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <Button onClick={() => navigate("/app/billing")}>Upgrade plan</Button>
              <Button variant="outline" onClick={() => navigate("/pricing")}>View plans</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Team"
        description="Invite teammates and collaborate on templates and document processing."
        actions={
          <Button onClick={() => navigate("/app/billing")} variant="outline">
            Manage billing
          </Button>
        }
      />

      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Invite a teammate</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="teammate@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <Button disabled={!inviteEmail}>
              <MailPlus className="w-4 h-4 mr-2" />
              Send invite
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMembers.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell className="text-muted-foreground">{m.email}</TableCell>
                      <TableCell>
                        <Badge variant={m.role === "admin" ? "default" : "secondary"}>
                          {m.role}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
