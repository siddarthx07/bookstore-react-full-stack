package business.order;

import api.ApiException;
import business.BookstoreDbException;
import business.JdbcUtils;
import business.book.Book;
import business.book.BookDao;
import business.cart.ShoppingCart;
import business.cart.ShoppingCartItem;
import business.customer.Customer;
import business.customer.CustomerDao;
import business.customer.CustomerForm;
import business.order.LineItemDao;
import business.order.OrderDao;

import java.sql.Connection;
import java.sql.SQLException;

import java.time.DateTimeException;
import java.time.YearMonth;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

public class DefaultOrderService implements OrderService {

	// Regex patterns from utils.tsx
	private static final Pattern US_MOBILE_PHONE_PATTERN = 
		Pattern.compile("^((\\+1|1)?( |-)?)?([2-9][0-9]{2}|\\([2-9][0-9]{2}\\))( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$");
	
	private static final Pattern EMAIL_PATTERN = 
		Pattern.compile("^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,24}))$");
	
	private static final Pattern CREDIT_CARD_PATTERN = 
		Pattern.compile("^(?:4[0-9]{12}(?:[0-9]{3,6})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12,15}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11}|6[27][0-9]{14}|^(81[0-9]{14,17}))$");

	private BookDao bookDao;
	private CustomerDao customerDao;
	private OrderDao orderDao;
	private LineItemDao lineItemDao;

	public void setBookDao(BookDao bookDao) {
		this.bookDao = bookDao;
	}
	
	public void setCustomerDao(CustomerDao customerDao) {
		this.customerDao = customerDao;
	}
	
	public void setOrderDao(OrderDao orderDao) {
		this.orderDao = orderDao;
	}
	
	public void setLineItemDao(LineItemDao lineItemDao) {
		this.lineItemDao = lineItemDao;
	}

	@Override
	public OrderDetails getOrderDetails(long orderId) {
		Order order = orderDao.findByOrderId(orderId);
		Customer customer = customerDao.findByCustomerId(order.customerId());
		List<LineItem> lineItems = lineItemDao.findByOrderId(orderId);
		List<Book> books = lineItems
			.stream()
			.map(lineItem -> bookDao.findByBookId(lineItem.bookId()))
			.toList();
		return new OrderDetails(order, customer, lineItems, books);
	}

	@Override
    public long placeOrder(CustomerForm customerForm, ShoppingCart cart) {
		System.out.println("DefaultOrderService.placeOrder called");
		System.out.println("CustomerForm: " + customerForm);
		System.out.println("ShoppingCart: " + cart);

		try {
			System.out.println("Validating customer...");
			validateCustomer(customerForm);
			System.out.println("Customer validation passed");
			
			System.out.println("Validating cart...");
			validateCart(cart);
			System.out.println("Cart validation passed");

			try (Connection connection = JdbcUtils.getConnection()) {
				Date ccExpDate = getCardExpirationDate(
						customerForm.getCcExpiryMonth(),
						customerForm.getCcExpiryYear());
				return performPlaceOrderTransaction(
						customerForm.getName(),
						customerForm.getAddress(),
						customerForm.getPhone(),
						customerForm.getEmail(),
						customerForm.getCcNumber(),
						ccExpDate, cart, connection);
			} catch (SQLException e) {
				throw new BookstoreDbException("Error during close connection for customer order", e);
			}
		} catch (ApiException.ValidationFailure e) {
			System.out.println("Validation failed: " + e.getMessage());
			if (e.getFieldName() != null) {
				System.out.println("Field name: " + e.getFieldName());
			}
			throw e;
		} catch (Exception e) {
			System.out.println("Unexpected exception in placeOrder: " + e.getClass().getName());
			System.out.println("Message: " + e.getMessage());
			e.printStackTrace();
			throw e;
		}
	}


