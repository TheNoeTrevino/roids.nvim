/**
 * JavaScript Injection Examples
 * Demonstrates language injection patterns for JavaScript code
 * Supports template strings (backticks) with language hints
 */

// =============================================================================
// Pattern 1: Return statement with template string
// =============================================================================

function getUserQuery(userId) {
  // language: sql
  return `
    SELECT
      u.id,
      u.username,
      u.email,
      u.created_at,
      u.updated_at
    FROM users u
    WHERE u.id = ${userId}
    AND u.deleted_at IS NULL
  `;
}

function generateHTMLReport() {
  // language: html
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Sales Report</title>
    </head>
    <body>
      <div class="container">
        <h1>Monthly Sales Report</h1>
        <div id="chart-container"></div>
        <table id="sales-data"></table>
      </div>
    </body>
    </html>
  `;
}

function getGraphQLQuery() {
  // language: graphql
  return `
    query GetUserWithPosts($userId: ID!) {
      user(id: $userId) {
        id
        username
        email
        profile {
          firstName
          lastName
          bio
          avatarUrl
        }
        posts(first: 10) {
          edges {
            node {
              id
              title
              content
              publishedAt
              comments {
                totalCount
              }
            }
          }
        }
      }
    }
  `;
}

function buildRegexPattern() {
  // language: regex
  return `
    ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
  `;
}

// =============================================================================
// Pattern 2: Const declaration with template string
// =============================================================================

// language: sql
const GET_ACTIVE_USERS = `
  SELECT
    u.id,
    u.username,
    u.email,
    COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON u.id = p.user_id
  WHERE u.status = 'active'
  GROUP BY u.id, u.username, u.email
  ORDER BY post_count DESC
  LIMIT 100
`;

// language: sql
const INSERT_USER_QUERY = `
  INSERT INTO users (
    username,
    email,
    password_hash,
    created_at
  )
  VALUES (?, ?, ?, NOW())
  RETURNING id, username, email
`;

// language: sql
const COMPLEX_ANALYTICS_QUERY = `
  WITH recent_activity AS (
    SELECT
      user_id,
      COUNT(*) as action_count,
      MAX(created_at) as last_action
    FROM user_actions
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY user_id
  )
  SELECT
    u.id,
    u.username,
    COALESCE(ra.action_count, 0) as recent_actions,
    ra.last_action
  FROM users u
  LEFT JOIN recent_activity ra ON u.id = ra.user_id
  WHERE u.status = 'active'
  ORDER BY recent_actions DESC
`;

// language: html
const EMAIL_TEMPLATE = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Welcome Email</title>
    <style>
      body { font-family: Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .button {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
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
const DEFAULT_CONFIG = `
  {
    "server": {
      "host": "0.0.0.0",
      "port": 3000,
      "cors": {
        "enabled": true,
        "origins": ["http://localhost:3000"]
      }
    },
    "database": {
      "host": "localhost",
      "port": 5432,
      "name": "myapp_db",
      "poolSize": 20
    },
    "cache": {
      "enabled": true,
      "ttl": 3600,
      "redis": {
        "host": "localhost",
        "port": 6379
      }
    }
  }
`;

// language: yaml
const DOCKER_COMPOSE = `
  version: '3.8'
  services:
    web:
      image: node:18-alpine
      ports:
        - "3000:3000"
      environment:
        - NODE_ENV=production
        - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      depends_on:
        - db
        - redis

    db:
      image: postgres:14-alpine
      environment:
        POSTGRES_PASSWORD: password
        POSTGRES_DB: myapp
      volumes:
        - postgres_data:/var/lib/postgresql/data

    redis:
      image: redis:7-alpine
      ports:
        - "6379:6379"

  volumes:
    postgres_data:
`;

// language: xml
const SOAP_REQUEST = `
  <?xml version="1.0" encoding="UTF-8"?>
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Header>
      <Authentication>
        <Username>{{username}}</Username>
        <Token>{{token}}</Token>
      </Authentication>
    </soap:Header>
    <soap:Body>
      <GetUserDataRequest>
        <UserId>{{userId}}</UserId>
        <IncludeProfile>true</IncludeProfile>
      </GetUserDataRequest>
    </soap:Body>
  </soap:Envelope>
`;

// language: graphql
const USER_FRAGMENT = `
  fragment UserFields on User {
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
`;

// language: css
const COMPONENT_STYLES = `
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .card-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 12px;
    color: #333;
  }

  .card-content {
    color: #666;
    line-height: 1.6;
  }
`;

// =============================================================================
// Pattern 3: Var declaration with template string
// =============================================================================

function setupDatabase() {
  // language: sql
  var createTables = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_username ON users(username);
  `;

  return createTables;
}

