import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Visualizations - Interactive Analytics & Charts',
  description:
    'Explore stunning interactive data visualizations with animated charts, real-time dashboards, project timelines, and comprehensive analytics tools.',
  keywords: 'data visualization, analytics, charts, dashboard, timeline, infographics',
};

export default function DataVisualizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}