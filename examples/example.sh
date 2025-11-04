#!/bin/bash
# Bash/Shell Injection Examples
# Demonstrates potential language injection patterns for Bash/Shell scripts
# Supports heredocs and quoted strings with language hints
# Note: Query file for Bash injections needs to be created

# =============================================================================
# Pattern 1: Heredoc strings (<<EOF...EOF) with language hints
# =============================================================================

# language: sql
read -r -d '' GET_USERS_QUERY << 'EOF'
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
EOF

# language: sql
read -r -d '' INSERT_USER_QUERY << 'EOF'
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
RETURNING id, username, email, created_at
EOF

# language: json
read -r -d '' DEFAULT_CONFIG << 'EOF'
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
    }
}
EOF

# language: yaml
read -r -d '' DOCKER_COMPOSE << 'EOF'
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

volumes:
  postgres_data:
EOF

# language: html
read -r -d '' EMAIL_TEMPLATE << 'EOF'
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
        <p>Dear ${USERNAME},</p>
        <p>Thank you for creating an account with us.</p>
        <a href="${VERIFICATION_LINK}" class="button">Verify Your Email</a>
    </div>
</body>
</html>
EOF

# language: xml
read -r -d '' SOAP_REQUEST << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:web="http://example.com/webservice">
    <soap:Header>
        <web:Authentication>
            <web:Username>${USERNAME}</web:Username>
            <web:Token>${TOKEN}</web:Token>
        </web:Authentication>
    </soap:Header>
    <soap:Body>
        <web:GetUserDataRequest>
            <web:UserId>${USER_ID}</web:UserId>
            <web:IncludeProfile>true</web:IncludeProfile>
        </web:GetUserDataRequest>
    </soap:Body>
</soap:Envelope>
EOF

# =============================================================================
# Pattern 2: Heredoc with command substitution and variable interpolation
# =============================================================================

# language: sql
function get_user_by_email() {
    local email=$1

    read -r -d '' query << EOF
SELECT
    u.id,
    u.username,
    u.email,
    u.password_hash,
    u.is_verified,
    u.created_at
FROM users u
WHERE u.email = '${email}'
AND u.deleted_at IS NULL
EOF

    echo "$query"
}

# language: sql
function create_tables() {
    read -r -d '' schema << 'SCHEMA'
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    slug VARCHAR(250) UNIQUE NOT NULL,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_slug ON posts(slug);
SCHEMA

    echo "$schema"
}

# language: json
function generate_config() {
    local host=${1:-localhost}
    local port=${2:-5432}

    cat << EOF
{
    "database": {
        "host": "${host}",
        "port": ${port},
        "name": "myapp_db",
        "pool_size": 20,
        "timeout": 5,
        "ssl": false
    },
    "server": {
        "host": "0.0.0.0",
        "port": 8080,
        "workers": 4
    },
    "logging": {
        "level": "info",
        "format": "json"
    }
}
EOF
}

# =============================================================================
# Pattern 3: Double-quoted strings with variable expansion
# =============================================================================

# language: sql
FIND_USERS_QUERY="
SELECT
    id,
    username,
    email
FROM users
WHERE status = 'active'
AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 100
"

# language: sql
UPDATE_USER_QUERY="
UPDATE users
SET
    username = '${NEW_USERNAME}',
    email = '${NEW_EMAIL}',
    updated_at = NOW()
WHERE id = ${USER_ID}
AND deleted_at IS NULL
"

# language: json
APP_CONFIG="
{
    \"api\": {
        \"baseUrl\": \"https://api.example.com\",
        \"timeout\": 5000,
        \"retries\": 3
    },
    \"database\": {
        \"host\": \"${DB_HOST}\",
        \"port\": ${DB_PORT},
        \"name\": \"${DB_NAME}\"
    }
}
"

# =============================================================================
# Pattern 4: Single-quoted strings (no interpolation)
# =============================================================================

