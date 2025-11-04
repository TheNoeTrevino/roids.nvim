/**
 * TSX Injection Examples
 * Demonstrates language injection patterns for TSX code
 * Note: TSX inherits injection patterns from TypeScript
 * All TypeScript template string patterns work in TSX files
 */

import React, { useState, useEffect, FC, ReactElement } from 'react';

// =============================================================================
// Type definitions
// =============================================================================

interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  content: string;
  publishedAt?: Date;
}

interface UserStats {
  postCount: number;
  commentCount: number;
  followerCount: number;
}

// =============================================================================
// Pattern 1: Template strings with type annotations in constants
// =============================================================================

// language: sql
const GET_USERS_QUERY: string = `
  SELECT
    u.id,
    u.username,
    u.email,
    u.avatar_url,
    u.created_at,
    u.updated_at
  FROM users u
  WHERE u.status = 'active'
  AND u.deleted_at IS NULL
  ORDER BY u.created_at DESC
  LIMIT 100
`;

// language: sql
const GET_USER_WITH_STATS: string = `
  SELECT
    u.id,
    u.username,
    u.email,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT f.id) as follower_count
  FROM users u
  LEFT JOIN posts p ON u.id = p.user_id
  LEFT JOIN comments c ON u.id = c.user_id
  LEFT JOIN followers f ON u.id = f.following_id
  WHERE u.id = $1
  GROUP BY u.id, u.username, u.email
`;

// language: graphql
const USER_QUERY: string = `
  query GetUser($userId: ID!) {
    user(id: $userId) {
      id
      username
      email
      profile {
        firstName
        lastName
        bio
        avatarUrl
        website
      }
      posts(first: 10, orderBy: CREATED_AT_DESC) {
        edges {
          node {
            id
            title
            content
            publishedAt
            tags {
              name
              slug
            }
          }
        }
      }
    }
  }
`;

// language: css
const COMPONENT_STYLES: string = `
  .user-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }

  .user-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .user-card-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .user-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-right: 16px;
    object-fit: cover;
  }

  .user-info h3 {
    margin: 0 0 4px 0;
    font-size: 20px;
    color: #333;
  }

  .user-info p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
`;

// language: json
const APP_CONFIG: string = `
  {
    "api": {
      "baseUrl": "https://api.example.com",
      "timeout": 5000,
      "retries": 3,
      "version": "v1"
    },
    "features": {
      "darkMode": true,
      "notifications": true,
      "analytics": false,
      "betaFeatures": false
    },
    "ui": {
      "theme": "light",
      "language": "en",
      "timezone": "UTC"
    }
  }
`;

// =============================================================================
// Pattern 2: Template strings in functional components with TypeScript
// =============================================================================

const UserList: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // language: sql
    const fetchQuery: string = `
      SELECT
        id,
        username,
        email,
        avatar_url,
        created_at
      FROM users
      WHERE deleted_at IS NULL
      AND is_verified = true
      ORDER BY username ASC
    `;

    fetchUsers(fetchQuery)
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="user-list">
      {loading ? (
        <div>Loading...</div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="user-item">
            {user.avatarUrl && (
              <img src={user.avatarUrl} alt={user.username} />
            )}
            <span>{user.username}</span>
            <span>{user.email}</span>
          </div>
        ))
      )}
    </div>
  );
};

const UserProfile: FC<{ userId: number }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  const getUserData = (): string => {
    // language: sql
    return `
      SELECT
        u.id,
        u.username,
        u.email,
        u.avatar_url,
        p.bio,
        p.website
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = $1
      AND u.deleted_at IS NULL
    `;
  };

  const getUserStats = (): string => {
    // language: sql
    return `
      SELECT
        COUNT(DISTINCT p.id) as post_count,
        COUNT(DISTINCT c.id) as comment_count,
        COUNT(DISTINCT f.id) as follower_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      LEFT JOIN comments c ON u.id = c.user_id
      LEFT JOIN followers f ON u.id = f.following_id
      WHERE u.id = $1
    `;
  };

  useEffect(() => {
    Promise.all([
      fetchData<User>(getUserData(), [userId]),
      fetchData<UserStats>(getUserStats(), [userId]),
    ]).then(([userData, userStats]) => {
      setUser(userData);
      setStats(userStats);
    });
  }, [userId]);

  if (!user || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h2>{user.username}</h2>
      <p>{user.email}</p>
      <div className="stats">
        <span>Posts: {stats.postCount}</span>
        <span>Comments: {stats.commentCount}</span>
        <span>Followers: {stats.followerCount}</span>
      </div>
    </div>
  );
};

const EmailTemplate: FC<{ subject: string; content: string }> = ({
  subject,
  content,
}) => {
  // language: html
  const emailHTML: string = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .email-header {
          background-color: #007bff;
          color: white;
          padding: 30px;
          text-align: center;
        }
        .email-content {
          padding: 30px;
        }
        .email-footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>${subject}</h1>
        </div>
        <div class="email-content">
          ${content}
        </div>
        <div class="email-footer">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return <div dangerouslySetInnerHTML={{ __html: emailHTML }} />;
};

// =============================================================================
// Pattern 3: Template strings in class components with TypeScript
// =============================================================================

interface DatabaseManagerProps {
  connectionString: string;
}

interface DatabaseManagerState {
  connected: boolean;
  error: string | null;
}

