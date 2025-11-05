import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    // Logic to show a limited number of page numbers
    const maxPagesToShow = 5;
    let startPage: number, endPage: number;
    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrent) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPagesBeforeCurrent;
            endPage = currentPage + maxPagesAfterCurrent;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    return (
        <nav aria-label="Paginación de la tabla">
            <ul className="inline-flex items-center -space-x-px">
                <li>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 ml-0 leading-tight text-gray-400 bg-gray-800 border border-gray-700 rounded-l-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Página anterior"
                    >
                        <ChevronLeftIcon />
                    </button>
                </li>
                {startPage > 1 && (
                     <li>
                        <button onClick={() => onPageChange(1)} className="px-3 py-2 leading-tight text-gray-400 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white">1</button>
                    </li>
                )}
                {startPage > 2 && (
                    <li>
                        <span className="px-3 py-2 leading-tight text-gray-400 bg-gray-800 border border-gray-700">...</span>
                    </li>
                )}

                {pageNumbers.map(number => (
                    <li key={number}>
                        <button
                            onClick={() => onPageChange(number)}
                            className={`px-3 py-2 leading-tight border ${
                                number === currentPage
                                    ? 'z-10 text-cyan-400 bg-cyan-900/50 border-cyan-700'
                                    : 'text-gray-400 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white'
                            }`}
                            aria-current={number === currentPage ? 'page' : undefined}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                
                {endPage < totalPages -1 && (
                    <li>
                         <span className="px-3 py-2 leading-tight text-gray-400 bg-gray-800 border border-gray-700">...</span>
                    </li>
                )}
                {endPage < totalPages && (
                     <li>
                        <button onClick={() => onPageChange(totalPages)} className="px-3 py-2 leading-tight text-gray-400 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white">{totalPages}</button>
                    </li>
                )}

                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 leading-tight text-gray-400 bg-gray-800 border border-gray-700 rounded-r-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Siguiente página"
                    >
                        <ChevronRightIcon />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
