import { Github, AppWindow } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileImage } from '@/components/ProfileImage';
import { Typography } from '@/components/ui/typography';

const socialLinks = [
  {
    key: 'osh-velog',
    icon: AppWindow,
    href: 'https://velog.io/@oshosh',
  },
  {
    key: 'osh-github',
    icon: Github,
    href: 'https://github.com/oshosh',
  },
];
export default function ProfileSection() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-2">
              <div className="h-36 w-36 overflow-hidden rounded-full">
                <ProfileImage />
              </div>
            </div>
          </div>

          <div className="text-center">
            <Typography variant="h3" as="h3">
              OSH
            </Typography>
            <Typography variant="p" as="p">
              Frontend Developer
            </Typography>
          </div>

          <div className="flex justify-center gap-2">
            {socialLinks.map((item, index) => (
              <Button key={item.key} variant="ghost" className="bg-primary/10" size="icon" asChild>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <item.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>

          <Typography variant="small" as="p" className="bg-primary/10 rounded p-2 text-center">
            웹 개발자 ✨
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
