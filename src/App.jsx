import React, { useEffect, useState } from 'react';
import { Either, Maybe } from 'monet';

const fetchUsers = () => {
  return Either.fromPromise(fetch('https://jsonplaceholder.typicode.com/users'));
}

const App = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then(eitherResult => eitherResult
        .cata(
          error => setError(`Failed to fetch users: ${error}`),
          response => response.json()
            .then(data => setUsers(data))
            .catch(err => setError(`Error parsing data: ${err}`))
        )
      )
      .catch(error => setError(`Error processing request: ${error}`));
  }, []);

  const safelyGetProp = (user, prop) => {
    return Maybe.fromNull(user[prop]).orSome('No data available');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Address Book</h1>
        {error && <p>Error: {error}</p>}
        <ul>
          {users.map(user => (
            <li key={user.id}>
              Name: {safelyGetProp(user, 'name')}, 
              Email: {safelyGetProp(user, 'email')}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
};

export default App;
