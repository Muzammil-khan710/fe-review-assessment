import { Person } from "./model";
import { usePeopleQuery } from "./query";

import "./people.css";

export function People() {
  const { data: people, loading, error } = usePeopleQuery();

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
        {people.length > 0 ? people.map((people, index) => (
          <tr key={index}>{renderCells(people)}</tr>
        ))
          :
          <tr>
            <td colSpan={5}>No People Available.</td>
          </tr>
        }
      </tbody>
    </table>
  );
}
