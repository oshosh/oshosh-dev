import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { HandshakeIcon } from 'lucide-react';

const contactItems = [
  {
    icon: HandshakeIcon,
    title: '기타 문의',
    description: '채용, 인터뷰, 기타 협업 제안',
    mailto: {
      email: 'dhtpgus7@gmail.com',
      subject: '[기타] 문의',
      body: '문의 종류:\n문의 내용:',
    },
  },
];

export default function ContactSection() {
  return (
    <Card>
      <CardHeader>
        <Typography as="p" variant="medium" color="secondary">
          문의하기
        </Typography>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contactItems.map((item, index) => (
            <a
              key={index}
              href={`mailto:${item.mailto.email}?subject=${encodeURIComponent(
                item.mailto.subject
              )}&body=${encodeURIComponent(item.mailto.body)}`}
              className="group bg-tertiary hover:bg-muted flex items-center gap-4 rounded-lg p-3 transition-colors"
            >
              <div className="bg-primary/20 text-primary flex shrink-0 items-center justify-center rounded-md p-1.5">
                <item.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <Typography as="h3" variant="medium" color="tertiaryForeground">
                  {item.title}
                </Typography>
                <Typography as="p" variant="xsmall" color="muted" className="pt-1">
                  {item.description}
                </Typography>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
