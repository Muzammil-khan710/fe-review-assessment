import { Person } from "./model";
import { usePeopleQuery } from "./query";
import "./people.css";
import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 10;
const DEFAULT_PAGE = 1;
const COMBOBOX_OPTIONS = [10, 15, 20];

export function People() {
  const { data: people, loading, error } = usePeopleQuery();
  const [sortOrder, setSortOrder] = useState('ascending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const sortedPeople = useMemo(() => {
    if (!people) return [];

    return [...people].sort((a, b) => {
      return sortOrder === 'ascending' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
  }, [people, sortOrder]);

  const filteredPeople = useMemo(() => {
    if (!people || searchQuery === '') return sortedPeople;

    return sortedPeople.filter((person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedPeople, searchQuery]);
  
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

  const toggleSort = () => {
    const newSortOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
    setSortOrder(newSortOrder);
  };
  
  const handleFirstPage = () => {
    setCurrentPage(DEFAULT_PAGE);
  };

  const handleLastPage = () => {
    const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);
    setCurrentPage(totalPages);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(DEFAULT_PAGE);
  };
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visiblePeople = filteredPeople.slice(startIndex, endIndex);
 
  if (loading) {
    return <p>Fetching People...</p>;
  }

  if (people === undefined || error) {
    return <h2>Oops! looks like something went wrong!</h2>;
  }

  return (
    <>
      <div className="filters-container">
        <div>
          <label htmlFor="Search">Search:</label>
          <input
            aria-label="Search"
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="buttons-wrapper">
          <button
            onClick={() => handleFirstPage()}
            disabled={currentPage === DEFAULT_PAGE}
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === DEFAULT_PAGE}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={endIndex >= filteredPeople.length}
          >
            Next
          </button>
          <button
            onClick={() => handleLastPage()}
            disabled={endIndex >= filteredPeople.length}
          >
            Last
          </button>
        </div>
          {visiblePeople && <p className="result">Showing {startIndex + 1}-{endIndex} of {filteredPeople.length} </p> }
          <div>
          <label htmlFor="selectOptions">Items per page:</label>
          <select aria-label="selectOptions" id="selectOptions"
           onChange={handleItemsPerPageChange}
           value={itemsPerPage}
          >
          {COMBOBOX_OPTIONS.map((option) => (
              <option aria-label="option" key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          </div>
      </div>
    <table>
      <thead>
        <tr>
          <th onClick={() => toggleSort()} aria-sort={sortOrder === 'ascending' ? 'ascending' : 'descending'}>Name</th>
          <th>Show</th>
          <th>Actor/Actress</th>
          <th>Date of birth</th>
          <th>Movies</th>
        </tr>
      </thead>

      <tbody>
        {visiblePeople && visiblePeople.length > 0 ? (
          visiblePeople.map((person, index) => (
            <tr key={index}>{renderCells(person)}</tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>No People Available.</td>
          </tr>
        )}
      </tbody>
    </table>
    </>
  );
}
