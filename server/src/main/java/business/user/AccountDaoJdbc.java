package business.user;

import business.BookstoreDbException;
import business.JdbcUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class AccountDaoJdbc implements AccountDao {

    private static final String FIND_BY_EMAIL_SQL =
            "SELECT account_id, full_name, email, password_hash FROM account WHERE email = ?";

    private static final String FIND_BY_ID_SQL =
            "SELECT account_id, full_name, email, password_hash FROM account WHERE account_id = ?";

    private static final String INSERT_SQL =
            "INSERT INTO account(full_name, email, password_hash) VALUES(?, ?, ?)";

    @Override
    public Account findByEmail(String email) {
        try (Connection connection = JdbcUtils.getConnection();
             PreparedStatement statement = connection.prepareStatement(FIND_BY_EMAIL_SQL)) {
            statement.setString(1, email);
            try (ResultSet rs = statement.executeQuery()) {
                if (rs.next()) {
                    return readAccount(rs);
                }
            }
            return null;
        } catch (SQLException e) {
            throw new BookstoreDbException.BookstoreQueryDbException("Encountered a problem finding account by email", e);
        }
    }

    @Override
    public Account findById(long accountId) {
        try (Connection connection = JdbcUtils.getConnection();
             PreparedStatement statement = connection.prepareStatement(FIND_BY_ID_SQL)) {
            statement.setLong(1, accountId);
            try (ResultSet rs = statement.executeQuery()) {
                if (rs.next()) {
                    return readAccount(rs);
                }
            }
            return null;
        } catch (SQLException e) {
            throw new BookstoreDbException.BookstoreQueryDbException("Encountered a problem finding account by id", e);
        }
    }

    @Override
    public Account create(String fullName, String email, String passwordHash) {
        try (Connection connection = JdbcUtils.getConnection();
             PreparedStatement statement = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, fullName);
            statement.setString(2, email);
            statement.setString(3, passwordHash);
            statement.executeUpdate();
            try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    long accountId = generatedKeys.getLong(1);
                    return new Account(accountId, fullName, email, passwordHash);
                } else {
                    throw new BookstoreDbException.BookstoreUpdateDbException("Creating account failed, no ID returned");
                }
            }
        } catch (SQLException e) {
            throw new BookstoreDbException.BookstoreUpdateDbException("Encountered a problem creating account", e);
        }
    }

    private Account readAccount(ResultSet rs) throws SQLException {
        long accountId = rs.getLong("account_id");
        String fullName = rs.getString("full_name");
        String email = rs.getString("email");
        String passwordHash = rs.getString("password_hash");
        return new Account(accountId, fullName, email, passwordHash);
    }
}
