import { Person } from "./model";
import { usePeopleQuery } from "./query";

import "./people.css";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10
const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE_OPTIONS = [10,15, 20, 25, 50, 100];

export function People() {
  const { data: people, loading, error } = usePeopleQuery();
  const [sortData, setSortData] = useState<Person[] | undefined>([])
  const [sortOrder, setSortOrder] = useState<"ascending" | "descending" | undefined>("ascending");
  const [searchData, setSearchData] = useState("")
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    if (people) {
      sortByName("ascending");
    }
  }, [people]);
  
  const sortByName = (order?: "ascending" | "descending") => {
    const sortedData = people?.slice().sort((a, b) => {
      if (order === "ascending") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setSortData(sortedData);
    setSortOrder(order);
  };

  const resetToDefault = () => {
    setSortData(people)
    setItemsPerPage(10)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchData(searchTerm);

    const filteredData = people?.slice().filter((person) =>
      person.name.toLowerCase().includes(searchTerm)
    );

    sortByName(sortOrder);
    setSortData(filteredData);
  };

  const calculateFirstIndex = () => (currentPage - 1) * itemsPerPage;
  const calculateLastIndex = () => calculateFirstIndex() + itemsPerPage;
  const totalPages = Math.ceil((people?.length || 0)/ ITEMS_PER_PAGE);
  const slicedPeople = sortData?.slice(calculateFirstIndex(), calculateLastIndex());

  const goToFirstPage = () => {
    setCurrentPage(DEFAULT_PAGE);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, DEFAULT_PAGE));
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(DEFAULT_PAGE);
}
  const renderCells = ({ name, show, actor, movies, dob }: Person) => (
    <>
      <td>{name}</td>
      <td>{show}</td>
      <td>{actor}</td>
      <td>{dob}</td>
      <td
        dangerouslySetInnerHTML={{
          __html: movies.map(({ title }) => title).join(", "),
        }}
      ></td>
    </>
  );

  if (loading) {
    return <p>Fetching People...</p>;
  }

  if (people === undefined || error) {
    return <h2>Oops! looks like something went wrong!</h2>;
  }

  return (
  <>
    <div>
      <div>
        Filters
        </div>
        <div className="sort-btn-container">
          <button className="sort-btn" onClick={() => sortOrder === 'ascending' ? sortByName('descending') : sortByName('ascending')} aria-sort={sortOrder}>
            {sortOrder === "ascending" ? "z to a" : "a to z"}
          </button>
          <button className="sort-btn" onClick={() => resetToDefault()}>Reset to Default</button>

          <button aria-labelledby="First" onClick={() => goToFirstPage()} disabled={currentPage === DEFAULT_PAGE}>First</button>
          <button aria-labelledby="Last" onClick={() => goToLastPage()} disabled={currentPage === totalPages}>Last</button>
          <button aria-labelledby="Previous" onClick={() => goToPreviousPage()} disabled={currentPage === DEFAULT_PAGE}>Previous</button>
          <button aria-labelledby="Next" onClick={() => goToNextPage()} disabled={currentPage === totalPages}>Next</button>

          <label htmlFor="Search">
            <input type="text" aria-labelledby="Search" id="Search" placeholder={"enter name"} value={searchData} onChange={e => handleSearch(e)}/>
          </label>

          <label htmlFor="ItemsPerPage">
            Items per page:
            <select id="ItemsPerPage" value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {people && <div>{`Showing ${calculateFirstIndex() + 1} - ${calculateLastIndex()} of ${people.length}`}</div>}
        </div>
    </div>

    <table>
      <thead>
        <tr>
          <th onClick={() => sortOrder === 'ascending' ? sortByName('descending') : sortByName('ascending')} aria-sort={sortOrder}>Name</th>
          <th>Show</th>
          <th>Actor/Actress</th>
          <th>Date of birth</th>
          <th>Movies</th>
        </tr>
      </thead>

      <tbody>
        {slicedPeople && slicedPeople.length > 0 ? slicedPeople.map((people, index) => (
          <tr key={index}>{renderCells(people)}</tr>
        ))
          :
          <tr>
            <td colSpan={5}>No People Available.</td>
          </tr>
        }
      </tbody>
    </table>
    </>
  );
}
