package business;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Connection;
import java.sql.SQLException;
import business.BookstoreDbException.BookstoreConnectionDbException;

public class JdbcUtils {

    private static final String JDBC_BOOKSTORE = "jdbc/SiddarthBookstore";

    private static DataSource dataSource;

    public static Connection getConnection() {
        if (dataSource == null) {
            dataSource = getDataSource();
        }
        try {
            return dataSource.getConnection();
        } catch (SQLException e) {
            throw new BookstoreConnectionDbException("Encountered a SQL issue getting a connection", e);
        }
    }

    private static DataSource getDataSource() {
        if (isManagedDatabaseConfigured()) {
            return getDataSourceFromEnvironment();
        }

        try {
            return getDataSourceFromJndi(JDBC_BOOKSTORE);
        } catch (Exception e) {
            System.out.println("JNDI lookup failed, falling back to environment configuration or H2: " + e.getMessage());
            return getDataSourceFromEnvironment();
        }
    }

    private static DataSource getDataSourceFromJndi(String dataSourceName) {
        try {
            InitialContext initialContext = new InitialContext();
            Context context = (Context) initialContext.lookup("java:comp/env");
            return (DataSource) context.lookup(dataSourceName);
        } catch (NamingException e) {
            throw new IllegalArgumentException("Encountered an issue establishing an initial JNDI context", e);
        }
    }
    
    private static DataSource getDataSourceFromEnvironment() {
        try {
            org.apache.commons.dbcp2.BasicDataSource ds = new org.apache.commons.dbcp2.BasicDataSource();

            DatabaseCredentials credentials = resolveDatabaseCredentials();

            if (isBlank(credentials.url())) {
                ds.setUrl("jdbc:h2:mem:bookstore;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL");
                ds.setDriverClassName("org.h2.Driver");
                ds.setUsername("sa");
                ds.setPassword("");
            } else {
                ds.setUrl(credentials.url());
                ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
                if (!isBlank(credentials.username())) {
                    ds.setUsername(credentials.username());
                }
                if (!isBlank(credentials.password())) {
                    ds.setPassword(credentials.password());
                }
            }

            ds.setInitialSize(2);
            ds.setMaxTotal(10);
            ds.setMaxIdle(5);
            ds.setMinIdle(1);

            return ds;
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to create datasource from environment", e);
        }
    }

    private static boolean isManagedDatabaseConfigured() {
        return !isBlank(System.getenv("DATABASE_URL"))
                || !isBlank(System.getenv("JDBC_DATABASE_URL"))
                || !isBlank(System.getenv("MYSQL_URL"))
                || !isBlank(System.getenv("MYSQLHOST"));
    }

    private static DatabaseCredentials resolveDatabaseCredentials() throws URISyntaxException {
        String rawUrl = firstNonBlank(
                System.getenv("DATABASE_URL"),
                System.getenv("JDBC_DATABASE_URL"),
                System.getenv("MYSQL_URL")
        );

        String username = firstNonBlank(
                System.getenv("DATABASE_USER"),
                System.getenv("DATABASE_USERNAME"),
                System.getenv("JDBC_DATABASE_USERNAME"),
                System.getenv("MYSQLUSER")
        );

        String password = firstNonBlank(
                System.getenv("DATABASE_PASSWORD"),
                System.getenv("JDBC_DATABASE_PASSWORD"),
                System.getenv("MYSQLPASSWORD")
        );

        if (isBlank(rawUrl)) {
            String host = System.getenv("MYSQLHOST");
            String port = firstNonBlank(System.getenv("MYSQLPORT"), "3306");
            String database = System.getenv("MYSQLDATABASE");

            if (!isBlank(host) && !isBlank(database)) {
                rawUrl = String.format("jdbc:mysql://%s:%s/%s?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true", host, port, database);
                if (isBlank(username)) {
                    username = System.getenv("MYSQLUSER");
                }
                if (isBlank(password)) {
                    password = System.getenv("MYSQLPASSWORD");
                }
            }
        }

        if (!isBlank(rawUrl) && rawUrl.startsWith("mysql://")) {
            URI uri = new URI(rawUrl);
            String host = uri.getHost();
            int port = uri.getPort() <= 0 ? 3306 : uri.getPort();
            String path = uri.getPath();
            String database = path != null ? path.replaceFirst("^/", "") : "";

            if (isBlank(username) || isBlank(password)) {
                String userInfo = uri.getUserInfo();
                if (!isBlank(userInfo)) {
                    String[] parts = userInfo.split(":", 2);
                    if (parts.length > 0 && isBlank(username)) {
                        username = parts[0];
                    }
                    if (parts.length > 1 && isBlank(password)) {
                        password = parts[1];
                    }
                }
            }

            rawUrl = String.format("jdbc:mysql://%s:%d/%s?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true", host, port, database);
        }

        return new DatabaseCredentials(rawUrl, username, password);
    }

    private static String firstNonBlank(String... values) {
        if (values == null) {
            return null;
        }
        for (String value : values) {
            if (!isBlank(value)) {
                return value;
            }
        }
        return null;
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private record DatabaseCredentials(String url, String username, String password) {}
}
