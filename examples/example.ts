/**
 * TypeScript Injection Examples
 * Demonstrates language injection patterns for TypeScript code
 * Supports template strings with type annotations
 */

// =============================================================================
// Pattern 1: Const declaration with type annotation and template string
// =============================================================================

// language: sql
const getUserQuery: string = `
  SELECT
    u.id,
    u.username,
    u.email,
    u.created_at,
    u.updated_at
  FROM users u
  WHERE u.id = $1
  AND u.deleted_at IS NULL
`;

// language: sql
const insertUserQuery: string = `
  INSERT INTO users (
    username,
    email,
    password_hash,
    created_at
  )
  VALUES ($1, $2, $3, NOW())
  RETURNING id, username, email, created_at
`;

// language: sql
const complexJoinQuery: string = `
  WITH recent_posts AS (
    SELECT
      p.id,
      p.user_id,
      p.title,
      p.created_at,
      ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at DESC) as rn
    FROM posts p
    WHERE p.published_at IS NOT NULL
  )
  SELECT
    u.id,
    u.username,
    u.email,
    rp.title as latest_post_title,
    rp.created_at as latest_post_date,
    COUNT(f.id) as follower_count
  FROM users u
  LEFT JOIN recent_posts rp ON u.id = rp.user_id AND rp.rn = 1
  LEFT JOIN followers f ON u.id = f.following_id
  GROUP BY u.id, u.username, u.email, rp.title, rp.created_at
  HAVING COUNT(f.id) > 10
  ORDER BY follower_count DESC
`;

