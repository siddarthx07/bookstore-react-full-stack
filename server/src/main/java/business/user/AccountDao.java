package business.user;

public interface AccountDao {
    Account findByEmail(String email);
    Account findById(long accountId);
    Account create(String fullName, String email, String passwordHash);
}
