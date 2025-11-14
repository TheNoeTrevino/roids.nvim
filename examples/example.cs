using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace ExampleApp
{
    public class InjectionExamples
    {
        // =====================================================================
        // Pattern 1: Raw string literals (C# 11+) with language hints
        // =====================================================================

        // language: sql
        private static readonly string GetUsersQuery = """
            SELECT
                u.Id,
                u.Username,
                u.Email,
                u.CreatedAt,
                u.UpdatedAt
            FROM Users u
            WHERE u.DeletedAt IS NULL
            AND u.Status = 'Active'
            ORDER BY u.CreatedAt DESC
            """;

        // language: sql
        private const string InsertUserQuery = """
            INSERT INTO Users (
                Username,
                Email,
                PasswordHash,
                CreatedAt
            )
            VALUES (
                @Username,
                @Email,
                @PasswordHash,
                GETDATE()
            );
            SELECT CAST(SCOPE_IDENTITY() as int);
            """;

        // language: sql
        private const string ComplexJoinQuery = """
            WITH RecentPosts AS (
                SELECT
                    p.Id,
                    p.UserId,
                    p.Title,
                    p.CreatedAt,
                    ROW_NUMBER() OVER (PARTITION BY p.UserId ORDER BY p.CreatedAt DESC) as RowNum
                FROM Posts p
                WHERE p.PublishedAt IS NOT NULL
            )
            SELECT
                u.Id,
                u.Username,
                u.Email,
                rp.Title as LatestPostTitle,
                rp.CreatedAt as LatestPostDate,
                COUNT(f.Id) as FollowerCount
            FROM Users u
            LEFT JOIN RecentPosts rp ON u.Id = rp.UserId AND rp.RowNum = 1
            LEFT JOIN Followers f ON u.Id = f.FollowingId
            WHERE u.DeletedAt IS NULL
            GROUP BY u.Id, u.Username, u.Email, rp.Title, rp.CreatedAt
            HAVING COUNT(f.Id) > 10
            ORDER BY FollowerCount DESC
            """;

        // language: json
        private static readonly string DefaultConfig = """
            {
                "database": {
                    "host": "localhost",
                    "port": 1433,
                    "name": "MyAppDb",
                    "connectionTimeout": 30,
                    "commandTimeout": 60
                },
                "cache": {
                    "enabled": true,
                    "ttl": 3600,
                    "maxSize": 1000,
                    "provider": "Redis"
                },
                "features": {
                    "enableNotifications": true,
                    "enableAnalytics": false,
                    "betaFeatures": false
                }
            }
            """;

        // language: xml
        private const string SoapRequestTemplate = """
            <?xml version="1.0" encoding="UTF-8"?>
            <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                           xmlns:web="http://example.com/webservice">
                <soap:Header>
                    <web:Authentication>
                        <web:Username>{0}</web:Username>
                        <web:Token>{1}</web:Token>
                    </web:Authentication>
                </soap:Header>
                <soap:Body>
                    <web:GetUserDataRequest>
                        <web:UserId>{2}</web:UserId>
                        <web:IncludeProfile>true</web:IncludeProfile>
                    </web:GetUserDataRequest>
                </soap:Body>
            </soap:Envelope>
            """;

        // language: html
        private static readonly string EmailTemplate = """
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
                    <p>Dear {Username},</p>
                    <p>Thank you for creating an account with us.</p>
                    <a href="{VerificationLink}" class="button">Verify Your Email</a>
                </div>
            </body>
            </html>
            """;

        // language: graphql
        private const string GetUserQuery = """
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
        private static readonly string KubernetesConfig = """
            apiVersion: apps/v1
            kind: Deployment
            metadata:
              name: myapp
              namespace: production
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
                    - containerPort: 80
                    env:
                    - name: ASPNETCORE_ENVIRONMENT
                      value: "Production"
                    - name: ConnectionStrings__DefaultConnection
                      valueFrom:
                        secretKeyRef:
                          name: db-secret
                          key: connection-string
            """;

        // =====================================================================
        // Pattern 2: Verbatim strings (@"") with language hints
        // =====================================================================

        // language: sql
        private static readonly string GetUserByEmailQuery =
            @"
            SELECT
                u.Id,
                u.Username,
                u.Email,
                u.PasswordHash,
                u.IsVerified,
                u.CreatedAt
            FROM Users u
            WHERE u.Email = @Email
            AND u.DeletedAt IS NULL";

        // language: sql
        private const string UpdateUserQuery =
            @"
            UPDATE Users
            SET
                Username = @Username,
                Email = @Email,
                UpdatedAt = GETDATE()
            WHERE Id = @UserId
            AND DeletedAt IS NULL";

        // language: sql
        private static readonly string CreateTablesScript =
            @"
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
            BEGIN
                CREATE TABLE Users (
                    Id INT IDENTITY(1,1) PRIMARY KEY,
                    Username NVARCHAR(50) UNIQUE NOT NULL,
                    Email NVARCHAR(100) UNIQUE NOT NULL,
                    PasswordHash NVARCHAR(255) NOT NULL,
                    IsVerified BIT DEFAULT 0,
                    CreatedAt DATETIME2 DEFAULT GETDATE(),
                    UpdatedAt DATETIME2 DEFAULT GETDATE(),
                    DeletedAt DATETIME2 NULL
                );

                CREATE INDEX IX_Users_Email ON Users(Email);
                CREATE INDEX IX_Users_Username ON Users(Username);
            END

            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Posts')
            BEGIN
                CREATE TABLE Posts (
                    Id INT IDENTITY(1,1) PRIMARY KEY,
                    UserId INT NOT NULL,
                    Title NVARCHAR(200) NOT NULL,
                    Content NVARCHAR(MAX),
                    Slug NVARCHAR(250) UNIQUE NOT NULL,
                    PublishedAt DATETIME2 NULL,
                    CreatedAt DATETIME2 DEFAULT GETDATE(),
                    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
                );

                CREATE INDEX IX_Posts_UserId ON Posts(UserId);
                CREATE INDEX IX_Posts_Slug ON Posts(Slug);
            END";

        // language: json
        private const string AppSettingsJson =
            @"{
            ""Logging"": {
                ""LogLevel"": {
                    ""Default"": ""Information"",
                    ""Microsoft"": ""Warning""
                }
            },
            ""AllowedHosts"": ""*"",
            ""ConnectionStrings"": {
                ""DefaultConnection"": ""Server=localhost;Database=MyApp;Trusted_Connection=True;""
            }
        }";

        // language: xml
        private static readonly string WebConfigXml =
            @"<?xml version=""1.0"" encoding=""utf-8""?>
            <configuration>
                <appSettings>
                    <add key=""Environment"" value=""Production"" />
                    <add key=""MaxRequestSize"" value=""10485760"" />
                </appSettings>
                <connectionStrings>
                    <add name=""DefaultConnection""
                         connectionString=""Server=localhost;Database=MyApp;Integrated Security=True;""
                         providerName=""System.Data.SqlClient"" />
                </connectionStrings>
            </configuration>";

        // =====================================================================
        // Pattern 3: Method-level string literals with language hints
        // =====================================================================

        public IEnumerable<User> GetActiveUsers()
        {
            // language: sql
            string query = """
                SELECT
                    Id,
                    Username,
                    Email,
                    CreatedAt
                FROM Users
                WHERE Status = 'Active'
                AND DeletedAt IS NULL
                ORDER BY CreatedAt DESC
                """;

            return ExecuteQuery<User>(query);
        }

        public void CreateUser(string username, string email, string passwordHash)
        {
            // language: sql
            string insertCommand = """
                INSERT INTO Users (Username, Email, PasswordHash, CreatedAt)
                VALUES (@Username, @Email, @PasswordHash, GETDATE());
                SELECT CAST(SCOPE_IDENTITY() as int);
                """;

            ExecuteNonQuery(
                insertCommand,
                new
                {
                    Username = username,
                    Email = email,
                    PasswordHash = passwordHash,
                }
            );
        }

        public string GenerateEmailHtml(string username, string verificationLink)
        {
            // language: html
            string template = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        .email-body { padding: 20px; font-family: Arial, sans-serif; }
                        .button { background-color: #28a745; color: white; padding: 10px 20px; }
                    </style>
                </head>
                <body>
                    <div class="email-body">
                        <h1>Hello {0}!</h1>
                        <p>Please verify your email address.</p>
                        <a href="{1}" class="button">Verify Email</a>
                    </div>
                </body>
                </html>
                """;

            return string.Format(template, username, verificationLink);
        }

        public void MigrateDatabase()
        {
            // language: sql
            string migrationScript = """
                BEGIN TRANSACTION;

                ALTER TABLE Users ADD PhoneNumber NVARCHAR(20) NULL;
                ALTER TABLE Users ADD LastLogin DATETIME2 NULL;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserSessions')
                BEGIN
                    CREATE TABLE UserSessions (
                        Id INT IDENTITY(1,1) PRIMARY KEY,
                        UserId INT NOT NULL,
                        Token NVARCHAR(255) UNIQUE NOT NULL,
                        ExpiresAt DATETIME2 NOT NULL,
                        CreatedAt DATETIME2 DEFAULT GETDATE(),
                        FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
                    );

                    CREATE INDEX IX_UserSessions_UserId ON UserSessions(UserId);
                    CREATE INDEX IX_UserSessions_Token ON UserSessions(Token);
                END

                COMMIT TRANSACTION;
                """;

            ExecuteNonQuery(migrationScript);
        }

        // =====================================================================
        // Pattern 4: Property initializers with language hints
        // =====================================================================

        public class QueryRepository
        {
            // language: sql
            public string FindAllQuery { get; } =
                """
                    SELECT * FROM Users
                    WHERE DeletedAt IS NULL
                    ORDER BY CreatedAt DESC
                    """;

            // language: sql
            public string FindByIdQuery { get; } =
                @"
                SELECT * FROM Users
                WHERE Id = @Id
                AND DeletedAt IS NULL";

            // language: sql
            public string SearchUsersQuery { get; } =
                """
                    SELECT
                        u.Id,
                        u.Username,
                        u.Email
                    FROM Users u
                    WHERE (u.Username LIKE @SearchTerm OR u.Email LIKE @SearchTerm)
                    AND u.DeletedAt IS NULL
                    ORDER BY u.Username
                    """;
        }

        // =====================================================================
        // Pattern 5: LINQ and GraphQL queries
        // =====================================================================

        public async Task<object> ExecuteGraphQLQuery(string userId)
        {
            // language: graphql
            string mutation = """
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
                """;

            return await GraphQLClient.ExecuteAsync(mutation, new { userId });
        }

        // =====================================================================
        // Helper methods
        // =====================================================================

        private IEnumerable<T> ExecuteQuery<T>(string query)
        {
            // Implementation would go here
            throw new NotImplementedException();
        }

        private void ExecuteNonQuery(string command, object parameters = null)
        {
            // Implementation would go here
            throw new NotImplementedException();
        }
    }

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
