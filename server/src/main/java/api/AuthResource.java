package api;

import business.ApplicationContext;
import business.user.Account;
import business.user.AccountDao;
import business.BookstoreDbException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mindrot.jbcrypt.BCrypt;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    public static final String SESSION_USER_ID = "auth.userId";
    public static final String SESSION_USER_NAME = "auth.fullName";
    public static final String SESSION_USER_EMAIL = "auth.email";

    private final AccountDao accountDao = ApplicationContext.getInstance().getAccountDao();

    public record LoginRequest(String email, String password) {}
    public record RegisterRequest(String fullName, String email, String password) {}
    public record AuthResponse(long accountId, String fullName, String email, boolean guest) {}
    public record StatusResponse(boolean authenticated, AuthResponse user) {}
    public record MessageResponse(String message) {}

    @POST
    @Path("login")
    public Response login(LoginRequest request, @Context HttpServletRequest httpRequest) {
        validateLoginRequest(request);

        Account account = accountDao.findByEmail(request.email().toLowerCase().trim());
        if (account == null || !BCrypt.checkpw(request.password(), account.passwordHash())) {
            throw new ApiException.ValidationFailure("Invalid email or password");
        }

        establishSession(httpRequest, account.accountId(), account.fullName(), account.email(), false);
        return Response.ok(toAuthResponse(account, false)).build();
    }

    @POST
    @Path("register")
    public Response register(RegisterRequest request, @Context HttpServletRequest httpRequest) {
        validateRegisterRequest(request);

        String normalizedEmail = request.email().toLowerCase().trim();
        if (accountDao.findByEmail(normalizedEmail) != null) {
            throw new ApiException.ValidationFailure("An account with that email already exists");
        }

        String passwordHash = BCrypt.hashpw(request.password(), BCrypt.gensalt(10));
        Account account;
        try {
            account = accountDao.create(request.fullName().trim(), normalizedEmail, passwordHash);
        } catch (BookstoreDbException e) {
            throw new ApiException.ValidationFailure("Unable to create account right now. Please try again.");
        }
        establishSession(httpRequest, account.accountId(), account.fullName(), account.email(), false);
        return Response.status(Response.Status.CREATED).entity(toAuthResponse(account, false)).build();
    }

    @POST
    @Path("logout")
    public Response logout(@Context HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return Response.ok(new MessageResponse("Signed out")).build();
    }

    @POST
    @Path("guest")
    public Response guest(@Context HttpServletRequest httpRequest) {
        establishSession(httpRequest, -1L, "Guest", "guest@storyspark", true);
        return Response.ok(new AuthResponse(-1L, "Guest", "guest@storyspark", true)).build();
    }

    @GET
    @Path("status")
    public Response status(@Context HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null && session.getAttribute(SESSION_USER_ID) != null) {
            AuthResponse user = new AuthResponse(
                    (long) session.getAttribute(SESSION_USER_ID),
                    (String) session.getAttribute(SESSION_USER_NAME),
                    (String) session.getAttribute(SESSION_USER_EMAIL),
                    Boolean.TRUE.equals(session.getAttribute("auth.guest"))
            );
            return Response.ok(new StatusResponse(true, user)).build();
        }
        return Response.ok(new StatusResponse(false, null)).build();
    }

    private void establishSession(HttpServletRequest httpRequest, long accountId, String fullName, String email, boolean guest) {
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute(SESSION_USER_ID, accountId);
        session.setAttribute(SESSION_USER_NAME, fullName);
        session.setAttribute(SESSION_USER_EMAIL, email);
        session.setAttribute("auth.guest", guest);
        session.setMaxInactiveInterval(60 * 60); // 1 hour
    }

    private AuthResponse toAuthResponse(Account account, boolean guest) {
        return new AuthResponse(account.accountId(), account.fullName(), account.email(), guest);
    }

    private void validateLoginRequest(LoginRequest request) {
        if (request == null || isBlank(request.email()) || isBlank(request.password())) {
            throw new ApiException.ValidationFailure("Email and password are required");
        }
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request == null) {
            throw new ApiException.ValidationFailure("Registration details are required");
        }
        if (isBlank(request.fullName()) || request.fullName().trim().length() < 2) {
            throw new ApiException.ValidationFailure("Please provide your full name");
        }
        if (isBlank(request.email())) {
            throw new ApiException.ValidationFailure("Email is required");
        }
        if (isBlank(request.password()) || request.password().length() < 6) {
            throw new ApiException.ValidationFailure("Password must be at least 6 characters long");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
