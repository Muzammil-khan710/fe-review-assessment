import { Person } from "./model";
import { usePeopleQuery } from "./query";

import "./people.css";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10
const CURRENT_PAGE = 1

export function People() {
  const { data: people, loading, error } = usePeopleQuery();
  const firstIndexValue = (CURRENT_PAGE - 1) * ITEMS_PER_PAGE;
  const lastIndexValue = firstIndexValue + ITEMS_PER_PAGE;
  const [sortData, setSortData] = useState<Person[] | undefined>([])
  const [sortOrder, setSortOrder] = useState<"ascending" | "descending" | undefined>("ascending");
  const [searchData, setSearchData] = useState("")

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
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchData(searchTerm);

    const filteredData = people?.filter((person) =>
      person.name.toLowerCase().includes(searchTerm)
    );

    sortByName(sortOrder);
    setSortData(filteredData);
  };

  const slicedPeople = sortData?.slice(firstIndexValue, lastIndexValue);

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
            {sortOrder === "ascending" ? "a to z" : "z to a"}
          </button>
          <button className="sort-btn" onClick={() => resetToDefault()}>Reset to Default</button>
          <label htmlFor="Search">
            <input type="text" aria-labelledby="Search" id="Search" placeholder={"enter name"} value={searchData} onChange={e => handleSearch(e)}/>
          </label>
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
