'use client';

import { useEffect, useState } from 'react';

interface AnimatedIconProps {
  className?: string;
  animate?: boolean;
}

export function AnimatedBriefcase({
  className = 'w-6 h-6',
  animate = true,
}: AnimatedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={animate ? 'animate-briefcase' : ''}>
        <path
          d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="briefcase-handle"
        />
        <rect
          x="2"
          y="7"
          width="20"
          height="13"
          rx="2"
          ry="2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
          fillOpacity="0.1"
          className="briefcase-body"
        />
        <path
          d="M6 11h12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="briefcase-line"
        />
      </g>
    </svg>
  );
}

export function AnimatedTarget({
  className = 'w-6 h-6',
  animate = true,
}: AnimatedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={animate ? 'animate-target' : ''}>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="target-outer"
        />
        <circle
          cx="12"
          cy="12"
          r="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="target-middle"
        />
        <circle
          cx="12"
          cy="12"
          r="2"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          className="target-center"
        />
      </g>
    </svg>
  );
}

export function AnimatedCalendar({
  className = 'w-6 h-6',
  animate = true,
}: AnimatedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={animate ? 'animate-calendar' : ''}>
        <rect
          x="3"
          y="4"
          width="18"
          height="18"
          rx="2"
          ry="2"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.1"
          className="calendar-body"
        />
        <line
          x1="16"
          y1="2"
          x2="16"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="calendar-hook-1"
        />
        <line
          x1="8"
          y1="2"
          x2="8"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="calendar-hook-2"
        />
        <line
          x1="3"
          y1="10"
          x2="21"
          y2="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="calendar-line"
        />
        <circle
          cx="8"
          cy="14"
          r="1"
          fill="currentColor"
          className="calendar-dot-1"
        />
        <circle
          cx="12"
          cy="14"
          r="1"
          fill="currentColor"
          className="calendar-dot-2"
        />
        <circle
          cx="16"
          cy="14"
          r="1"
          fill="currentColor"
          className="calendar-dot-3"
        />
      </g>
    </svg>
  );
}

export function AnimatedTrendingUp({
  className = 'w-6 h-6',
  animate = true,
}: AnimatedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={animate ? 'animate-trending' : ''}>
        <polyline
          points="2,17 8.5,10.5 13.5,15.5 22,7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="trending-line"
        />
        <polyline
          points="16,7 22,7 22,13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="trending-arrow"
        />
      </g>
    </svg>
  );
}

export function AnimatedUsers({
  className = 'w-6 h-6',
  animate = true,
}: AnimatedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={animate ? 'animate-users' : ''}>
        <path
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="users-body-1"
        />
        <circle
          cx="9"
          cy="7"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.1"
          className="users-head-1"
        />
        <path
          d="M22 21v-2a4 4 0 0 0-3-3.87"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="users-body-2"
        />
        <path
          d="M16 3.13a4 4 0 0 1 0 7.75"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="users-head-2"
        />
      </g>
    </svg>
  );
}

export function AnimatedBarChart({
  className = 'w-6 h-6',
  animate = true,
}: AnimatedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={animate ? 'animate-chart' : ''}>
        <line
          x1="12"
          y1="20"
          x2="12"
          y2="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="chart-bar-1"
        />
        <line
          x1="18"
          y1="20"
          x2="18"
          y2="4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="chart-bar-2"
        />
        <line
          x1="6"
          y1="20"
          x2="6"
          y2="16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="chart-bar-3"
        />
      </g>
    </svg>
  );
}

export function AnimatedClock({
  className = 'w-6 h-6',
  animate = true,
}: AnimatedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={animate ? 'animate-clock' : ''}>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.1"
          className="clock-face"
        />
        <polyline
          points="12,6 12,12 16,14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="clock-hands"
        />
      </g>
    </svg>
  );
}

export function AnimatedCheckCircle({
  className = 'w-6 h-6',
  animate = true,
}: AnimatedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={animate ? 'animate-check' : ''}>
        <path
          d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="check-circle"
        />
        <polyline
          points="22,4 12,14.01 9,11.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="check-mark"
        />
      </g>
    </svg>
  );
}

export function AnimatedArrowRight({
  className = 'w-6 h-6',
  animate = true,
}: AnimatedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={animate ? 'animate-arrow' : ''}>
        <line
          x1="5"
          y1="12"
          x2="19"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="arrow-line"
        />
        <polyline
          points="12,5 19,12 12,19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="arrow-head"
        />
      </g>
    </svg>
  );
}

export function AnimatedSparkles({
  className = 'w-6 h-6',
  animate = true,
}: AnimatedIconProps) {
  const [sparkleStates, setSparkleStates] = useState([false, false, false]);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setSparkleStates(() => [
        Math.random() > 0.7,
        Math.random() > 0.8,
        Math.random() > 0.6,
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, [animate]);

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={animate ? 'animate-sparkles' : ''}>
        <path
          d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill={sparkleStates[0] ? 'currentColor' : 'none'}
          fillOpacity={sparkleStates[0] ? '0.3' : '0'}
          className="sparkle-main transition-all duration-300"
        />
        <path
          d="M20 3v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={sparkleStates[1] ? 1 : 0.3}
          className="sparkle-small-1 transition-opacity duration-300"
        />
        <path
          d="M22 5h-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={sparkleStates[1] ? 1 : 0.3}
          className="sparkle-small-1 transition-opacity duration-300"
        />
        <path
          d="M4 17v2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={sparkleStates[2] ? 1 : 0.3}
          className="sparkle-small-2 transition-opacity duration-300"
        />
        <path
          d="M5 18H3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={sparkleStates[2] ? 1 : 0.3}
          className="sparkle-small-2 transition-opacity duration-300"
        />
      </g>
    </svg>
  );
}
