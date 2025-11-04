/**
 * JSX Injection Examples
 * Demonstrates language injection patterns for JSX code
 * Note: JSX inherits injection patterns from JavaScript
 * All JavaScript template string patterns work in JSX files
 */

import React, { useState, useEffect } from 'react';

// =============================================================================
// Pattern 1: Template strings in React components (const declarations)
// =============================================================================

// language: sql
const GET_USERS_QUERY = `
  SELECT
    u.id,
    u.username,
    u.email,
    u.avatar_url,
    u.created_at
  FROM users u
  WHERE u.status = 'active'
  ORDER BY u.created_at DESC
  LIMIT 50
`;

// language: graphql
const USER_FRAGMENT = `
  fragment UserFields on User {
    id
    username
    email
    profile {
      firstName
      lastName
      bio
      avatarUrl
    }
  }
`;

// language: css
const CARD_STYLES = `
  .user-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 16px;
    transition: transform 0.2s;
  }

  .user-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .user-card-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 12px;
  }
`;

// language: json
const APP_CONFIG = `
  {
    "api": {
      "baseUrl": "https://api.example.com",
      "timeout": 5000,
      "retries": 3
    },
    "features": {
      "darkMode": true,
      "notifications": true,
      "analytics": false
    }
  }
`;

// =============================================================================
// Pattern 2: Template strings in functional components
// =============================================================================

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // language: sql
    const fetchQuery = `
      SELECT
        id,
        username,
        email,
        avatar_url
      FROM users
      WHERE deleted_at IS NULL
      ORDER BY username ASC
    `;

    fetchUsers(fetchQuery).then(setUsers);
  }, []);

  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-item">
          <img src={user.avatar_url} alt={user.username} />
          <span>{user.username}</span>
        </div>
      ))}
    </div>
  );
}

function UserProfile({ userId }) {
  const getUserData = () => {
    // language: sql
    return `
      SELECT
        u.id,
        u.username,
        u.email,
        u.bio,
        COUNT(p.id) as post_count,
        COUNT(f.id) as follower_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      LEFT JOIN followers f ON u.id = f.following_id
      WHERE u.id = ${userId}
      GROUP BY u.id, u.username, u.email, u.bio
    `;
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
    </div>
  );
}

function EmailPreview({ template }) {
  // language: html
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #007bff;
          color: white;
          padding: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>${template.title}</h1>
        </div>
        <div class="content">
          ${template.content}
        </div>
      </div>
    </body>
    </html>
  `;

  return (
    <div dangerouslySetInnerHTML={{ __html: emailHTML }} />
  );
}

// =============================================================================
// Pattern 3: Template strings in class components
// =============================================================================

class DatabaseManager extends React.Component {
  constructor(props) {
    super(props);

    // language: sql
    this.queries = {
      selectAll: `SELECT * FROM users ORDER BY created_at DESC`,
      selectById: `SELECT * FROM users WHERE id = ?`,
      insert: `INSERT INTO users (username, email) VALUES (?, ?)`,
      update: `UPDATE users SET username = ?, email = ? WHERE id = ?`,
      delete: `DELETE FROM users WHERE id = ?`,
    };
  }

  createTable() {
    // language: sql
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_username ON users(username);
    `;

    return createTableSQL;
  }

  render() {
    return <div>Database Manager</div>;
  }
}

class GraphQLClient extends React.Component {
  fetchUserData(userId) {
    // language: graphql
    const query = `
      query GetUser($userId: ID!) {
        user(id: $userId) {
          id
          username
          email
          posts(first: 10) {
            edges {
              node {
                id
                title
                content
                publishedAt
              }
            }
          }
        }
      }
    `;

    return this.client.query({ query, variables: { userId } });
  }

  createPost(input) {
    // language: graphql
    const mutation = `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          id
          title
          content
          author {
            id
            username
          }
        }
      }
    `;

    return this.client.mutate({ mutation, variables: { input } });
  }

  render() {
    return <div>GraphQL Client</div>;
  }
}

// =============================================================================
// Pattern 4: Template strings in hooks
// =============================================================================

function useUserQuery(userId) {
  const [data, setData] = useState(null);

  useEffect(() => {
    // language: sql
    const query = `
      SELECT
        u.*,
        p.first_name,
        p.last_name,
        p.bio
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `;

    fetchData(query, [userId]).then(setData);
  }, [userId]);

  return data;
}

function useAnalytics() {
  const getReportQuery = (startDate, endDate) => {
    // language: sql
    return `
      SELECT
        DATE(created_at) as date,
        COUNT(DISTINCT user_id) as active_users,
        COUNT(*) as total_actions
      FROM user_actions
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
  };

  return { getReportQuery };
}

// =============================================================================
// Pattern 5: Template strings in configuration objects
// =============================================================================

const CONFIG = {
  // language: sql
  queries: {
    users: `SELECT * FROM users`,
    posts: `SELECT * FROM posts`,
  },

  // language: yaml
  deployment: `
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: react-app
    spec:
      replicas: 3
      template:
        spec:
          containers:
          - name: app
            image: myapp:latest
  `,

  // language: json
  settings: `
    {
      "theme": "dark",
      "language": "en",
      "notifications": true
    }
  `,
};

// =============================================================================
// Pattern 6: Template strings in event handlers
// =============================================================================

function UserForm() {
  const handleSubmit = (formData) => {
    // language: sql
    const insertQuery = `
      INSERT INTO users (
        username,
        email,
        password_hash,
        created_at
      )
      VALUES (
        $1,
        $2,
        $3,
        NOW()
      )
      RETURNING id, username, email
    `;

    return db.query(insertQuery, [
      formData.username,
      formData.email,
      formData.passwordHash,
    ]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" />
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
  );
}

function CodeEditor() {
  // language: html
  const defaultTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Document</title>
    </head>
    <body>
      <div id="root"></div>
    </body>
    </html>
  `;

  return (
    <div className="code-editor">
      <textarea defaultValue={defaultTemplate} />
    </div>
  );
}

export { UserList, UserProfile, DatabaseManager, GraphQLClient };
