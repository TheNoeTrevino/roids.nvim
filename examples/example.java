package com.example.demo;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

/**
 * Java Injection Examples
 * Demonstrates language injection patterns for Java code
 * Supports multiline strings ("""), single-line strings, and @Query annotations
 */

// =============================================================================
// Pattern 1: @Query annotation with 'value' parameter (automatic SQL injection)
// =============================================================================

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(
        value = """
            SELECT u.id, u.username, u.email, u.created_at
            FROM users u
            WHERE u.status = 'active'
            ORDER BY u.created_at DESC
            LIMIT :limit
            """,
        nativeQuery = true
    )
    List<User> findActiveUsers(@Param("limit") int limit);

    @Modifying
    @Query(
        value = """
            DELETE FROM users u
            WHERE u.id = :id
            AND u.deleted_at IS NULL
            """,
        nativeQuery = true
    )
    int deleteUserById(@Param("id") Long id);

    @Query(
        value = """
            SELECT
                u.id,
                u.username,
                u.email,
                COUNT(p.id) as post_count
            FROM users u
            LEFT JOIN posts p ON u.id = p.user_id
            WHERE u.email = :email
            GROUP BY u.id, u.username, u.email
            """,
        nativeQuery = true
    )
    UserStats getUserStatsByEmail(@Param("email") String email);

    @Modifying
    @Query(
        value = """
            UPDATE user_profiles
            SET
                bio = :bio,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = :userId
            """,
        nativeQuery = true
    )
    void updateUserBio(@Param("userId") Long userId, @Param("bio") String bio);
}

// =============================================================================
// Pattern 2: Constant declaration (public static final) with multiline strings
// =============================================================================

@Service
public class UserService {

    // language: sql
    public static final String GET_USER_BY_EMAIL = """
        SELECT
            u.id,
            u.username,
            u.email,
            u.password_hash,
            u.is_verified,
            u.created_at,
            u.updated_at
        FROM users u
        WHERE u.email = ?
        AND u.deleted_at IS NULL
        """;

    // language: sql
    public static final String INSERT_USER_QUERY = """
        INSERT INTO users (
            username,
            email,
            password_hash,
            created_at
        )
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        RETURNING id
        """;

    // language: sql
    public static final String COMPLEX_JOIN_QUERY = """
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
            rp.title as latest_post_title,
            COUNT(f.id) as follower_count
        FROM users u
        LEFT JOIN recent_posts rp ON u.id = rp.user_id AND rp.rn = 1
        LEFT JOIN followers f ON u.id = f.following_id
        GROUP BY u.id, u.username, rp.title
        HAVING COUNT(f.id) > 10
        """;

    // language: json
    public static final String DEFAULT_CONFIG = """
        {
            "database": {
                "host": "localhost",
                "port": 5432,
                "name": "myapp_db",
                "poolSize": 20
            },
            "cache": {
                "enabled": true,
                "ttl": 3600,
                "maxSize": 1000
            },
            "features": {
                "enableNotifications": true,
                "enableAnalytics": false
            }
        }
        """;

    // language: xml
    public static final String SOAP_REQUEST_TEMPLATE = """
        <?xml version="1.0" encoding="UTF-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Header>
                <Authentication>
                    <Username>{{username}}</Username>
                    <Token>{{token}}</Token>
                </Authentication>
            </soap:Header>
            <soap:Body>
                <GetUserRequest>
                    <UserId>{{userId}}</UserId>
                </GetUserRequest>
            </soap:Body>
        </soap:Envelope>
        """;

