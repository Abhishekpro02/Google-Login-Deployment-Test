import React, { useState } from "react";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users`, {
          credentials: "include",
        });
        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  return (
    <div>
      <h1>User List </h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <img
                src={user.avatar}
                alt="User Avatar"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
              <h3>{user.displayName}</h3>
              <p>{user.email}</p>
              <p>Google ID : {user.googleId}</p>
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default User;
