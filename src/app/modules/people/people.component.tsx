import { Person } from "./model";
import { usePeopleQuery } from "./query";

import "./people.css";
import { useEffect } from "react";

export function People() {
  const { data: people, loading, error } = usePeopleQuery();

  useEffect(() => {
    console.log(people)
  }, [])

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

  const visiblePeople = people?.slice(0, 10);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
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
