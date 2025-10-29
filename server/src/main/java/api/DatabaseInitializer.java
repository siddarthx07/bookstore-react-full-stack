package api;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import business.JdbcUtils;

import java.sql.Connection;
import java.sql.Statement;

@WebListener
public class DatabaseInitializer implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            initializeDatabase();
            System.out.println("Database initialized successfully");
        } catch (Exception e) {
            System.err.println("Failed to initialize database: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void initializeDatabase() throws Exception {
        try (Connection connection = JdbcUtils.getConnection()) {
            // Check if tables already exist
            boolean tablesExist = checkTablesExist(connection);

            System.out.println("Ensuring database schema is up to date...");
            createTables(connection);

            if (!tablesExist) {
                insertInitialData(connection);
                System.out.println("Database schema and initial data created successfully");
            } else {
                System.out.println("Database tables already exist");
            }
        }
    }

    private boolean checkTablesExist(Connection connection) throws Exception {
        try (Statement stmt = connection.createStatement();
             java.sql.ResultSet rs = stmt.executeQuery("SHOW TABLES")) {
            return rs.next();
        } catch (Exception e) {
            // If SHOW TABLES fails, tables don't exist (probably H2)
            System.out.println("SHOW TABLES failed: " + e.getMessage());
            return false;
        }
    }

    private void createTables(Connection connection) throws Exception {
        String schema = """
            CREATE TABLE IF NOT EXISTS `customer` (
                `customer_id` INT UNSIGNED AUTO_INCREMENT,
                `name` VARCHAR(45) NOT NULL,
                `address` VARCHAR(45) NOT NULL,
                `phone` VARCHAR(45) NOT NULL,
                `email` VARCHAR(45) NOT NULL,
                `cc_number` VARCHAR(19) NOT NULL,
                `cc_exp_date` DATE NOT NULL,
                PRIMARY KEY (`customer_id`)
            );
            
            CREATE TABLE IF NOT EXISTS `account` (
                `account_id` INT UNSIGNED AUTO_INCREMENT,
                `full_name` VARCHAR(100) NOT NULL,
                `email` VARCHAR(255) NOT NULL,
                `password_hash` VARCHAR(255) NOT NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`account_id`),
                UNIQUE KEY `uk_account_email` (`email`)
            );
            
            CREATE TABLE IF NOT EXISTS `category` (
                `category_id` INT UNSIGNED AUTO_INCREMENT,
                `name` VARCHAR(45) NOT NULL,
                PRIMARY KEY (`category_id`)
            );
            
            CREATE TABLE IF NOT EXISTS `book` (
                `book_id` INT UNSIGNED AUTO_INCREMENT,
                `title` VARCHAR(60) NOT NULL,
                `author` VARCHAR(60) NOT NULL,
                `description` TEXT NOT NULL,
                `price` DECIMAL(10,2) NOT NULL,
                `rating` INT UNSIGNED NOT NULL,
                `is_public` BOOLEAN NOT NULL,
                `is_featured` BOOLEAN NOT NULL,
                `category_id` INT UNSIGNED,
                PRIMARY KEY (`book_id`),
                FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`)
            );
            
            CREATE TABLE IF NOT EXISTS `customer_order` (
                `customer_order_id` INT UNSIGNED AUTO_INCREMENT,
                `amount` DECIMAL(10,2) NOT NULL,
                `date_created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `confirmation_number` INT UNSIGNED NOT NULL,
                `customer_id` INT UNSIGNED,
                PRIMARY KEY (`customer_order_id`),
                FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
            );
            
            CREATE TABLE IF NOT EXISTS `customer_order_line_item` (
                `customer_order_id` INT UNSIGNED,
                `book_id` INT UNSIGNED,
                `quantity` SMALLINT UNSIGNED DEFAULT 1,
                PRIMARY KEY (`customer_order_id`, `book_id`),
                FOREIGN KEY (`customer_order_id`) REFERENCES `customer_order`(`customer_order_id`),
                FOREIGN KEY (`book_id`) REFERENCES `book`(`book_id`)
            );
            """;

        try (Statement stmt = connection.createStatement()) {
            for (String sql : schema.split(";")) {
                sql = sql.trim();
                if (!sql.isEmpty()) {
                    stmt.execute(sql);
                }
            }
        }
    }

    private void insertInitialData(Connection connection) throws Exception {
        String data = """
            INSERT INTO `category` (`name`) VALUES
                ('Romance'),
                ('Fantasy'),
                ('Thriller'),
                ('Horror');
            
            INSERT INTO `book` (title, author, description, price, rating, is_public, is_featured, category_id) VALUES
                ('Twisted Love', 'Ana Huang', 'A steamy romance about love and betrayal.', 24.00, 5, TRUE, FALSE, 1),
                ('The Friend Zone', 'Kristen Callihan', 'A heartwarming romantic comedy.', 24.00, 5, TRUE, FALSE, 1),
                ('Reminders of Him', 'Colleen Hoover', 'A moving story of redemption.', 24.00, 5, FALSE, TRUE, 1),
                ('November 9', 'Colleen Hoover', 'A romance set on a single day each year.', 24.00, 5, TRUE, FALSE, 1),
                ('King of Wrath', 'Ana Huang', 'A billionaire romance novel.', 24.00, 5, FALSE, TRUE, 1),
                ('Twisted Lies', 'Ana Huang', 'A story of deception and love.', 24.00, 5, TRUE, FALSE, 1),
                ('Your Fault', 'Ana Huang', 'A second-chance romance.', 24.00, 5, FALSE, TRUE, 1),
                ('Finding Perfect', 'Colleen Hoover', 'A novella about love and sacrifice.', 24.00, 5, TRUE, FALSE, 1),
                ('The Name of the Wind', 'Patrick Rothfuss', 'A legendary fantasy epic.', 14.00, 5, TRUE, FALSE, 2),
                ('The Priory of the Orange Tree', 'Samantha Shannon', 'A feminist fantasy novel.', 19.00, 5, FALSE, TRUE, 2),
                ('Shadow and Bone', 'Leigh Bardugo', 'A fantasy adventure in the Grishaverse.', 12.00, 5, TRUE, FALSE, 2),
                ('The Way of Kings', 'Brandon Sanderson', 'An epic fantasy saga.', 22.00, 5, TRUE, FALSE, 2),
                ('A Court of Thorns and Roses', 'Sarah J. Maas', 'A mix of fantasy and romance.', 18.00, 5, FALSE, TRUE, 2),
                ('The Silent Patient', 'Alex Michaelides', 'A psychological thriller.', 13.00, 5, TRUE, FALSE, 3),
                ('The Girl with the Dragon Tattoo', 'Stieg Larsson', 'A crime thriller with a dark edge.', 9.00, 5, FALSE, TRUE, 3),
                ('Before I Go to Sleep', 'S.J. Watson', 'A psychological mystery thriller.', 8.00, 5, TRUE, FALSE, 3),
                ('The Woman in the Window', 'A.J. Finn', 'A suspenseful thriller.', 10.00, 5, FALSE, TRUE, 3),
                ('The Chain', 'Adrian McKinty', 'A novel about a horrifying ransom chain.', 15.00, 5, TRUE, FALSE, 3),
                ('The Shining', 'Stephen King', 'A classic horror novel.', 11.00, 5, TRUE, FALSE, 4),
                ('House of Leaves', 'Mark Z. Danielewski', 'A mind-bending horror story.', 16.00, 5, FALSE, TRUE, 4),
                ('Bird Box', 'Josh Malerman', 'A post-apocalyptic horror thriller.', 10.00, 5, TRUE, FALSE, 4),
                ('The Exorcist', 'William Peter Blatty', 'A terrifying horror masterpiece.', 13.00, 5, FALSE, TRUE, 4),
                ('Mexican Gothic', 'Silvia Moreno-Garcia', 'A gothic horror novel.', 14.00, 5, TRUE, FALSE, 4);
            """;

        try (Statement stmt = connection.createStatement()) {
            for (String sql : data.split(";")) {
                sql = sql.trim();
                if (!sql.isEmpty()) {
                    try {
                        stmt.execute(sql);
                    } catch (Exception e) {
                        System.out.println("Warning: Could not execute SQL: " + sql);
                        System.out.println("Error: " + e.getMessage());
                    }
                }
            }
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Cleanup if needed
    }
}