# language: sql
SEARCH_QUERY='
SELECT
    u.id,
    u.username,
    u.email,
    ts_rank(
        to_tsvector("english", u.username || " " || COALESCE(p.bio, "")),
        plainto_tsquery("english", $1)
    ) as rank
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
WHERE to_tsvector("english", u.username || " " || COALESCE(p.bio, ""))
    @@ plainto_tsquery("english", $1)
ORDER BY rank DESC
LIMIT 50
'

# language: html
REPORT_TEMPLATE='
<!DOCTYPE html>
<html>
<head>
    <title>Report</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #4CAF50; color: white; }
    </style>
</head>
<body>
    <h1>User Activity Report</h1>
    <table id="report-data"></table>
</body>
</html>
'

# language: yaml
NGINX_CONFIG='
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://api:8080;
        proxy_set_header Authorization $http_authorization;
    }
}
'

# =============================================================================
# Pattern 5: Functions with embedded queries
# =============================================================================

function backup_database() {
    local backup_file="/backups/db_$(date +%Y%m%d_%H%M%S).sql"

    # language: sql
    local dump_command=$(cat << 'SQL'
pg_dump --verbose --no-password \
    --host=${DB_HOST} \
    --port=${DB_PORT} \
    --username=${DB_USER} \
    --format=custom \
    --file=${backup_file} \
    ${DB_NAME}
SQL
)

    echo "Backing up database to ${backup_file}"
    eval "$dump_command"
}

function migrate_data() {
    # language: sql
    local migration_script=$(cat << 'MIGRATION'
BEGIN;

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;
MIGRATION
)

    echo "$migration_script"
}

function generate_report() {
    local start_date=$1
    local end_date=$2

    # language: sql
    psql -h localhost -U postgres -d myapp_db << EOF
SELECT
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as active_users,
    COUNT(*) as total_actions
FROM user_actions
WHERE created_at BETWEEN '${start_date}' AND '${end_date}'
GROUP BY DATE(created_at)
ORDER BY date DESC;
EOF
}

# =============================================================================
# Pattern 6: Configuration deployment scripts
# =============================================================================

function deploy_kubernetes() {
    # language: yaml
    kubectl apply -f - << 'K8S'
apiVersion: v1
kind: Namespace
metadata:
  name: production
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: production
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
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
K8S
}

function validate_json_config() {
    local config=$1

    # language: json
    echo "$config" | jq '.' > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "✓ JSON config is valid"
        return 0
    else
        echo "✗ JSON config is invalid"
        return 1
    fi
}

# =============================================================================
# Pattern 7: Multiline comments with documentation
# =============================================================================

# language: markdown
: << 'DOCS'
# Database Setup Instructions

## Prerequisites
- PostgreSQL 12+
- psql command-line tool
- Database credentials

## Steps

1. Create database
   ```bash
   createdb myapp_db
   ```

2. Create tables
   ```bash
   psql -d myapp_db < schema.sql
   ```

3. Load fixtures
   ```bash
   psql -d myapp_db < fixtures.sql
   ```

## Backup

```bash
pg_dump myapp_db | gzip > backup.sql.gz
```

## Restore

```bash
gunzip < backup.sql.gz | psql myapp_db
```
DOCS

# language: markdown
: << 'README'
# Environment Configuration

Set the following environment variables:

- `DB_HOST`: Database hostname (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password (required)
- `DB_NAME`: Database name (default: myapp_db)
- `REDIS_URL`: Redis connection URL
- `LOG_LEVEL`: Logging level (default: info)

Example:
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=secret123
export DB_NAME=myapp_db
export REDIS_URL=redis://localhost:6379
```
README

# =============================================================================
# Main script execution
# =============================================================================

function main() {
    echo "Bash injection examples loaded successfully"
    echo "Available queries: GET_USERS_QUERY, INSERT_USER_QUERY, DEFAULT_CONFIG"
}

main "$@"
