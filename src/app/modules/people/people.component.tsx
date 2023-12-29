import { Person } from "./model";
import { usePeopleQuery } from "./query";

import "./people.css";
import { useEffect, useState } from "react";

export function People() {
  const { data: people, loading, error } = usePeopleQuery();
  const [sortOrder, setSortOrder] = useState('ascending')
  const [peopleState, setPeopleState] = useState(people || [])

  useEffect(() => {
    if (people) {
      setPeopleState(people)
    }
  }, [people])

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

  const sortPeople = (currentSortOrder: 'ascending' | 'descending') => {
    const sortedPeople = [...peopleState].sort((a, b) => {
      if (currentSortOrder === 'ascending') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setPeopleState(sortedPeople);
  };

  const toggleSort = () => {
    const newSortOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
    setSortOrder(newSortOrder);
    sortPeople(newSortOrder);
  };
  const visiblePeople = peopleState?.slice(0, 10);

  return (
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
  );
}
