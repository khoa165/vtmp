import React from 'react';
import moment from 'moment';
import {
  Badge,
  Card,
  CardText,
  CardTitle,
  CardSubtitle,
  CardBody,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { BlogMetadata } from 'types';

interface TreeCardProps {
  blog: BlogMetadata;
}

export const TreeCard: React.FC<TreeCardProps> = ({
  blog: { name, title, authors, description, date, tags },
}) => {
  return (
    <Card className="blog-card">
      <CardBody>
        <CardTitle tag="h5">{title}</CardTitle>
        <CardSubtitle className="mb-3 text-muted" tag="h6">
          <span>{moment(date).format('MMMM Do YYYY')}</span>
          <span className="mx-2">|</span>
          <span>{authors.join(', ')}</span>
        </CardSubtitle>
        <CardText className="mb-1">{description} </CardText>
        <div className="mb-3">
          {tags.map((tag) => (
            <Badge>{tag}</Badge>
          ))}
        </div>
        <Link to={`/blogs/${name}`}>
          Learn more
          <i className="bi bi-arrow-right ms-2" />
        </Link>
      </CardBody>
    </Card>
  );
};
