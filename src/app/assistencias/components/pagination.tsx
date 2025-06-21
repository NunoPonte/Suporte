import ArrowIcon from "./svgs/arrow-icon";
import DoubleArrowIcon from "./svgs/double-arrow-icon";
import styles from "./pagination.module.css";
import { useEffect } from "react";

interface PaginationProps {
  pagination: number;
  setPagination: (value: number) => void;
  length: number;
  selectedStatus2: { value?: string };
}

export default function Pagination({
  pagination,
  setPagination,
  length,
  selectedStatus2,
}: PaginationProps) {
  const pageSize = parseInt(selectedStatus2?.value ?? "25", 10);
  const totalPages = Math.max(1, Math.ceil(length / pageSize));

  useEffect(() => {
    if (pagination > totalPages) {
      setPagination(1);
    }
  }, [totalPages, pagination, setPagination]);

  if (totalPages === 1) {
    return (
      <div className={styles.paginationButtons}>
        <button className={styles.selected}>1</button>
      </div>
    );
  }

  const visiblePages = [];
  let startPage = Math.max(1, pagination - 1);
  const endPage = Math.min(totalPages, startPage + 3);
  if (endPage - startPage < 3) {
    startPage = Math.max(1, endPage - 3);
  }
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return (
    <div className={styles.paginationButtons}>
      <button
        disabled={pagination === 1}
        onClick={() => {
          setPagination(1);
        }}
      >
        <DoubleArrowIcon
          className={pagination === 1 ? styles.inactive : styles.active}
        />
      </button>
      <button
        disabled={pagination === 1}
        onClick={() => {
          setPagination(pagination - 1);
        }}
      >
        <ArrowIcon
          className={pagination === 1 ? styles.inactive : styles.active}
        />
      </button>
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => setPagination(page)}
          className={pagination === page ? styles.selected : styles.notSelected}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => {
          setPagination(pagination + 1);
        }}
        disabled={pagination >= totalPages}
      >
        <ArrowIcon
          className={pagination >= totalPages ? styles.inactive : styles.active}
          right={true}
        />
      </button>
      <button
        disabled={pagination >= totalPages}
        onClick={() => {
          setPagination(totalPages);
        }}
      >
        <DoubleArrowIcon
          className={pagination >= totalPages ? styles.inactive : styles.active}
          right={true}
        />
      </button>
    </div>
  );
}
