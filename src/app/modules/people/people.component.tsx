import { Person } from "./model";
import { usePeopleQuery } from "./query";

import "./people.css";

const ITEMS_PER_PAGE = 10
const CURRENT_PAGE = 1

export function People() {
  const { data: people, loading, error } = usePeopleQuery();

  const firstIndexValue = (CURRENT_PAGE - 1) * ITEMS_PER_PAGE;
  const lastIndexValue = firstIndexValue + ITEMS_PER_PAGE;
  const slicedPeople = people?.slice(firstIndexValue, lastIndexValue);

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
  );
}
