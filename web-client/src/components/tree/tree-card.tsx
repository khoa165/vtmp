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
    <Card className="blog-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-muted-foreground pt-1">
          <span>{moment(date).format('MMMM Do YYYY')}</span>
          <span className="mx-2">|</span>
          <span>{authors.join(', ')}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-1 text-sm text-muted-foreground">{description}</p>
        <div className="mb-3 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="mr-1 mb-1">
              {tag}
            </Badge>
          ))}
        </div>
        <Link
          to={`/resources/${name}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Learn more
          <i className="bi bi-arrow-right ms-1" />
        </Link>
      </CardContent>
    </Card>
  );
};
