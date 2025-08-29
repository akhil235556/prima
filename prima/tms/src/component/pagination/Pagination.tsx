import React from 'react';
import "./Pagination.css";
import Pagination from '@material-ui/lab/Pagination';

interface PaginationNavProps {
  count: number,
  size: number,
  page: number,
  onPageChange?: any,
}

function PaginationNav(props: PaginationNavProps) {
  const { count, size, page, onPageChange } = props;
  return (
    <div className="pagination">
      <Pagination
        page={page}
        count={setCount()}
        variant="outlined"
        color="primary"
        onChange={onPageChange}
      />
    </div>
  );

  function setCount() {
    switch (true) {
      case count < size:
        return 1;
      case count > size:
        let pageCount = (count / size);
        if ((size * pageCount) <= count) {
          return pageCount
        } else {
          return pageCount + 1;
        }
      default:
        return 0;
    }

  }
}

export default PaginationNav;
