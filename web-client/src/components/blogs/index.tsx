import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import { removeMetadata } from 'utils/file';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import rehypeRaw from 'rehype-raw';
import 'styles/scss/blogs.scss';
import { BlogFileMapping } from 'types';

interface BlogContainerProps {
  metadata: BlogFileMapping;
}
export const BlogContainer: React.FC<BlogContainerProps> = ({ metadata }) => {
  const { filename } = useParams();
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    if (metadata == null || filename == null) {
      return;
    }
    const filepath = metadata[filename].path;
    fetch(filepath)
      .then((response) => response.text())
      .then((mdText) => {
        setMarkdown(removeMetadata(mdText));
      });
  }, [metadata, filename]);

  if (metadata == null || filename == null) {
    return <h1>Loading...</h1>;
  }

  const { title, authors, contributors, banner } = metadata[filename];

  return (
    <Container id="blog-page">
      {banner && (
        <div className="banner-wrapper">
          <img className="banner-img" src={banner} alt="blog banner" />
        </div>
      )}
      <div className={`blog-header ${banner && 'with-separator'}`}>
        <h1>{title}</h1>
        {authors.length > 1 ? (
          <p className="fst-italic mb-0">Authors: {authors.join(', ')}</p>
        ) : (
          <p className="fst-italic mb-0">Author: {authors[0]}</p>
        )}
        {contributors != null && contributors.length > 0 && (
          <p className="fst-italic">Contributors: {contributors}</p>
        )}
        <p className="mt-2">𓆝 𓆟 𓆞 𓆝 𓆟 𓆝 𓆟 𓆞 𓆝 𓆟</p>
      </div>
      <div className="blog-content">
        <ReactMarkdown
          children={markdown}
          //@ts-ignore
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  // style={dark}
                  language={match[1]}
                  // PreTag='section'
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
    </Container>
  );
};
