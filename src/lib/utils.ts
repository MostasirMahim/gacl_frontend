import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(path: string | null | undefined): string {
  if (!path || path === "null" || path === "undefined" || path.trim() === "") {
    return "/placeholder.jpg";
  }
  
  // Handle nested/encoded full URLs from seed data
  const decoded = decodeURIComponent(path);
  const match = decoded.match(/(https?):\/+(.*)/);
  if (match) {
    return `${match[1]}://${match[2]}`;
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";
  const cleanBackendUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBackendUrl}${cleanPath}`;
}
