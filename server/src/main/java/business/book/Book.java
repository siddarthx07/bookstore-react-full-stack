package business.book;

/*
 * TODO: Create a record constructor with fields corresponding to the fields in the
 * book table of your database.
 */

public record Book(
		long bookId,
		String title,
		String author,
		String description,  // Added
		int price,
		int rating,          // Added
		boolean isPublic,
		boolean isFeatured,  // Added
		long categoryId
) {}

