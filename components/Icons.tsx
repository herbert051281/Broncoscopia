import React from 'react';

export const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

export const PencilIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a.5.5 0 00-.124.212l-2 6a.5.5 0 00.65.65l6-2a.5.5 0 00.212-.124L19.513 8.2z" />
    </svg>
);

export const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 01-.75.75H5.625a.75.75 0 01-.75-.75L3.87 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452z" clipRule="evenodd" />
    </svg>
);

export const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export const ChartBarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.035-.84-1.875-1.875-1.875h-.75zM9.75 8.625c-1.035 0-1.875.84-1.875 1.875v9.375c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V10.5c0-1.035-.84-1.875-1.875-1.875h-.75zM3 13.125c-1.035 0-1.875.84-1.875 1.875v4.875c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V15c0-1.035-.84-1.875-1.875-1.875h-.75z" />
    </svg>
);

export const TableIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M4.5 3A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3h-15zm4.5 3.75a.75.75 0 00-1.5 0v10.5a.75.75 0 001.5 0V6.75zm3.75 0a.75.75 0 00-1.5 0v10.5a.75.75 0 001.5 0V6.75zm3.75 0a.75.75 0 00-1.5 0v10.5a.75.75 0 001.5 0V6.75z" clipRule="evenodd" />
    </svg>
);

export const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

export const StethoscopeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 4.5a3 3 0 00-3 3v.75c0 1.284.84 2.396 2.006 2.646a.75.75 0 00.994-.716V8.25a1.5 1.5 0 011.5-1.5h1.5a.75.75 0 000-1.5H7.5a3 3 0 00-3-3z" />
        <path fillRule="evenodd" d="M8.25 3a.75.75 0 000 1.5h8.25a.75.75 0 01.75.75v12.75a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h.75V6a.75.75 0 00-.75-.75h-5.25a.75.75 0 00-.75.75v5.25a.75.75 0 01-1.5 0V6a2.25 2.25 0 012.25-2.25h5.25a2.25 2.25 0 00-2.25-2.25H8.25zM15 15.75a.75.75 0 00-1.5 0v.75a4.5 4.5 0 004.5 4.5h.75a.75.75 0 000-1.5h-.75a3 3 0 01-3-3v-.75z" clipRule="evenodd" />
    </svg>
);

export const LabIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.938 3.375a.75.75 0 01.025 1.498l-4.15 1.25a.75.75 0 01-.975-.975l1.25-4.15a.75.75 0 011.498.025L10.5 3l1.438.375z" />
        <path fillRule="evenodd" d="M10.5 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm.75 4.5a.75.75 0 000-1.5h-.75a4.5 4.5 0 00-4.5 4.5v.75a.75.75 0 001.5 0v-.75a3 3 0 013-3h.75z" clipRule="evenodd" />
        <path d="M13.5 10.5a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5h-3.75a.75.75 0 01-.75-.75zM14.25 12a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zM13.5 15a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5h-3.75a.75.75 0 01-.75-.75zM14.25 16.5a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
    </svg>
);

export const ClipboardIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.5 3A2.5 2.5 0 008 5.5v2.879a2.5 2.5 0 00.721 1.768l3.25 3.25a2.5 2.5 0 003.536 0l3.25-3.25A2.5 2.5 0 0019.5 8.38V5.5A2.5 2.5 0 0017 3h-6.5zM9.5 5.5a1 1 0 011-1h6.5a1 1 0 011 1v2.879a1 1 0 01-.289.707l-3.25 3.25a1 1 0 01-1.414 0l-3.25-3.25A1 1 0 019.5 8.38V5.5z" clipRule="evenodd" />
        <path d="M4.125 7.125A3.375 3.375 0 00.75 10.5v8.25c0 1.864 1.511 3.375 3.375 3.375h12.75c1.864 0 3.375-1.511 3.375-3.375v-8.25a3.375 3.375 0 00-3.375-3.375H4.125zM10.5 14.25a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm3 0a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75z" />
    </svg>
);

export const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

export const ArrowUpIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L10 9.414l2.293 2.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
    </svg>
);
  
export const ArrowDownIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-6.707a1 1 0 001.414 1.414l3-3a1 1 0 00-1.414-1.414L10 10.586 7.707 8.293a1 1 0 00-1.414 1.414l3 3z" clipRule="evenodd" />
    </svg>
);

export const ExportIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

export const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.75-4.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zm.75 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
);

export const PrintIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 6a1.5 1.5 0 00-1.5 1.5v3.75A1.5 1.5 0 007.5 12h9a1.5 1.5 0 001.5-1.5V7.5A1.5 1.5 0 0016.5 6h-9zM6 7.5a3 3 0 013-3h6a3 3 0 013 3v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V7.5z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M5.25 13.5a.75.75 0 00-.75.75v3a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75v-3a.75.75 0 00-1.5 0v1.5H6.75v-1.5a.75.75 0 00-.75-.75zM6.75 19.5a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H6.75z" clipRule="evenodd" />
    </svg>
);

export const ChevronLeftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

export const ChevronRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4-4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);