// language: html
const emailTemplate: string = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background: white; }
      .button {
        background-color: #007bff;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 4px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to Our Platform!</h1>
      <p>Thank you for signing up, {{username}}!</p>
      <a href="{{verificationLink}}" class="button">Verify Your Email</a>
    </div>
  </body>
  </html>
`;

// language: json
const defaultConfig: string = `
  {
    "server": {
      "host": "0.0.0.0",
      "port": 3000,
      "ssl": {
        "enabled": false,
        "certPath": null,
        "keyPath": null
      }
    },
    "database": {
      "host": "localhost",
      "port": 5432,
      "name": "myapp_db",
      "username": "postgres",
      "poolSize": 20,
      "ssl": false
    },
    "cache": {
      "enabled": true,
      "ttl": 3600,
      "maxSize": 1000,
      "redis": {
        "host": "localhost",
        "port": 6379
      }
    }
  }
`;

// language: graphql
const getUserWithPostsQuery: string = `
  query GetUserWithPosts($userId: ID!, $first: Int = 10) {
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
      posts(first: $first, orderBy: CREATED_AT_DESC) {
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
            comments {
              totalCount
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

// language: yaml
const kubernetesDeployment: string = `
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: myapp
    namespace: production
    labels:
      app: myapp
      version: v1.0.0
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: myapp
    template:
      metadata:
        labels:
          app: myapp
      spec:
        containers:
        - name: myapp
          image: myapp:latest
          ports:
          - containerPort: 3000
          env:
          - name: NODE_ENV
            value: "production"
          - name: DATABASE_URL
            valueFrom:
              secretKeyRef:
                name: db-credentials
                key: url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
`;

// language: xml
const soapRequest: string = `
  <?xml version="1.0" encoding="UTF-8"?>
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                 xmlns:web="http://example.com/webservice">
    <soap:Header>
      <web:Authentication>
        <web:Username>{{username}}</web:Username>
        <web:Token>{{token}}</web:Token>
      </web:Authentication>
    </soap:Header>
    <soap:Body>
      <web:GetUserDataRequest>
        <web:UserId>{{userId}}</web:UserId>
        <web:IncludeProfile>true</web:IncludeProfile>
        <web:IncludePosts>true</web:IncludePosts>
      </web:GetUserDataRequest>
    </soap:Body>
  </soap:Envelope>
`;

// language: toml
const appConfig: string = `
  [server]
  host = "0.0.0.0"
  port = 3000
  workers = 4

  [database]
  url = "postgresql://localhost:5432/myapp"
  pool_size = 25
  timeout = "5s"

  [cache]
  enabled = true
  ttl = 3600
  redis_url = "redis://localhost:6379"

  [logging]
  level = "info"
  format = "json"
  output = "stdout"
`;

// language: css
const componentStyles: string = `
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #333;
  }

  .card-content {
    color: #666;
    line-height: 1.6;
  }

  .card-footer {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #eee;
  }

  @media (max-width: 768px) {
    .card {
      padding: 16px;
    }
  }
`;

// language: markdown
const documentation: string = `
  # API Documentation

  ## Overview

  This API provides access to user and post data with full CRUD operations.

  ## Authentication

  All API requests require authentication using a Bearer token:

  \`\`\`bash
  curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/users
  \`\`\`

  ## Endpoints

  ### Users

  - **GET /api/users** - List all users
    - Query parameters: \`page\`, \`limit\`, \`sort\`
    - Returns paginated user list

  - **GET /api/users/:id** - Get a specific user
    - Returns user details with profile information

  - **POST /api/users** - Create a new user
    - Required fields: \`username\`, \`email\`, \`password\`

  - **PUT /api/users/:id** - Update a user
    - Optional fields: \`username\`, \`email\`, \`bio\`

  - **DELETE /api/users/:id** - Delete a user
    - Soft delete (sets \`deleted_at\` timestamp)

  ## Rate Limiting

  - 100 requests per minute per IP address
  - 1000 requests per hour per API key

  ## Error Codes

  | Code | Description |
  |------|-------------|
  | 400  | Bad Request |
  | 401  | Unauthorized |
  | 403  | Forbidden |
  | 404  | Not Found |
  | 429  | Too Many Requests |
  | 500  | Internal Server Error |
`;

// =============================================================================
// Pattern 2: Var declaration with type annotation and template string
// =============================================================================

function setupDatabase(): string {
  // language: sql
  var createTablesScript: string = `
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_username ON users(username);
    CREATE INDEX idx_posts_user_id ON posts(user_id);
    CREATE INDEX idx_posts_slug ON posts(slug);
    CREATE INDEX idx_posts_published_at ON posts(published_at) WHERE published_at IS NOT NULL;
  `;

  return createTablesScript;
}

function migrateDatabaseSchema(): string {
  // language: sql
  var migrationScript: string = `
    BEGIN;

    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

    CREATE TABLE IF NOT EXISTS user_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(255) UNIQUE NOT NULL,
      ip_address INET,
      user_agent TEXT,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
    CREATE INDEX idx_sessions_token ON user_sessions(token);
    CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);

    COMMIT;
  `;

  return migrationScript;
}

function generateReportHTML(data: any): string {
  // language: html
  var reportTemplate: string = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Analytics Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 20px;
          background-color: #f5f5f5;
        }
        .report-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #4CAF50;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        <h1>User Activity Report</h1>
        <div id="summary"></div>
        <table id="data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Posts</th>
              <th>Comments</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody id="report-data"></tbody>
        </table>
      </div>
    </body>
    </html>
  `;

  return reportTemplate;
}

// =============================================================================
// Pattern 3: Return statement with template string
// =============================================================================

function getSearchQuery(searchTerm: string): string {
  // language: sql
  return `
    SELECT
      u.id,
      u.username,
      u.email,
      ts_rank(
        to_tsvector('english', u.username || ' ' || COALESCE(p.bio, '')),
        plainto_tsquery('english', $1)
      ) as relevance_score
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE to_tsvector('english', u.username || ' ' || COALESCE(p.bio, ''))
      @@ plainto_tsquery('english', $1)
    ORDER BY relevance_score DESC
    LIMIT 50
  `;
}

function buildGraphQLMutation(): string {
  // language: graphql
  return `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        id
        title
        content
        slug
        author {
          id
          username
          email
        }
        tags {
          name
          slug
        }
        publishedAt
        createdAt
        updatedAt
      }
    }
  `;
}

function getDockerCompose(): string {
  // language: yaml
  return `
    version: '3.8'

    services:
      web:
        image: node:18-alpine
        container_name: myapp_web
        ports:
          - "3000:3000"
        environment:
          - NODE_ENV=production
          - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
          - REDIS_URL=redis://redis:6379
        depends_on:
          - db
          - redis
        volumes:
          - ./src:/app/src
        command: npm start

      db:
        image: postgres:14-alpine
        container_name: myapp_db
        environment:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: password
          POSTGRES_DB: myapp
        volumes:
          - postgres_data:/var/lib/postgresql/data
        ports:
          - "5432:5432"

      redis:
        image: redis:7-alpine
        container_name: myapp_redis
        ports:
          - "6379:6379"
        command: redis-server --appendonly yes
        volumes:
          - redis_data:/data

    volumes:
      postgres_data:
      redis_data:
  `;
}

// =============================================================================
// Type-safe interfaces with query constants
// =============================================================================

interface UserQueries {
  readonly findById: string;
  readonly findByEmail: string;
  readonly create: string;
  readonly update: string;
  readonly delete: string;
}

const userQueries: UserQueries = {
  // language: sql
  findById: `SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`,

  // language: sql
  findByEmail: `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`,

  // language: sql
  create: `
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

  // language: sql
  delete: `
    UPDATE users
    SET deleted_at = NOW()
    WHERE id = $1
  `,
};

// =============================================================================
// Class-based examples
// =============================================================================

class DatabaseService {
  private readonly queries: Record<string, string>;

  constructor() {
    this.queries = {
      // language: sql
      getAllUsers: `SELECT * FROM users ORDER BY created_at DESC`,

      // language: sql
      getActiveUsers: `SELECT * FROM users WHERE deleted_at IS NULL`,
    };
  }

  public getUserAnalytics(userId: number): string {
    // language: sql
    return `
      SELECT
        u.id,
        u.username,
        COUNT(DISTINCT p.id) as total_posts,
        COUNT(DISTINCT c.id) as total_comments,
        COUNT(DISTINCT f.id) as follower_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      LEFT JOIN comments c ON u.id = c.user_id
      LEFT JOIN followers f ON u.id = f.following_id
      WHERE u.id = $1
      GROUP BY u.id, u.username
    `;
  }

  public getEmailTemplate(): string {
    // language: html
    return `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Follower Notification</h2>
        <p>{{followerName}} started following you!</p>
        <a href="{{profileUrl}}">View their profile</a>
      </div>
    `;
  }
}

export { userQueries, DatabaseService };
