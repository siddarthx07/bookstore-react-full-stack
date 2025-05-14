package business.order;

import java.util.Date;

public record Order(long orderId, double amount, Date dateCreated, long confirmationNumber, long customerId) {}