    // language: html
    public static final String EMAIL_TEMPLATE = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Welcome Email</title>
        </head>
        <body>
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1>Welcome to Our Platform!</h1>
                <p>Dear {{username}},</p>
                <p>Thank you for creating an account.</p>
                <a href="{{verificationLink}}" style="
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 4px;
                ">Verify Your Email</a>
            </div>
        </body>
        </html>
        """;
}

// =============================================================================
// Pattern 3: Field declaration (private static final) with multiline strings
// =============================================================================

@Service
public class ReportService {

    // language: sql
    private static final String GENERATE_SALES_REPORT = """
        SELECT
            p.id as product_id,
            p.name as product_name,
            COUNT(oi.id) as units_sold,
            SUM(oi.price * oi.quantity) as total_revenue
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        WHERE oi.created_at BETWEEN ? AND ?
        GROUP BY p.id, p.name
        ORDER BY total_revenue DESC
        """;

    // language: sql
    private static final String GET_USER_ACTIVITY = """
        SELECT
            u.id,
            u.username,
            COUNT(DISTINCT p.id) as post_count,
            COUNT(DISTINCT c.id) as comment_count,
            MAX(p.created_at) as last_post_date
        FROM users u
        LEFT JOIN posts p ON u.id = p.user_id
        LEFT JOIN comments c ON u.id = c.user_id
        WHERE u.created_at >= ?
        GROUP BY u.id, u.username
        HAVING COUNT(DISTINCT p.id) > 0
        """;

    // language: graphql
    private static final String GET_USER_DATA_QUERY = """
        query GetUserData($userId: ID!) {
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
                        }
                    }
                }
            }
        }
        """;

    // language: yaml
    private static final String KUBERNETES_CONFIG = """
        apiVersion: v1
        kind: ConfigMap
        metadata:
          name: app-config
          namespace: production
        data:
          database.host: "postgres.production.svc.cluster.local"
          database.port: "5432"
          cache.enabled: "true"
          cache.ttl: "3600"
        """;

    // language: toml
    private static final String APP_CONFIG = """
        [server]
        host = "0.0.0.0"
        port = 8080
        workers = 4

        [database]
        url = "postgresql://localhost:5432/mydb"
        pool_size = 25

        [logging]
        level = "info"
        format = "json"
        """;
}

// =============================================================================
// Pattern 4: Local variable declaration with multiline strings
// =============================================================================

@Service
public class DatabaseService {

    public void createTables() {
        // language: sql
        String createUserTable = """
            CREATE TABLE IF NOT EXISTS users (
                id BIGSERIAL PRIMARY KEY,
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
            """;

        executeSQL(createUserTable);
    }

    public void seedDatabase() {
        // language: sql
        String insertSampleData = """
            INSERT INTO users (username, email, password_hash, is_verified) VALUES
            ('john_doe', 'john@example.com', '$2a$10$...', true),
            ('jane_smith', 'jane@example.com', '$2a$10$...', true),
            ('bob_wilson', 'bob@example.com', '$2a$10$...', false);

            INSERT INTO posts (user_id, title, content, published_at) VALUES
            (1, 'First Post', 'This is my first post!', CURRENT_TIMESTAMP),
            (1, 'Second Post', 'Another great post.', CURRENT_TIMESTAMP),
            (2, 'Hello World', 'Welcome to my blog.', CURRENT_TIMESTAMP);
            """;

        executeSQL(insertSampleData);
    }

    public List<User> searchUsers(String searchTerm) {
        // language: sql
        String searchQuery = """
            SELECT
                u.id,
                u.username,
                u.email,
                ts_rank(
                    to_tsvector('english', u.username || ' ' || COALESCE(p.bio, '')),
                    plainto_tsquery('english', ?)
                ) as rank
            FROM users u
            LEFT JOIN user_profiles p ON u.id = p.user_id
            WHERE to_tsvector('english', u.username || ' ' || COALESCE(p.bio, ''))
                @@ plainto_tsquery('english', ?)
            ORDER BY rank DESC
            LIMIT 50
            """;

        return executeQuery(searchQuery, searchTerm, searchTerm);
    }

    public String generateReport(Long userId) {
        // language: html
        String reportTemplate = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>User Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #4CAF50; color: white; }
                </style>
            </head>
            <body>
                <h1>User Activity Report</h1>
                <div id="report-data"></div>
            </body>
            </html>
            """;

        return reportTemplate;
    }

    public void configureApplication() {
        // language: json
        String config = """
            {
                "server": {
                    "port": 8080,
                    "ssl": {
                        "enabled": true,
                        "keystore": "/path/to/keystore.jks"
                    }
                },
                "logging": {
                    "level": "INFO",
                    "file": "/var/log/myapp.log"
                }
            }
            """;

        loadConfig(config);
    }
}

// =============================================================================
// Pattern 5: Single-line string field declaration
// =============================================================================

@Service
public class QueryService {

    // language: sql
    public static final String SIMPLE_USER_QUERY = "SELECT id, username, email FROM users WHERE id = ?";

    // language: sql
    public static final String COUNT_USERS = "SELECT COUNT(*) FROM users WHERE status = 'active'";

    // language: sql
    public static final String DELETE_INACTIVE = "DELETE FROM users WHERE last_login < NOW() - INTERVAL '1 year'";

    // language: sql
    private static final String UPDATE_STATUS = "UPDATE users SET status = ? WHERE id = ?";

    // language: sql
    private static final String FIND_BY_EMAIL = "SELECT * FROM users WHERE LOWER(email) = LOWER(?)";

    public User findUserById(Long id) {
        return jdbcTemplate.queryForObject(SIMPLE_USER_QUERY, new Object[]{id}, new UserRowMapper());
    }

    public int countActiveUsers() {
        return jdbcTemplate.queryForObject(COUNT_USERS, Integer.class);
    }
}
