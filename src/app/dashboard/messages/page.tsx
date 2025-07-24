'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SearchIcon, SendIcon, MoreVerticalIcon } from 'lucide-react';
import { useState } from 'react';

export const metadata = {
  title: 'Dashboard: Messages'
};

const messages = [
  {
    id: 1,
    sender: 'Ahmad Rizki',
    avatar: '/avatars/01.png',
    initials: 'AR',
    subject: 'Question about Math Assignment',
    preview: 'Hi teacher, I have a question about the algebra problem...',
    time: '10:30 AM',
    unread: true,
    type: 'student'
  },
  {
    id: 2,
    sender: 'Siti Nurhaliza',
    avatar: '/avatars/02.png',
    initials: 'SN',
    subject: 'Request for Extra Class',
    preview: 'Could we schedule an additional physics session?',
    time: '09:15 AM',
    unread: true,
    type: 'student'
  },
  {
    id: 3,
    sender: 'Dr. Budi Santoso',
    avatar: '/avatars/03.png',
    initials: 'BS',
    subject: 'Curriculum Update Meeting',
    preview: 'Please join the meeting tomorrow at 2 PM...',
    time: 'Yesterday',
    unread: false,
    type: 'colleague'
  },
  {
    id: 4,
    sender: 'Parent - Mrs. Dewi',
    avatar: '/avatars/04.png',
    initials: 'MD',
    subject: 'Student Progress Inquiry',
    preview: 'I would like to discuss my child\'s progress...',
    time: '2 days ago',
    unread: false,
    type: 'parent'
  }
];

function getTypeColor(type: string) {
  switch (type) {
    case 'student':
      return 'bg-blue-100 text-blue-800';
    case 'colleague':
      return 'bg-green-100 text-green-800';
    case 'parent':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  const filteredMessages = messages.filter(message =>
    message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Messages"
            description="Communicate with students, parents, and colleagues"
          />
          <Button>
            <SendIcon className="mr-2 h-4 w-4" />
            Compose
          </Button>
        </div>
        <Separator />
        
        <div className="grid gap-4 md:grid-cols-3">
          {/* Messages List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <SearchIcon className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-2 ${
                        selectedMessage === message.id
                          ? 'border-l-primary bg-muted/50'
                          : 'border-l-transparent'
                      }`}
                      onClick={() => setSelectedMessage(message.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback className="text-xs">
                            {message.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">
                              {message.sender}
                            </p>
                            <div className="flex items-center space-x-1">
                              {message.unread && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {message.time}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground truncate">
                            {message.subject}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {message.preview}
                          </p>
                          <div className="mt-1">
                            <Badge className={getTypeColor(message.type)} variant="secondary">
                              {message.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Content */}
          <div className="md:col-span-2">
            <Card className="h-[600px]">
              {selectedMessage ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={messages.find(m => m.id === selectedMessage)?.avatar} />
                          <AvatarFallback>
                            {messages.find(m => m.id === selectedMessage)?.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {messages.find(m => m.id === selectedMessage)?.subject}
                          </CardTitle>
                          <CardDescription>
                            From: {messages.find(m => m.id === selectedMessage)?.sender}
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-6">
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed">
                        {messages.find(m => m.id === selectedMessage)?.preview}
                      </p>
                      <p className="text-sm leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                      </p>
                      <p className="text-sm leading-relaxed">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                      </p>
                    </div>
                    
                    {/* Reply Section */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="space-y-3">
                        <textarea
                          className="w-full p-3 border rounded-md resize-none"
                          rows={4}
                          placeholder="Type your reply..."
                        />
                        <div className="flex justify-end">
                          <Button>
                            <SendIcon className="mr-2 h-4 w-4" />
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <SendIcon className="mx-auto h-12 w-12 mb-4" />
                    <p>Select a message to view its content</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}