// Rust Injection Examples
// Demonstrates potential language injection patterns for Rust code
// Supports raw string literals (r#"..."#, r##"..."##) and regular strings
// Note: Query file for Rust injections needs to be created

use std::collections::HashMap;

// =============================================================================
// Pattern 1: Const declarations with raw string literals
// =============================================================================

// language: sql
const GET_USERS_QUERY: &str = r#"
    SELECT
        u.id,
        u.username,
        u.email,
        u.created_at,
        u.updated_at
    FROM users u
    WHERE u.deleted_at IS NULL
    AND u.status = 'active'
    ORDER BY u.created_at DESC
    LIMIT $1
"#;

// language: sql
const INSERT_USER_QUERY: &str = r#"
    INSERT INTO users (
        username,
        email,
        password_hash,
        created_at
    )
    VALUES ($1, $2, $3, NOW())
    RETURNING id, username, email, created_at
"#;

// language: sql
const COMPLEX_JOIN_QUERY: &str = r#"
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
"#;

// language: json
const DEFAULT_CONFIG: &str = r#"
{
    "database": {
        "host": "localhost",
        "port": 5432,
        "name": "myapp_db",
        "pool_size": 20,
        "timeout": 5
    },
    "cache": {
        "enabled": true,
        "ttl": 3600,
        "max_size": 1000,
        "redis_url": "redis://localhost:6379"
    },
    "server": {
        "host": "0.0.0.0",
        "port": 8080,
        "workers": 4
    },
    "features": {
        "enable_notifications": true,
        "enable_analytics": false
    }
}
"#;

// language: toml
const APP_CONFIG: &str = r#"
[server]
host = "0.0.0.0"
port = 8080
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
"#;

// language: yaml
const KUBERNETES_DEPLOYMENT: &str = r#"
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
        - containerPort: 8080
        env:
        - name: RUST_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
"#;

// language: html
const EMAIL_TEMPLATE: &str = r#"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Our Platform!</h1>
        <p>Dear {{username}},</p>
        <p>Thank you for creating an account with us.</p>
        <a href="{{verification_link}}" class="button">Verify Your Email</a>
    </div>
</body>
</html>
"#;

// language: graphql
const GET_USER_QUERY: &str = r#"
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
"#;

// language: xml
const SOAP_REQUEST: &str = r#"
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
            <web:UserId>{{user_id}}</web:UserId>
            <web:IncludeProfile>true</web:IncludeProfile>
        </web:GetUserDataRequest>
    </soap:Body>
</soap:Envelope>
"#;

// =============================================================================
// Pattern 2: Raw strings with double hashes (for strings containing #)
// =============================================================================

// language: sql
const QUERY_WITH_COMMENT: &str = r##"
    SELECT
        u.id,
        u.username,
        u.email
        -- This is a SQL comment with # characters
        # MySQL style comment
    FROM users u
    WHERE u.status = 'active'
    ORDER BY u.created_at DESC
"##;

// language: markdown
const DOCUMENTATION: &str = r##"
# API Documentation

## Authentication

All API requests must include an authentication token:

```rust
let client = Client::new("your-api-token");
```

## Endpoints

### Users

- **GET /api/users** - List all users
  - Query parameters: `page`, `limit`, `sort`
  - Returns paginated user list

- **GET /api/users/:id** - Get a specific user
  - Returns user details with profile

- **POST /api/users** - Create a new user
  - Required fields: `username`, `email`, `password`

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request |
| 401  | Unauthorized |
| 404  | Not Found |
| 500  | Internal Server Error |
"##;

// language: regex
const EMAIL_PATTERN: &str = r##"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"##;

// language: regex
const URL_PATTERN: &str = r##"https?://[^\s/$.?#].[^\s]*"##;

// =============================================================================
// Pattern 3: Function-level string literals
// =============================================================================

fn get_active_users() -> &'static str {
    // language: sql
    r#"
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
    "#
}

fn create_user_table() -> &'static str {
    // language: sql
    r#"
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            avatar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP
        );

        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_users_username ON users(username);
        CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NOT NULL;
    "#
}

fn migrate_database() -> &'static str {
    // language: sql
    r#"
        BEGIN;

        ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

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
    "#
}

fn generate_email_html(username: &str) -> String {
    // language: html
    let template = r#"
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .email-body {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }
                .button {
                    background-color: #28a745;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="email-body">
                <h1>Hello {{username}}!</h1>
                <p>Welcome to our platform.</p>
                <a href="{{verification_link}}" class="button">Get Started</a>
            </div>
        </body>
        </html>
    "#;

    template.replace("{{username}}", username)
}

fn get_docker_compose() -> &'static str {
    // language: yaml
    r#"
version: '3.8'

services:
  web:
    image: rust:1.70-alpine
    container_name: myapp_web
    ports:
      - "8080:8080"
    environment:
      - RUST_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src
    command: cargo run --release

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
    "#
}

// =============================================================================
// Pattern 4: Struct with query constants
// =============================================================================

struct UserQueries;

impl UserQueries {
    // language: sql
    const FIND_BY_ID: &'static str = r#"
        SELECT * FROM users
        WHERE id = $1
        AND deleted_at IS NULL
    "#;

    // language: sql
    const FIND_BY_EMAIL: &'static str = r#"
        SELECT * FROM users
        WHERE email = $1
        AND deleted_at IS NULL
    "#;

    // language: sql
    const CREATE: &'static str = r#"
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *
    "#;

    // language: sql
    const UPDATE: &'static str = r#"
        UPDATE users
        SET username = $1, email = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
    "#;

    // language: sql
    const DELETE: &'static str = r#"
        UPDATE users
        SET deleted_at = NOW()
        WHERE id = $1
    "#;

    // language: sql
    const SEARCH: &'static str = r#"
        SELECT
            u.id,
            u.username,
            u.email,
            ts_rank(
                to_tsvector('english', u.username || ' ' || COALESCE(p.bio, '')),
                plainto_tsquery('english', $1)
            ) as rank
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE to_tsvector('english', u.username || ' ' || COALESCE(p.bio, ''))
            @@ plainto_tsquery('english', $1)
        ORDER BY rank DESC
        LIMIT 50
    "#;
}

// =============================================================================
// Pattern 5: Module-level queries with lazy statics
// =============================================================================

mod queries {
    // language: sql
    pub const GET_USER_STATS: &str = r#"
        SELECT
            u.id,
            u.username,
            COUNT(DISTINCT p.id) as post_count,
            COUNT(DISTINCT c.id) as comment_count,
            COUNT(DISTINCT f.id) as follower_count
        FROM users u
        LEFT JOIN posts p ON u.id = p.user_id
        LEFT JOIN comments c ON u.id = c.user_id
        LEFT JOIN followers f ON u.id = f.following_id
        WHERE u.id = $1
        GROUP BY u.id, u.username
    "#;

    // language: sql
    pub const GET_RECENT_ACTIVITY: &str = r#"
        SELECT
            action_type,
            COUNT(*) as count,
            MAX(created_at) as last_action
        FROM user_actions
        WHERE user_id = $1
        AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY action_type
        ORDER BY count DESC
    "#;

    // language: graphql
    pub const CREATE_POST_MUTATION: &str = r#"
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
    "#;
}

// =============================================================================
// Pattern 6: Integration with web frameworks
// =============================================================================

async fn handler() -> String {
    // language: json
    let response = r#"
    {
        "status": "success",
        "data": {
            "users": [],
            "total": 0,
            "page": 1,
            "limit": 10
        }
    }
    "#;

    response.to_string()
}

fn main() {
    println!("Rust injection examples loaded successfully");
}
