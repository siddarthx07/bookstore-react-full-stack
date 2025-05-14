package business;

import business.book.BookDao;
import business.book.BookDaoJdbc;
import business.category.CategoryDao;
import business.category.CategoryDaoJdbc;
import business.customer.CustomerDao;
import business.customer.CustomerDaoJdbc;
import business.order.LineItemDao;
import business.order.LineItemDaoJdbc;
import business.order.OrderDao;
import business.order.OrderDaoJdbc;
import business.order.OrderService;
import business.order.DefaultOrderService;

public class ApplicationContext {

    public static final ApplicationContext INSTANCE = new ApplicationContext();

    private final CategoryDao categoryDao;
    private final BookDao bookDao;
    private final CustomerDao customerDao;
    private final OrderDao orderDao;
    private final LineItemDao lineItemDao;
    private final OrderService orderService;

    private ApplicationContext() {
        this.categoryDao = new CategoryDaoJdbc();
        this.bookDao = new BookDaoJdbc();
        this.customerDao = new CustomerDaoJdbc();
        this.orderDao = new OrderDaoJdbc();
        this.lineItemDao = new LineItemDaoJdbc();
        orderService = new DefaultOrderService();
        
        // Wire in all the DAOs to the OrderService
        ((DefaultOrderService)orderService).setBookDao(bookDao);
        ((DefaultOrderService)orderService).setCustomerDao(customerDao);
        ((DefaultOrderService)orderService).setOrderDao(orderDao);
        ((DefaultOrderService)orderService).setLineItemDao(lineItemDao);
    }

    public static ApplicationContext getInstance() {
        return INSTANCE;
    }

    public CategoryDao getCategoryDao() {
        return categoryDao;
    }

    public BookDao getBookDao() {
        return bookDao;
    }
    
    public CustomerDao getCustomerDao() {
        return customerDao;
    }
    
    public OrderDao getOrderDao() {
        return orderDao;
    }
    
    public LineItemDao getLineItemDao() {
        return lineItemDao;
    }
    
    public OrderService getOrderService() {
        return orderService;
    }
}
