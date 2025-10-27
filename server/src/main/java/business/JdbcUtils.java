package business;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
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
        // Check if we're in a Railway or cloud environment
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl != null && !dbUrl.isEmpty()) {
            return getDataSourceFromEnvironment();
        }
        
        // Try JNDI lookup for traditional deployment
        try {
            return getDataSourceFromJndi(JDBC_BOOKSTORE);
        } catch (Exception e) {
            // If JNDI fails, fall back to H2 in-memory database
            System.out.println("JNDI lookup failed, falling back to H2 in-memory database");
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
            
            String dbUrl = System.getenv("DATABASE_URL");
            String dbUser = System.getenv("DATABASE_USER");
            String dbPassword = System.getenv("DATABASE_PASSWORD");
            
            if (dbUrl == null || dbUrl.isEmpty()) {
                // Use H2 in-memory database as fallback
                ds.setUrl("jdbc:h2:mem:bookstore;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL");
                ds.setDriverClassName("org.h2.Driver");
                ds.setUsername("sa");
                ds.setPassword("");
            } else {
                // Parse connection URL
                if (dbUrl.startsWith("jdbc:mysql://")) {
                    ds.setUrl(dbUrl);
                    ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
                    if (dbUser != null) ds.setUsername(dbUser);
                    if (dbPassword != null) ds.setPassword(dbPassword);
                } else if (dbUrl.startsWith("mysql://")) {
                    // Parse Railway format: mysql://user:pass@host:port/db
                    String connectionString = dbUrl.replace("mysql://", "");
                    int slashIndex = connectionString.indexOf('/');
                    
                    if (slashIndex != -1) {
                        String credentials = connectionString.substring(0, slashIndex);
                        String dbName = connectionString.substring(slashIndex + 1);
                        
                        int atIndex = credentials.indexOf('@');
                        if (atIndex != -1) {
                            String userPass = credentials.substring(0, atIndex);
                            String hostPort = credentials.substring(atIndex + 1);
                            
                            int colonIndex = userPass.indexOf(':');
                            if (colonIndex != -1) {
                                String user = userPass.substring(0, colonIndex);
                                String password = userPass.substring(colonIndex + 1);
                                
                                ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
                                ds.setUsername(user);
                                ds.setPassword(password);
                                ds.setUrl(String.format("jdbc:mysql://%s/%s?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true", 
                                        hostPort, dbName));
                            }
                        }
                    }
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
}
