/**
 * Utility functions for project status handling
 */

export type ProjectStatus = 'completed' | 'in-progress' | 'planned'

export interface StatusConfig {
  label: string
  className: string
  ariaLabel: string
}

export const projectStatusConfig: Record<ProjectStatus, StatusConfig> = {
  completed: {
    label: 'Completed',
    className: 'bg-green-600 text-black',
    ariaLabel: 'Project status: Completed'
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-yellow-600 text-black',
    ariaLabel: 'Project status: In Progress'
  },
  planned: {
    label: 'Planned',
    className: 'bg-blue-600 text-black',
    ariaLabel: 'Project status: Planned'
  }
}

export function getStatusConfig(status: ProjectStatus): StatusConfig {
  return projectStatusConfig[status]
}

export function formatProjectYear(year: number): string {
  return year.toString()
}

export function generateProjectSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
