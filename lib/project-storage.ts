import type { ProjectListItem } from './project-types';

export const PROJECTS_STORAGE_KEY = 'rv-projects';

export function loadProjectsFromStorage(): ProjectListItem[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as ProjectListItem[];
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveProjectsToStorage(projects: ProjectListItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // ignore
  }
}

