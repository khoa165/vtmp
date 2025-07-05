import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import rehypeRaw from 'rehype-raw';

import { BlogFileMapping, BlogMetadata } from '#vtmp/web-client/types';
import { removeMetadata } from '#vtmp/web-client/utils/file';

interface BlogContainerProps {
  metadata: BlogFileMapping;
}
export const BlogContainer: React.FC<BlogContainerProps> = ({ metadata }) => {
  const { filename } = useParams<{ filename: string }>();
  const [markdown, setMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentBlogMetadata: BlogMetadata | undefined = filename
    ? metadata[filename]
    : undefined;

  useEffect(() => {
    if (!filename || !currentBlogMetadata) {
      setError(filename ? 'Blog post not found.' : 'Filename missing.');
      setIsLoading(false);
      return;
    }

    const urlToFetch = currentBlogMetadata.filepath;
    if (!urlToFetch) {
      setError('File path is missing in blog metadata.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setMarkdown('');

    fetch(urlToFetch)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch blog: ${response.status} ${response.statusText}`
          );
        }
        return response.text();
      })
      .then((mdText) => {
        setMarkdown(removeMetadata(mdText));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blog content:', err);
        setError(err.message || 'Could not load blog content.');
        setIsLoading(false);
      });
  }, [filename, currentBlogMetadata]);

  if (isLoading) {
    return <h1>Loading blog content...</h1>;
  }

  if (error) {
    return <h1 className="text-red-500">Error: {error}</h1>;
  }

  if (!currentBlogMetadata) {
    return <h1>Blog post not found or filename is invalid.</h1>;
  }

  const { title, authors, contributors, banner } = currentBlogMetadata;

  return (
    <div id="blog-page" className="container mx-auto px-4">
      {banner && (
        <div className="banner-wrapper">
          <img className="banner-img mx-auto" src={banner} alt="blog banner" />
        </div>
      )}
      <div className={`blog-header ${banner && 'with-separator'}`}>
        <h1>{title}</h1>
        {authors.length > 1 ? (
          <p className="fst-italic mb-0">Authors: {authors.join(', ')}</p>
        ) : (
          <p className="fst-italic mb-0">Author: {authors[0]}</p>
        )}
        {contributors.length > 0 &&
          (contributors.length > 1 ? (
            <p className="fst-italic mb-0">
              Contributors: {contributors.join(', ')}
            </p>
          ) : (
            <p className="fst-italic mb-0">Contributor: {contributors[0]}</p>
          ))}
        <p className="mt-2">𓆝 𓆟 𓆞 𓆝 𓆟 𓆝 𓆟 𓆞 𓆝 𓆟</p>
      </div>
      <div className="blog-content">
        <ReactMarkdown
          children={markdown}
          // @ts-expect-error TODO: Resolve type conflict with rehype-raw and react-markdown
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
    </div>
  );
};
