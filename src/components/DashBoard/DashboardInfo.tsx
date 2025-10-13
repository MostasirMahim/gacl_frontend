import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DashBoardInfo() {
  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Overview of key system components.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm w-full">
        <div className="flex items-center justify-between">
          <span>API Version:</span>
          <Badge variant="outline" className="text-green-500">
            v1.2.5
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Database Connection:</span>
          <Badge className="bg-green-500 hover:bg-green-500 text-white">
            Online
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Last Deployment:</span>
          <span className="text-muted-foreground">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
