import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserIcon, BellIcon, ShieldIcon, PaletteIcon, DatabaseIcon, HelpCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'Dashboard: Settings'
};

const settingsCategories = [
  {
    title: 'Profile Settings',
    description: 'Manage your personal information and account details',
    icon: UserIcon,
    href: '/dashboard/profile',
    badge: null
  },
  {
    title: 'Notifications',
    description: 'Configure how you receive notifications and alerts',
    icon: BellIcon,
    href: '/dashboard/settings/notifications',
    badge: 'New'
  },
  {
    title: 'Security & Privacy',
    description: 'Manage your password, two-factor authentication, and privacy settings',
    icon: ShieldIcon,
    href: '/dashboard/settings/security',
    badge: null
  },
  {
    title: 'Appearance',
    description: 'Customize the look and feel of your dashboard',
    icon: PaletteIcon,
    href: '/dashboard/settings/appearance',
    badge: null
  },
  {
    title: 'Data Management',
    description: 'Export, import, and manage your teaching data',
    icon: DatabaseIcon,
    href: '/dashboard/settings/data',
    badge: null
  },
  {
    title: 'Help & Support',
    description: 'Get help, view documentation, and contact support',
    icon: HelpCircleIcon,
    href: '/dashboard/settings/help',
    badge: null
  }
];

const quickActions = [
  {
    title: 'Change Password',
    description: 'Update your account password',
    action: 'Change'
  },
  {
    title: 'Export Data',
    description: 'Download your teaching data',
    action: 'Export'
  },
  {
    title: 'Clear Cache',
    description: 'Clear application cache and temporary files',
    action: 'Clear'
  }
];

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <Heading
            title="Settings"
            description="Manage your account settings and preferences"
          />
        </div>
        <Separator />
        
        {/* Settings Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Settings Categories</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {settingsCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{category.title}</CardTitle>
                      </div>
                      {category.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {category.badge}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-4">
                      {category.description}
                    </CardDescription>
                    <Link
                      href={category.href}
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
                    >
                      Configure
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Quick Actions</h3>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {action.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Account Information</h3>
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the Professional plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Professional Plan</p>
                    <p className="text-sm text-muted-foreground">Unlimited RPP creation and advanced features</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    View Plan Details
                  </Button>
                  <Button>
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}