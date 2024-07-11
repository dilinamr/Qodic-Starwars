import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      {pages.map((page) => (
        <div
          key={page}
          className={`page-item ${currentPage === page ? "active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          <span className="page-link">{page}</span>
        </div>
      ))}
    </div>
  );
};

export default Pagination;
