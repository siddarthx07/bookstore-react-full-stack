package business.user;

public record Account(long accountId, String fullName, String email, String passwordHash) {}