class DatabaseManager extends React.Component<
  DatabaseManagerProps,
  DatabaseManagerState
> {
  private readonly queries: Record<string, string>;

  constructor(props: DatabaseManagerProps) {
    super(props);

    this.state = {
      connected: false,
      error: null,
    };

    this.queries = {
      // language: sql
      selectAll: `SELECT * FROM users ORDER BY created_at DESC`,

      // language: sql
      selectById: `SELECT * FROM users WHERE id = $1`,

      // language: sql
      insert: `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *
      `,

      // language: sql
      update: `
        UPDATE users
        SET username = $1, email = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `,
    };
  }

  createTables(): string {
    // language: sql
    const createSQL: string = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        content TEXT,
        slug VARCHAR(250) UNIQUE NOT NULL,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_username ON users(username);
      CREATE INDEX idx_posts_user_id ON posts(user_id);
      CREATE INDEX idx_posts_slug ON posts(slug);
    `;

    return createSQL;
  }

  render(): ReactElement {
    return (
      <div className="database-manager">
        <h2>Database Manager</h2>
        {this.state.connected ? (
          <p>Connected to database</p>
        ) : (
          <p>Not connected</p>
        )}
      </div>
    );
  }
}

// =============================================================================
// Pattern 4: Template strings in custom hooks with TypeScript
// =============================================================================

interface UseUserQueryResult {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

function useUserQuery(userId: number): UseUserQueryResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // language: sql
    const query: string = `
      SELECT
        u.id,
        u.username,
        u.email,
        u.avatar_url,
        u.created_at,
        p.first_name,
        p.last_name,
        p.bio,
        p.website
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = $1
      AND u.deleted_at IS NULL
    `;

    setLoading(true);
    fetchData<User>(query, [userId])
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
}

interface AnalyticsQuery {
  getDailyStats: (startDate: Date, endDate: Date) => string;
  getUserActivity: (userId: number) => string;
}

function useAnalytics(): AnalyticsQuery {
  const getDailyStats = (startDate: Date, endDate: Date): string => {
    // language: sql
    return `
      SELECT
        DATE(created_at) as date,
        COUNT(DISTINCT user_id) as active_users,
        COUNT(DISTINCT CASE WHEN action_type = 'post' THEN id END) as posts_created,
        COUNT(DISTINCT CASE WHEN action_type = 'comment' THEN id END) as comments_created
      FROM user_actions
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
  };

  const getUserActivity = (userId: number): string => {
    // language: sql
    return `
      SELECT
        action_type,
        COUNT(*) as count,
        MAX(created_at) as last_action
      FROM user_actions
      WHERE user_id = $1
      AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY action_type
      ORDER BY count DESC
    `;
  };

  return { getDailyStats, getUserActivity };
}

// =============================================================================
// Pattern 5: Template strings in GraphQL operations
// =============================================================================

interface GraphQLClient {
  query: <T>(query: string, variables?: Record<string, any>) => Promise<T>;
  mutate: <T>(mutation: string, variables?: Record<string, any>) => Promise<T>;
}

class UserService {
  constructor(private client: GraphQLClient) {}

  async getUser(userId: string): Promise<User> {
    // language: graphql
    const query: string = `
      query GetUser($userId: ID!) {
        user(id: $userId) {
          id
          username
          email
          createdAt
          profile {
            firstName
            lastName
            bio
            avatarUrl
          }
        }
      }
    `;

    return this.client.query<User>(query, { userId });
  }

  async createPost(title: string, content: string): Promise<Post> {
    // language: graphql
    const mutation: string = `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          id
          title
          content
          author {
            id
            username
          }
          publishedAt
          createdAt
        }
      }
    `;

    return this.client.mutate<Post>(mutation, {
      input: { title, content },
    });
  }

  async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<User> {
    // language: graphql
    const mutation: string = `
      mutation UpdateUser($userId: ID!, $input: UpdateUserInput!) {
        updateUser(userId: $userId, input: $input) {
          id
          username
          email
          updatedAt
        }
      }
    `;

    return this.client.mutate<User>(mutation, { userId, input: updates });
  }
}

// =============================================================================
// Pattern 6: Template strings in configuration and utilities
// =============================================================================

interface QueryConfig {
  readonly users: string;
  readonly posts: string;
  readonly comments: string;
}

const QUERIES: QueryConfig = {
  // language: sql
  users: `
    SELECT * FROM users
    WHERE deleted_at IS NULL
    ORDER BY created_at DESC
  `,

  // language: sql
  posts: `
    SELECT
      p.*,
      u.username as author_username
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.published_at IS NOT NULL
    ORDER BY p.published_at DESC
  `,

  // language: sql
  comments: `
    SELECT
      c.*,
      u.username as commenter_username
    FROM comments c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC
  `,
};

// language: yaml
const KUBERNETES_CONFIG: string = `
  apiVersion: v1
  kind: Service
  metadata:
    name: react-app
    namespace: production
  spec:
    type: LoadBalancer
    ports:
    - port: 80
      targetPort: 3000
    selector:
      app: react-app
  ---
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: react-app
    namespace: production
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: react-app
    template:
      metadata:
        labels:
          app: react-app
      spec:
        containers:
        - name: app
          image: myregistry/react-app:latest
          ports:
          - containerPort: 3000
          env:
          - name: NODE_ENV
            value: "production"
`;

export { UserList, UserProfile, DatabaseManager, UserService, QUERIES };
