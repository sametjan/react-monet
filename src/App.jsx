import React, { useEffect, useState } from 'react';
import { Either, Maybe } from 'monet';

const fetchUsers = () => {
  return Either.fromPromise(fetch('https://jsonplaceholder.typicode.com/users'));
}

const UserDetail = ({ user }) => {
  const safelyGetProp = (prop) => Maybe.fromNull(user[prop]).orSome('No data available');

  return (
    <div style={{ margin: "10px", padding: "10px", border: "1px solid gray", borderRadius: "5px" }}>
      <h2>User Details</h2>
      <p><strong>Name:</strong> {safelyGetProp('name')}</p>
      <p><strong>Email:</strong> {safelyGetProp('email')}</p>
      <p><strong>Phone:</strong> {safelyGetProp('phone')}</p>
      <p><strong>Website:</strong> {safelyGetProp('website')}</p>
      <p><strong>Company:</strong> {safelyGetProp('company').name || 'No data available'}</p>
      <p><strong>Address:</strong> {`${safelyGetProp('address').street}, ${safelyGetProp('address').city}`}</p>
    </div>
  );
};

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Address Book</h1>
        {error && <p>Error: {error}</p>}
        <ul>
          {users.map(user => (
            <li key={user.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedUser(user)}>
              {user.name || 'No name provided'}
            </li>
          ))}
        </ul>
        {selectedUser && <UserDetail user={selectedUser} />}
      </header>
    </div>
  );
};

export default App;