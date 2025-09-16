import React, { useState } from 'react';
import { Pagination, Table } from "flowbite-react";
import { useTranslation } from 'react-i18next'; // Assuming i18next for localization

export default function StationsTable({ selectedOption , type}) {
  const { t } = useTranslation(); // Hook to access translations


  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(selectedOption?.length / rowsPerPage);
  const pageData = selectedOption?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  function timeNow(utcTime) {
    const localDate = new Date(utcTime);
    return localDate.toString() === "Invalid Date"
      ? ""
      : localDate.toLocaleString();}


  return (
    <div className="data-table overflow-x-auto">
      <Table hoverable striped>
        <Table.Head>
          <Table.HeadCell
            // onClick={toggleSort}
            className="cursor-pointer"
          >
            {t("stationsTable.headers.time")}
          </Table.HeadCell>
          <Table.HeadCell>
            {type}
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {pageData.map((obs, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>
                {timeNow(obs.obsTimestamp)}
              </Table.Cell>
              <Table.Cell>{obs.result}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="w-full flex flex-wrap justify-center gap-1 mt-4 overflow-hidden">
        <Pagination
          layout="pagination"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          previousLabel=""
          nextLabel=""
          showIcons
        />
      </div>
    </div>
  );
}