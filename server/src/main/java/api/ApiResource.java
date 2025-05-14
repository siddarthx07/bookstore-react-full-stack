package api;

import business.ApplicationContext;
import business.category.Category;
import business.category.CategoryDao;
import business.book.Book;
import business.book.BookDao;
import business.order.OrderService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.Consumes;
import business.order.OrderDetails;
import business.order.OrderForm;
import java.util.List;

@Path("/")
public class ApiResource {

    private final BookDao bookDao = ApplicationContext.getInstance().getBookDao();
    private final CategoryDao categoryDao = ApplicationContext.getInstance().getCategoryDao();
    private final OrderService orderService = ApplicationContext.INSTANCE.getOrderService();

    @GET
    @Path("categories")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Category> categories(@Context HttpServletRequest httpRequest) {
        return categoryDao.findAll();
    }

    @GET
    @Path("categories/{category-id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Category categoryById(@PathParam("category-id") long categoryId,
                                 @Context HttpServletRequest httpRequest) {
        Category result = categoryDao.findByCategoryId(categoryId);
        if (result == null) {
            throw new ApiException(String.format("No such category id: %d", categoryId));
        }
        return result;
    }

    @GET
    @Path("books/{book-id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Book bookById(@PathParam("book-id") long bookId,
                         @Context HttpServletRequest httpRequest) {
        Book result = bookDao.findByBookId(bookId);
        if (result == null) {
            throw new ApiException(String.format("No such book id: %d", bookId));
        }
        return result;
    }

    @GET
    @Path("categories/{category-id}/books")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Book> booksByCategoryId(@PathParam("category-id") long categoryId,
                                        @Context HttpServletRequest httpRequest) {
        Category category = categoryDao.findByCategoryId(categoryId);
        if (category == null) {
            throw new ApiException(String.format("No such category id: %d", categoryId));
        }
        return bookDao.findByCategoryId(category.categoryId());
    }

    @GET
    @Path("categories/{category-id}/suggested-books")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Book> suggestedBooks(@PathParam("category-id") long categoryId,
                                     @QueryParam("limit") @DefaultValue("3") int limit,
                                     @Context HttpServletRequest request) {
        return bookDao.findRandomByCategoryId(categoryId, limit);
    }

    @GET
    @Path("categories/name/{category-name}")
    @Produces(MediaType.APPLICATION_JSON)
    public Category categoryByName(@PathParam("category-name") String categoryName,
                                   @Context HttpServletRequest httpRequest) {
        Category result = categoryDao.findByCategoryName(categoryName);
        if (result == null) {
            throw new ApiException(String.format("No such category name: %s", categoryName));
        }
        return result;
    }

    @GET
    @Path("categories/name/{category-name}/books")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Book> booksByCategoryName(@PathParam("category-name") String categoryName,
                                          @Context HttpServletRequest httpRequest) {
        Category category = categoryDao.findByCategoryName(categoryName);
        if (category == null) {
            throw new ApiException(String.format("No such category name: %s", categoryName));
        }
        return bookDao.findByCategoryId(category.categoryId());
    }

    @GET
    @Path("categories/name/{category-name}/suggested-books")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Book> suggestedBooksByCategoryName(@PathParam("category-name") String categoryName,
                                                   @QueryParam("limit") @DefaultValue("3") int limit,
                                                   @Context HttpServletRequest request) {
        Category category = categoryDao.findByCategoryName(categoryName);
        if (category == null) {
            throw new ApiException(String.format("No such category name: %s", categoryName));
        }
        return bookDao.findRandomByCategoryId(category.categoryId(), limit);
    }
    
    @POST
    @Path("orders")
    @Consumes(jakarta.ws.rs.core.MediaType.APPLICATION_JSON)
    @Produces(jakarta.ws.rs.core.MediaType.APPLICATION_JSON)
    public OrderDetails placeOrder(OrderForm orderForm) {
        System.out.println("===== PROCESSING ORDER =====");
        try {
            // First validate the input
            System.out.println("Checking if orderForm is null: " + (orderForm == null));
            if (orderForm == null) {
                throw new ApiException.ValidationFailure("Order form is null");
            }
            
            System.out.println("Checking if customerForm is null: " + (orderForm.getCustomerForm() == null));
            if (orderForm.getCustomerForm() == null) {
                throw new ApiException.ValidationFailure("Customer form is null");
            }
            
            System.out.println("Checking if cart is null: " + (orderForm.getCart() == null));
            if (orderForm.getCart() == null) {
                throw new ApiException.ValidationFailure("Cart is null");
            }
            
            // Run the full validation in OrderService
            System.out.println("Running full validation in OrderService");
            try {
                // Process the order and get the order ID
                System.out.println("Processing order");
                long orderId = orderService.placeOrder(orderForm.getCustomerForm(), orderForm.getCart());
                
                // Check if order was successful
                if (orderId > 0) {
                    return orderService.getOrderDetails(orderId);
                } else {
                    throw new ApiException.ValidationFailure("Unknown error occurred");
                }
            } catch (ApiException.ValidationFailure e) {
                // Rethrow validation failures from OrderService
                System.out.println("Validation failed: " + e.getMessage());
                throw e;
            }
            
        } catch (ApiException.ValidationFailure e) {
            // Just rethrow validation failures
            System.out.println("Caught ValidationFailure: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            // Log and wrap other exceptions
            System.out.println("Caught unexpected exception: " + e.getClass().getName());
            System.out.println("Exception message: " + e.getMessage());
            e.printStackTrace();
            throw new ApiException("order placement failed", e);
        } finally {
            System.out.println("===== ORDER PROCESSING COMPLETE =====");
        }
    }
}