	private void validateCustomer(CustomerForm customerForm) {
		System.out.println("Validating customer: " + customerForm);

    	String name = customerForm.getName();
		System.out.println("Validating name: " + name);

		// Name validation
		if (name == null || name.isEmpty()) {
			System.out.println("Name is null or empty");
			throw new ApiException.ValidationFailure("name", "Name is required");
		}
		if (name.length() < 4 || name.length() > 45) {
			System.out.println("Name length invalid: " + name.length());
			throw new ApiException.ValidationFailure("name", "Name must be between 4 and 45 characters");
		}

		// Address validation
		String address = customerForm.getAddress();
		if (address == null || address.isEmpty()) {
			throw new ApiException.ValidationFailure("address", "Address is required");
		}
		if (address.length() < 4 || address.length() > 45) {
			throw new ApiException.ValidationFailure("address", "Address must be between 4 and 45 characters");
		}

		// Phone validation
		String phone = customerForm.getPhone();
		if (phone == null || phone.isEmpty()) {
			throw new ApiException.ValidationFailure("phone", "Phone number is required");
		}
		// Use regex pattern from utils.tsx
		if (!US_MOBILE_PHONE_PATTERN.matcher(phone).matches()) {
			throw new ApiException.ValidationFailure("phone", "Phone number must contain exactly 10 digits");
		}

		// Email validation
		String email = customerForm.getEmail();
		if (email == null || email.isEmpty()) {
			throw new ApiException.ValidationFailure("email", "Email is required");
		}
		// Use regex pattern from utils.tsx
		if (!EMAIL_PATTERN.matcher(email).matches()) {
			// Check specific conditions to provide helpful error messages
			if (email.contains(" ")) {
				throw new ApiException.ValidationFailure("email", "Email cannot contain spaces");
			}
			if (!email.contains("@")) {
				throw new ApiException.ValidationFailure("email", "Email must contain @");
			}
			if (email.endsWith(".")) {
				throw new ApiException.ValidationFailure("email", "Email cannot end with a period");
			}
			// Generic error if none of the specific conditions match
			throw new ApiException.ValidationFailure("email", "Please enter a valid email address");
		}

		// Credit card validation
		String ccNumber = customerForm.getCcNumber();
		if (ccNumber == null || ccNumber.isEmpty()) {
			throw new ApiException.ValidationFailure("ccNumber", "Credit card number is required");
		}
		
		// Remove spaces and dashes for validation
		String cleanCcNumber = ccNumber.replaceAll("[\\s\\-]", "");
		
		// Check length requirement first (this is explicitly mentioned in the requirements)
		if (cleanCcNumber.length() < 14 || cleanCcNumber.length() > 16) {
			throw new ApiException.ValidationFailure("ccNumber", "Credit card number must be between 14 and 16 digits");
		}
		
		// Additional validation using the pattern from utils.tsx
		if (!CREDIT_CARD_PATTERN.matcher(cleanCcNumber).matches()) {
			throw new ApiException.ValidationFailure("ccNumber", "Please enter a valid credit card number");
		}

		// Expiry date validation
		if (expiryDateIsInvalid(customerForm.getCcExpiryMonth(), customerForm.getCcExpiryYear())) {
			throw new ApiException.ValidationFailure("Please enter a valid expiration date.");
		}
	}

	private boolean expiryDateIsInvalid(String ccExpiryMonth, String ccExpiryYear) {
		try {
			// Parse month and year to integers
			int month = Integer.parseInt(ccExpiryMonth);
			int year = Integer.parseInt(ccExpiryYear);
			
			// Get current year and month
			YearMonth currentYearMonth = YearMonth.now();
			YearMonth expiryYearMonth = YearMonth.of(year, month);
			
			// Check if expiry date is before current date
			// Current month and year is valid
			return expiryYearMonth.isBefore(currentYearMonth);
		} catch (NumberFormatException | DateTimeException e) {
			// If there's any parsing error or date error, consider the date invalid
			return true;
		}
	}
	
	private Date getCardExpirationDate(String monthString, String yearString) {
		try {
			int month = Integer.parseInt(monthString);
			int year = Integer.parseInt(yearString);
			
			// Create a calendar and set it to the last day of the specified month and year
			java.util.Calendar calendar = java.util.Calendar.getInstance();
			calendar.clear();
			calendar.set(java.util.Calendar.YEAR, year);
			calendar.set(java.util.Calendar.MONTH, month - 1); // Calendar months are 0-based
			calendar.set(java.util.Calendar.DAY_OF_MONTH, calendar.getActualMaximum(java.util.Calendar.DAY_OF_MONTH));
			
			return calendar.getTime();
		} catch (NumberFormatException e) {
			// If there's a parsing error, return current date
			return new Date();
		}
	}
	
	private int generateConfirmationNumber() {
		return java.util.concurrent.ThreadLocalRandom.current().nextInt(999999999);
	}
	
