import React, { useState } from "react";
import "./App.css";
import axios from "axios";

type Repository = {
  id: number;
  name: string;
  description: string;
  stars: number;
  forks: number;
};

type User = {
  login: string;
  repositories_url: string;
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [sortBy, setSortBy] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${searchQuery}`
      );
      const { items: users } = response.data;
      handleUserClick(users[0]);
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserClick = async (user: any) => {
    try {
      const response = await axios.get(user.repos_url);

      const repositories = response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
      }));
      setRepositories(repositories);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const sortedRepositories = [...repositories].sort((a, b) => {
    if (sortBy === "stars") {
      return b.stars - a.stars;
    } else if (sortBy === "forks") {
      return b.forks - a.forks;
    }
    return 0;
  });

  return (
    <div className="main">
      <div className="wrap">
        <h1 className="heading">Github User Search</h1>
        <div className="searchWrapper">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
            placeholder="Seach by username"
          />
          <button onClick={handleSearch} className="btn">
            Search
          </button>
        </div>

        {users.length > 0 && (
          <>
            <h2 className="heading">Users</h2>
            <select
              onChange={(e) => handleUserClick(users[e.target.selectedIndex])}
              className="userSelect"
            >
              {users.map((user) => (
                <option value={user.login} key={user.login}>
                  {user.login}
                </option>
              ))}
            </select>

            <h2 className="heading">Repositories</h2>
            <div className="sortWrapper">
              Sort By:
              <select
                value={sortBy}
                onChange={handleSortByChange}
                className="userSelect"
              >
                <option value="">None</option>
                <option value="stars">Stars</option>
                <option value="forks">Forks</option>
              </select>
            </div>

            <div className="cardWrapper">
              {sortedRepositories.map((repo) => {
                return (
                  <div className="card" key={repo.id}>
                    <div className="cardLeft">
                      <h3>{repo.name}</h3>
                      <p>{repo.description}</p>
                    </div>
                    <div className="cardRight">
                      <p>Stars {repo.stars}</p>
                      <p>Forks {repo.forks}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
