import React, { useEffect } from 'react';
import { TreeCard } from 'components/tree/tree-card';
import { allBlogsFilepaths } from 'blogs/metadata';
import { getFileName } from 'utils/file';
import 'styles/scss/tree.scss';
import { BlogFileMapping } from 'types';

interface TreeContainerProps {
  metadata: BlogFileMapping | null;
}

export const TreeContainer: React.FC<TreeContainerProps> = ({ metadata }) => {
  const run = () => {
    const items = document.querySelectorAll('#tree-container li');
    items.forEach((item) => {
      if (isInView(item)) {
        item.classList.add('show');
      }
    });
  };

  const attachEventListeners = () => {
    window.addEventListener('scroll', run);
    window.addEventListener('load', run);
    window.addEventListener('resize', run);
  };

  const removeEventListeners = () => {
    window.removeEventListener('scroll', run);
    window.removeEventListener('load', run);
    window.removeEventListener('resize', run);
  };

  useEffect(() => {
    attachEventListeners();
    return removeEventListeners;
  }, []);

  const isInView = (item) => {
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

  return (
    metadata != null && (
      <div id="tree-container">
        <ul>
          {allBlogsFilepaths.map((path) => {
            const name = getFileName(path);
            return (
              <li key={name}>
                <TreeCard blog={metadata[name]} />
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
};