	private long performPlaceOrderTransaction(
        String name, String address, String phone,
        String email, String ccNumber, Date date,
        ShoppingCart cart, Connection connection) {
    try {
        System.out.println("Starting transaction process...");
        System.out.println("Setting autoCommit to false");
        connection.setAutoCommit(false);
        
        System.out.println("Creating customer record: " + name + ", " + email);
        long customerId = customerDao.create(
                connection, name, address, phone, email,
                ccNumber, date);
        System.out.println("Customer created with ID: " + customerId);
        
        // Get the computed subtotal directly from the cart
        int subtotalAsInt = cart.getComputedSubtotal();
        // Convert to a proper decimal for calculations
        double subtotal = subtotalAsInt;
        // Calculate tax as exactly 6% of subtotal
        double tax = subtotal * 0.06;
        // Round tax to 2 decimal places for display
        double roundedTax = Math.round(tax * 100) / 100.0;
        // Calculate total (using the exact tax amount)
        double totalAmount = subtotal + roundedTax;
        // Round total to 2 decimal places
        totalAmount = Math.round(totalAmount * 100) / 100.0;
        
        System.out.println("Subtotal: $" + String.format("%.2f", subtotal) + ", Tax (6%): $" + String.format("%.2f", roundedTax) + ", Total: $" + String.format("%.2f", totalAmount));
        int confirmationNumber = generateConfirmationNumber();
        System.out.println("Creating order with amount: $" + String.format("%.2f", totalAmount) + ", confirmation: " + confirmationNumber);
        System.out.println("Debug - subtotalAsInt: " + subtotalAsInt + ", subtotal: $" + subtotal + ", tax: $" + roundedTax + ", total: $" + totalAmount);
        
        long customerOrderId = orderDao.create(
                connection,
                totalAmount,  // Store the dollar amount in database
                confirmationNumber, customerId);
        System.out.println("Order created with ID: " + customerOrderId);
        
        System.out.println("Creating " + cart.getItems().size() + " line items");
        for (ShoppingCartItem item : cart.getItems()) {
            System.out.println("  - Adding book ID: " + item.getBookId() + ", quantity: " + item.getQuantity());
            lineItemDao.create(connection, item.getBookId(), 
                           customerOrderId, item.getQuantity());
        }
        
        System.out.println("Committing transaction");
        connection.commit();
        System.out.println("Transaction committed successfully");
        return customerOrderId;
    } catch (Exception e) {
        System.out.println("ERROR in transaction: " + e.getClass().getName());
        System.out.println("Error message: " + e.getMessage());
        System.out.println("Stack trace:");
        e.printStackTrace();
        System.out.println("Error occurred during order processing");
        try {
            System.out.println("Rolling back transaction");
            connection.rollback();
            System.out.println("Transaction rolled back successfully");
        } catch (SQLException e1) {
            System.out.println("Failed to roll back transaction: " + e1.getMessage());
            throw new BookstoreDbException("Failed to roll back transaction", e1);
        }
        return 0;
    }
}

	private void validateCart(ShoppingCart cart) {

		if (cart.getItems().size() <= 0) {
			throw new ApiException.ValidationFailure("Cart is empty.");
		}

		cart.getItems().forEach(item-> {
			// Validate quantity
			if (item.getQuantity() < 1 || item.getQuantity() > 99) {
				throw new ApiException.ValidationFailure("quantity", "Quantity must be between 1 and 99");
			}
			
			// Get the book from the database to validate against
			Book databaseBook = bookDao.findByBookId(item.getBookId());
			if (databaseBook == null) {
				throw new ApiException.ValidationFailure("Book with ID " + item.getBookId() + " does not exist");
			}
			
			// Validate price
			if (item.getBookForm().getPrice() != databaseBook.price()) {
				throw new ApiException.ValidationFailure(
					"Price mismatch for book '" + databaseBook.title() + "'. Expected: $" + 
					databaseBook.price() + ", Got: $" + item.getBookForm().getPrice());
			}
			
			// Validate category
			if (item.getBookForm().getCategoryId() != databaseBook.categoryId()) {
				throw new ApiException.ValidationFailure(
					"Category mismatch for book '" + databaseBook.title() + "'. Expected category ID: " + 
					databaseBook.categoryId() + ", Got: " + item.getBookForm().getCategoryId());
			}
		});
	}

}
