package main

import (
	"database/sql"
	"fmt"
	"log"
)

// Go Injection Examples
// Demonstrates language injection patterns for Go code
// Supports raw string literals (backticks) with language hints

// =============================================================================
// Pattern 1: Short variable declaration within function body (statement_list)
// =============================================================================

func getUserData(userID int) (*User, error) {
	// language: sql
	query := `
		SELECT
			id,
			username,
			email,
			created_at,
			updated_at
		FROM users
		WHERE id = $1
		AND deleted_at IS NULL
	`

	var user User
	err := db.QueryRow(query, userID).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	return &user, err
}

func insertUser(username, email string) error {
	// language: sql
	insertQuery := `
		INSERT INTO users (
			username,
			email,
			created_at
		)
		VALUES (
			$1,
			$2,
			NOW()
		)
		RETURNING id
	`

	var newID int
	return db.QueryRow(insertQuery, username, email).Scan(&newID)
}

// =============================================================================
// Pattern 2: Short variable declaration (not within statement_list)
// =============================================================================

func updateUserProfile(userID int, bio string) error {
	// language: sql
	updateStmt := `
		UPDATE user_profiles
		SET
			bio = $2,
			updated_at = NOW()
		WHERE user_id = $1
	`
	_, err := db.Exec(updateStmt, userID, bio)
	return err
}

func getActiveUsers() ([]User, error) {
	// language: sql
	activeUsersQuery := `
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
	`

	rows, err := db.Query(activeUsersQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.Username, &u.Email, &u.PostCount); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

// =============================================================================
// Pattern 3: Const declaration with raw string literal
// =============================================================================

// language: sql
const getUserByEmailQuery = `
	SELECT
		id,
		username,
		email,
		password_hash,
		is_verified,
		created_at
	FROM users
	WHERE email = $1
	AND deleted_at IS NULL
`

// language: sql
const createUserTable = `
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
`

// language: graphql
const getUserWithPostsQuery = `
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
`

// language: json
const defaultConfig = `
{
	"server": {
		"host": "0.0.0.0",
		"port": 8080,
		"readTimeout": "15s",
		"writeTimeout": "15s"
	},
	"database": {
		"host": "localhost",
		"port": 5432,
		"name": "myapp",
		"maxConnections": 25,
		"idleConnections": 5
	},
	"cache": {
		"enabled": true,
		"ttl": 3600,
		"maxSize": 1000
	}
}
`

// language: yaml
const kubernetesDeployment = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
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
`

// language: html
const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Welcome Email</title>
</head>
<body>
	<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
		<h1>Welcome to Our Platform!</h1>
		<p>Thank you for signing up. We're excited to have you here.</p>
		<a href="{{.VerificationLink}}" style="
			display: inline-block;
			background-color: #007bff;
			color: white;
			padding: 10px 20px;
			text-decoration: none;
			border-radius: 4px;
		">Verify Your Email</a>
	</div>
</body>
</html>
`

// language: xml
const soapEnvelope = `
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:web="http://example.com/webservice">
	<soap:Header>
		<web:Authentication>
			<web:Username>user</web:Username>
			<web:Password>pass</web:Password>
		</web:Authentication>
	</soap:Header>
	<soap:Body>
		<web:GetUserRequest>
			<web:UserId>12345</web:UserId>
		</web:GetUserRequest>
	</soap:Body>
</soap:Envelope>
`

// language: toml
const appConfig = `
[server]
host = "0.0.0.0"
port = 8080
workers = 4

[database]
url = "postgresql://localhost:5432/mydb"
pool_size = 25
timeout = "5s"

[logging]
level = "info"
format = "json"
output = "stdout"

[features]
enable_cache = true
enable_metrics = true
enable_tracing = false
`

// =============================================================================
// Additional Examples: Various SQL patterns
// =============================================================================

func deleteOldRecords(days int) error {
	// language: sql
	deleteQuery := `
		DELETE FROM audit_logs
		WHERE created_at < NOW() - INTERVAL '1 day' * $1
		RETURNING id
	`
	_, err := db.Exec(deleteQuery, days)
	return err
}

func performComplexJoin() error {
	// language: sql
	complexQuery := `
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
	`
	_, err := db.Exec(complexQuery)
	return err
}

// language: sql
const migrationUp = `
	BEGIN;

	CREATE TABLE posts (
		id SERIAL PRIMARY KEY,
		user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		title VARCHAR(200) NOT NULL,
		content TEXT,
		slug VARCHAR(250) UNIQUE NOT NULL,
		published_at TIMESTAMP,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX idx_posts_user_id ON posts(user_id);
	CREATE INDEX idx_posts_slug ON posts(slug);
	CREATE INDEX idx_posts_published_at ON posts(published_at) WHERE published_at IS NOT NULL;

	COMMIT;
`

func main() {
	fmt.Println("Go injection examples loaded successfully")
}