function migrateData() {
  // language: sql
  var migrationScript = `
    BEGIN;

    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

    CREATE TABLE IF NOT EXISTS user_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
    CREATE INDEX idx_sessions_token ON user_sessions(token);

    COMMIT;
  `;

  return migrationScript;
}

function generateMarkdown() {
  // language: markdown
  var documentation = `
    # API Documentation

    ## Authentication

    All API requests must include an authentication token in the header:

    \`\`\`
    Authorization: Bearer YOUR_TOKEN_HERE
    \`\`\`

    ## Endpoints

    ### Users

    - **GET /api/users** - List all users
    - **GET /api/users/:id** - Get a specific user
    - **POST /api/users** - Create a new user
    - **PUT /api/users/:id** - Update a user
    - **DELETE /api/users/:id** - Delete a user

    ### Posts

    - **GET /api/posts** - List all posts
    - **GET /api/posts/:id** - Get a specific post
    - **POST /api/posts** - Create a new post

    ## Rate Limiting

    API requests are limited to 100 requests per minute per IP address.
  `;

  return documentation;
}

// =============================================================================
// Pattern 4: Tagged template literal with function call
// =============================================================================

// language: sql
const TAGGED_LITERAL = stripIndent`
  SELECT
    u.id,
    u.username,
    u.email,
    p.title as latest_post
  FROM users u
  LEFT JOIN posts p ON u.id = p.user_id
  WHERE u.status = 'active'
  ORDER BY p.created_at DESC
`;

// language: html
const HTML_COMPONENT = html`
  <div class="user-card">
    <img src="{{avatarUrl}}" alt="{{username}}" class="avatar">
    <h3>{{username}}</h3>
    <p>{{bio}}</p>
    <button onclick="followUser('{{userId}}')">Follow</button>
  </div>
`;

// language: graphql
const MUTATION_QUERY = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      author {
        id
        username
      }
      createdAt
    }
  }
`;

// language: css
const STYLED_COMPONENT = styled`
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  @media (max-width: 768px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
`;

// =============================================================================
// Pattern 5: Object property with template string
// =============================================================================

const CONFIG = {
  // language: sql
  query: `
    SELECT
      id,
      name,
      description,
      price
    FROM products
    WHERE category = ?
    AND in_stock = true
    ORDER BY price ASC
  `,

  // language: json
  settings: `
    {
      "theme": "dark",
      "notifications": true,
      "language": "en"
    }
  `,

  // language: yaml
  deployment: `
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: myapp
    spec:
      replicas: 3
      template:
        spec:
          containers:
          - name: app
            image: myapp:latest
  `
};

const DATABASE_QUERIES = {
  // language: sql
  getUserById: `
    SELECT * FROM users WHERE id = ?
  `,

  // language: sql
  updateUser: `
    UPDATE users
    SET username = ?, email = ?, updated_at = NOW()
    WHERE id = ?
  `,

  // language: sql
  deleteUser: `
    DELETE FROM users WHERE id = ?
  `
};

const TEMPLATES = {
  // language: html
  userProfile: `
    <div class="profile">
      <h2>{{username}}</h2>
      <p>{{email}}</p>
      <p>Member since: {{createdAt}}</p>
    </div>
  `,

  // language: html
  postCard: `
    <article class="post">
      <h3>{{title}}</h3>
      <p>{{content}}</p>
      <footer>
        Posted by {{author}} on {{date}}
      </footer>
    </article>
  `
};

// =============================================================================
// Additional Examples: Mixed usage patterns
// =============================================================================

class UserService {
  constructor() {
    // language: sql
    this.queries = {
      findAll: `SELECT * FROM users ORDER BY created_at DESC`,
      findById: `SELECT * FROM users WHERE id = ?`,
      create: `INSERT INTO users (username, email) VALUES (?, ?)`,
    };
  }

  async findUsers(searchTerm) {
    // language: sql
    const searchQuery = `
      SELECT
        id,
        username,
        email,
        ts_rank(
          to_tsvector('english', username || ' ' || email),
          plainto_tsquery('english', ?)
        ) as rank
      FROM users
      WHERE to_tsvector('english', username || ' ' || email)
        @@ plainto_tsquery('english', ?)
      ORDER BY rank DESC
      LIMIT 50
    `;

    return db.query(searchQuery, [searchTerm, searchTerm]);
  }

  generateEmailTemplate(user) {
    // language: html
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .content { max-width: 600px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="content">
          <h1>Hello, ${user.username}!</h1>
          <p>Welcome to our platform.</p>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = { UserService, CONFIG, DATABASE_QUERIES, TEMPLATES };
