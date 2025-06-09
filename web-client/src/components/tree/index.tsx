import React, { useEffect } from 'react';

import { TreeCard } from '@/components/tree/tree-card';
import { BlogFileMapping, BlogMetadata } from '@/types';

interface TreeContainerProps {
  metadata: BlogFileMapping | null;
}

export const TreeContainer: React.FC<TreeContainerProps> = ({ metadata }) => {
  useEffect(() => {
    const run = () => {
      const items = document.querySelectorAll('#tree-container li');
      items.forEach((item) => {
        if (item instanceof HTMLElement && isInView(item)) {
          item.classList.add('show');
        }
      });
    };

    const attachEventListeners = () => {
      window.addEventListener('scroll', run);
      window.addEventListener('load', run);
      window.addEventListener('resize', run);
      run();
    };

    const removeEventListeners = () => {
      window.removeEventListener('scroll', run);
      window.removeEventListener('load', run);
      window.removeEventListener('resize', run);
    };

    if (metadata) {
      attachEventListeners();
    }
    return removeEventListeners;
  }, [metadata]);

  const isInView = (item: Element): boolean => {
    const rect = item.getBoundingClientRect();
    return (
      rect.top + 100 >= 0 &&
      rect.left + 30 >= 0 &&
      rect.bottom - 100 <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right - 30 <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  if (!metadata) {
    return null;
  }

  const blogs: BlogMetadata[] = Object.values(metadata);

  return (
    <div id="tree-container">
      <ul>
        {blogs.map((blog) => {
          if (!blog || !blog.name) {
            return null;
          }
          return (
            <li key={blog.name}>
              <TreeCard blog={blog} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
