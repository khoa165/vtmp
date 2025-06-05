import React from 'react';
import moment from 'moment';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/base/card';
import { Badge } from '@/components/base/badge';
import { Link } from 'react-router-dom';
import { BlogMetadata } from '@/types';

interface TreeCardProps {
  blog: BlogMetadata;
}

export const TreeCard: React.FC<TreeCardProps> = ({
  blog: { name, title, authors, description, date, tags },
}) => {
  return (
    <Card className="blog-card flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 gap-3">
      <CardHeader className="pt-8 px-6">
        <CardTitle className="text-sky-300">{title}</CardTitle>
        <CardDescription className="pt-1">
          <span className="text-slate-400">
            {moment(date).format('MMMM Do YYYY')}
          </span>
          <span className="mx-2 text-slate-500">|</span>
          <span className="text-slate-300">{authors.join(', ')}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow pt-0 pb-4 px-6">
        <p className="mb-1 text-sm text-muted-foreground">{description}</p>
        <div className="my-1">
          {tags.map((tag) => (
            <Badge
              key={tag}
              className="mr-1 mb-1 bg-[#66ffcc] text-black border border-[#66ffcc] min-w-20 overflow-hidden"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-auto pt-2">
          <Link
            to={`/resources/${name}`}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Learn more
            <i className="bi bi-arrow-right ms-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
