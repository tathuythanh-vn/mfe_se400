import React, { useEffect, useState } from "react";
import { TbSquareRoundedChevronsLeftFilled, TbSquareRoundedChevronsRightFilled } from "react-icons/tb";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  const [hoverBack, setHoverBack] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages, setCurrentPage]);

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const first = 1;
      const last = totalPages;

      if (currentPage <= 4) pages.push(1, 2, 3, 4, 5, "...", last);
      else if (currentPage >= totalPages - 3) pages.push(first, "...", last - 4, last - 3, last - 2, last - 1, last);
      else pages.push(first, "...", currentPage - 1, currentPage, currentPage + 1, "...", last);
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) setCurrentPage(page);
  };

  return (
    <div className="flex justify-center items-center gap-5">
      <div
        className={`p-1 rounded-xl cursor-pointer ${currentPage === 1 ? "opacity-40 pointer-events-none" : ""}`}
        onMouseEnter={() => setHoverBack(true)}
        onMouseLeave={() => setHoverBack(false)}
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
      >
        <TbSquareRoundedChevronsLeftFilled size={40} color={hoverBack ? "#90caf9" : "#0d47a1"} />
      </div>

      <div className="flex flex-row gap-6">
        {generatePageNumbers().map((page, index) => (
          <div
            key={index}
            className={`w-10 h-10 flex justify-center items-center rounded-full border text-white
              ${page === currentPage ? "bg-blue-300 font-bold cursor-default" : "bg-blue-900 hover:bg-blue-300 cursor-pointer"}
              ${page === "..." ? "bg-gray-400 cursor-default" : ""}`}
            onClick={() => handlePageClick(page)}
          >
            <p>{page}</p>
          </div>
        ))}
      </div>

      <div
        className={`p-1 rounded-xl cursor-pointer ${currentPage === totalPages ? "opacity-40 pointer-events-none" : ""}`}
        onMouseEnter={() => setHoverNext(true)}
        onMouseLeave={() => setHoverNext(false)}
        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
      >
        <TbSquareRoundedChevronsRightFilled size={40} color={hoverNext ? "#90caf9" : "#0d47a1"} />
      </div>
    </div>
  );
}