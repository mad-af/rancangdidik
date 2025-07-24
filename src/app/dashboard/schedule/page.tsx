import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ClockIcon } from 'lucide-react';

export const metadata = {
  title: 'Dashboard: Schedule'
};

const scheduleData = [
  {
    id: 1,
    title: 'Mathematics Class',
    time: '08:00 - 09:30',
    date: '2024-01-15',
    class: 'X-A',
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'Physics Lab',
    time: '10:00 - 11:30',
    date: '2024-01-15',
    class: 'XI-B',
    status: 'ongoing'
  },
  {
    id: 3,
    title: 'English Literature',
    time: '13:00 - 14:30',
    date: '2024-01-15',
    class: 'XII-A',
    status: 'completed'
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800';
    case 'ongoing':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function SchedulePage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Schedule"
            description="View and manage your teaching schedule"
          />
        </div>
        <Separator />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scheduleData.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Class {item.class}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    {item.time}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}