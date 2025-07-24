import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUpIcon, TrendingDownIcon, UsersIcon, BookOpenIcon, ClockIcon, CheckCircleIcon } from 'lucide-react';

export const metadata = {
  title: 'Dashboard: Analytics'
};

const analyticsData = [
  {
    title: 'Total RPP Created',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: BookOpenIcon,
    description: 'This month'
  },
  {
    title: 'Active Students',
    value: '1,234',
    change: '+5%',
    trend: 'up',
    icon: UsersIcon,
    description: 'Currently enrolled'
  },
  {
    title: 'Teaching Hours',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: ClockIcon,
    description: 'This semester'
  },
  {
    title: 'Completion Rate',
    value: '94%',
    change: '-2%',
    trend: 'down',
    icon: CheckCircleIcon,
    description: 'Student assignments'
  }
];

const recentActivity = [
  {
    id: 1,
    action: 'RPP Created',
    subject: 'Mathematics - Algebra',
    time: '2 hours ago',
    status: 'completed'
  },
  {
    id: 2,
    action: 'Class Scheduled',
    subject: 'Physics - Mechanics',
    time: '4 hours ago',
    status: 'pending'
  },
  {
    id: 3,
    action: 'Assignment Graded',
    subject: 'English Literature',
    time: '1 day ago',
    status: 'completed'
  }
];

export default function AnalyticsPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Analytics"
            description="Track your teaching performance and student progress"
          />
        </div>
        <Separator />
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {analyticsData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {item.trend === 'up' ? (
                      <TrendingUpIcon className="mr-1 h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDownIcon className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <span className={item.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                      {item.change}
                    </span>
                    <span className="ml-1">{item.description}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest teaching activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.subject}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}