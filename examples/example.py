# Python Injection Examples
# Demonstrates language injection patterns for Python code
# Supports triple-quoted string assignments with language hints

# =============================================================================
# Pattern 1: Expression statement assignment (at module level)
# =============================================================================

# language: sql
user_query = """
SELECT u.id, u.name, u.email, u.created_at
FROM users u
WHERE u.status = 'active'
ORDER BY u.created_at DESC
LIMIT 100
"""

# language: html
template_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>User Dashboard</title>
</head>
<body>
    <h1>Welcome to the Dashboard</h1>
    <div id="content"></div>
</body>
</html>
"""

# language: json
config_data = """
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp_db"
  },
  "cache": {
    "enabled": true,
    "ttl": 3600
  }
}
"""

# language: xml
soap_request = """
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUserRequest>
      <UserId>12345</UserId>
    </GetUserRequest>
  </soap:Body>
</soap:Envelope>
"""

# language: markdown
documentation = """
# API Documentation

## Authentication
All requests must include an API key in the header:
```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints
- GET /users - List all users
- POST /users - Create a new user
- DELETE /users/:id - Delete a user
"""

# language: yaml
docker_compose = """
version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: secret
"""

# =============================================================================
# Pattern 2: Function body assignment
# =============================================================================

def get_user_data(user_id):
    # language: sql
    query = """
    SELECT
        u.id,
        u.username,
        u.email,
        p.first_name,
        p.last_name,
        p.bio
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    WHERE u.id = :user_id
    """
    return execute_query(query, {'user_id': user_id})

def generate_report_template():
    # language: html
    report_html = """
    <div class="report">
        <h2>Monthly Sales Report</h2>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody id="report-data"></tbody>
        </table>
    </div>
    """
    return report_html

def create_config():
    # language: toml
    config = """
    [server]
    host = "0.0.0.0"
    port = 8080
    workers = 4

    [database]
    url = "postgresql://localhost/mydb"
    pool_size = 10

    [logging]
    level = "info"
    format = "json"
    """
    return parse_toml(config)

def build_graphql_query():
    # language: graphql
    query = """
    query GetUserWithPosts($userId: ID!) {
        user(id: $userId) {
            id
            name
            email
            posts {
                id
                title
                content
                publishedAt
                comments {
                    id
                    body
                    author {
                        name
                    }
                }
            }
        }
    }
    """
    return query

def setup_database_schema():
    # language: sql
    create_tables = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        content TEXT,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_posts_user_id ON posts(user_id);
    CREATE INDEX idx_posts_published_at ON posts(published_at);
    """
    return create_tables

def get_css_styles():
    # language: css
    styles = """
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 24px;
        margin-bottom: 16px;
    }

    .button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .button:hover {
        background-color: #0056b3;
    }
    """
    return styles

def generate_regex_patterns():
    # language: regex
    email_pattern = """
    ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
    """
    return email_pattern.strip()
