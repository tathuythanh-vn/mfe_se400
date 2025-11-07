import React, { useEffect, useState } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const [hoverBack, setHoverBack] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

  // Giới hạn currentPage trong khoảng [1, totalPages]
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, setCurrentPage]);

  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const first = 1;
      const last = totalPages;

      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', last);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          first,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          last,
        );
      } else {
        pages.push(
          first,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          last,
        );
      }
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center gap-5">
      {/* Nút Quay lại */}
      <div
        className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onMouseEnter={() => setHoverBack(true)}
        onMouseLeave={() => setHoverBack(false)}
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
      >
        <ChevronsLeft size={40} color={hoverBack ? '#90caf9' : '#0d47a1'} />
      </div>

      {/* Danh sách số trang */}
      <div className="flex flex-row gap-[30px]">
        {generatePageNumbers().map((page, index) => (
          <div
            key={index}
            className={`w-5 aspect-square border border-solid p-2.5 flex justify-center items-center rounded-full bg-[#0d47a1] text-white ${
              page === currentPage
                ? 'bg-[#90caf9] font-bold cursor-default'
                : page === '...'
                  ? 'cursor-default'
                  : 'cursor-pointer hover:bg-[#90caf9]'
            }`}
            onClick={() => handlePageClick(page)}
          >
            <p>{page}</p>
          </div>
        ))}
      </div>

      {/* Nút Tiếp theo */}
      <div
        className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        onMouseEnter={() => setHoverNext(true)}
        onMouseLeave={() => setHoverNext(false)}
        onClick={() =>
          currentPage < totalPages && setCurrentPage(currentPage + 1)
        }
      >
        <ChevronsRight size={40} color={hoverNext ? '#90caf9' : '#0d47a1'} />
      </div>
    </div>
  );
};

export default Pagination;
