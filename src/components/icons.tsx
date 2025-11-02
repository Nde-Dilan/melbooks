
import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  instagram: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  books: (props: SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M20 22h-2a2 2 0 0 0-2-2V7.5L10.5 2H8"/>
    </svg>
  ),
  whatsapp: (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M21.44 12.11a9.9 9.9 0 0 0-18.88 0c0 2.97 1.3 5.67 3.31 7.47l-1.37 4.92 5.04-1.34a9.86 9.86 0 0 0 11.9-11.05z" />
        <path d="M17.5 14.3c-.3-.2-1.7-1.1-2-1.2-.3-.1-.5-.1-.7.2-.2.3-.8.9-.9 1.1-.1.2-.2.2-.4.1-.7-.2-2.1-1.1-3-2.1-.6-.7-.9-1.5-.9-1.5s-.1-.2.1-.3c.1 0 .2-.1.3-.2.1-.1.2-.2.3-.3.1-.1.1-.2 0-.3-.1-.1-.7-1.7-.9-2.2-.2-.5-.4-.4-.5-.4h-.4c-.1 0-.3.1-.4.2-.1.1-.5.5-.5 1.2s.5 1.4.6 1.5c.1.1 1 1.6 2.4 2.2.3.1.5.2.7.3.5.1.8.1.9-.1.2-.2.5-.6.6-.7.1-.1.1-.3 0-.4z" />
    </svg>
  ),
    spinner: (props: SVGProps<SVGSVGElement>) => (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    ),
};
