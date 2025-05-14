

import  "../assets/css/Checkout.css"

import { isCreditCard, isMobilePhone, isValidEmail } from '../utils';
import { BookItem, months, years, CustomerForm, OrderDetails } from "../types";
import { CartStore } from "../contexts/CartContext";
import { OrderDetailsContext } from "../contexts/OrderDetailsContext";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartTypes } from "../reducers/CartReducer";
import axios from "axios";
// FontAwesome imports removed to fix dependency issues

function CheckoutPage() {
   const { updateOrderDetails } = useContext(OrderDetailsContext);

   const getBookImageUrl = function (book: BookItem): string {
      // Convert title to lowercase and remove spaces for image filename
      const imageKey = book.title.toLowerCase().replace(/\s+/g, '');
      
      try {
          // Try to require the image dynamically
          return require(`../assets/images/books/${imageKey}.jpg`);
      } catch (e) {
          try {
              // Try with .png extension if .jpg fails
              return require(`../assets/images/books/${imageKey}.png`);
          } catch (e) {
              // Return a placeholder if both fail
              return require('../assets/images/books/reminders.png'); // Using a known image as fallback
          }
      }
   };

   /*
    * This will be used by the month and year expiration of a credit card
    *  NOTE: For example yearFrom(0) == <current_year>
   */
   function yearFrom(index: number) {
      return new Date().getFullYear() + index;
   }

   const {cart, dispatch} = useContext(CartStore);
   const navigate = useNavigate();


   // Calculate the total price of the cart (in cents)
   const cartTotalPrice = cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);

   // Calculate the total number of items in the cart
   const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);



   const [nameError, setNameError] = useState("");

   // Error states for all form fields
   const [addressError, setAddressError] = useState("");
   const [phoneError, setPhoneError] = useState("");
   const [emailError, setEmailError] = useState("");
   const [ccNumberError, setCcNumberError] = useState("");
   const [ccExpiryError, setCcExpiryError] = useState("");

   const [formData, setFormData] = useState({name: "",address:"", phone:"",email: "",ccNumber: "", ccExpiryMonth:0,ccExpiryYear:0});

   const [checkoutStatus, setCheckoutStatus] = useState("");

   function isValidForm()
   {
      // Check if all fields are filled and valid
      // Name and address: between 4 and 45 characters
      // Email: valid email format
      // Phone: valid 10-digit phone number
      // Credit Card: valid credit card number
      // Expiration date: month and year must be selected
      
      // First check if any field is empty
      if (!formData.name || !formData.address || !formData.phone || 
          !formData.email || !formData.ccNumber || 
          formData.ccExpiryMonth === 0 || formData.ccExpiryYear === 0) {
         return false;
      }
      
      return (
         formData.name.length >= 4 && formData.name.length <= 45 &&
         formData.address.length >= 4 && formData.address.length <= 45 &&
         isMobilePhone(formData.phone) &&
         isValidEmail(formData.email) &&
         isCreditCard(formData.ccNumber) &&
         formData.ccExpiryMonth > 0 &&
         formData.ccExpiryYear >= new Date().getFullYear()
      );
   }

   const placeOrder = async (customerForm: CustomerForm) => {

      const order = { customerForm: customerForm, cart: {itemArray: cart} };

      const orders = JSON.stringify(order);
      // console.log(orders);     //you can uncomment this to see the orders JSON on the console
      const url = 'api/orders';
      const orderDetails: OrderDetails = await axios.post(url, orders,
         {headers: {
               "Content-Type": "application/json",
            }
         })
         .then((response) => {
               // Clear the cart
               dispatch({type: CartTypes.CLEAR, item: {} as BookItem, id: 0});
               // Store the order details in context
               const orderData = response.data;
               updateOrderDetails(orderData);
               return orderData;
         })
         .catch((error) => {
            console.log("Error placing order:", error);
            return null;
         });
      console.log("order details: ", orderDetails);
      return orderDetails;
   }

   function handleInputChange(event:ChangeEvent<HTMLInputElement|HTMLSelectElement>) {

      const { name, value } = event.target;

      switch (name) {
         case 'name':
            setFormData((prevFormData) => ({...prevFormData, [name]: value}));
            if (!value) {
               setNameError("Name is required");
            } else if(value.length < 4 || value.length > 45) {
               setNameError("Name must be between 4 and 45 characters");
            } else {
               setNameError("");
            }
            break;
         case 'address':
            setFormData((prevFormData) => ({...prevFormData, [name]: value}));
            if (!value) {
               setAddressError("Address is required");
            } else if(value.length < 4 || value.length > 45) {
               setAddressError("Address must be between 4 and 45 characters");
            } else {
               setAddressError("");
            }
            break;
         case 'phone':
            setFormData((prevFormData) => ({...prevFormData, [name]: value}));
            if (!value) {
               setPhoneError("Phone number is required");
            } else if(!isMobilePhone(value)) {
               setPhoneError("Please enter a valid 10-digit phone number");
            } else {
               setPhoneError("");
            }
            break;
         case 'email':
            setFormData((prevFormData) => ({...prevFormData, [name]: value}));
            if (!value) {
               setEmailError("Email is required");
            } else if(!isValidEmail(value)) {
               setEmailError("Please enter a valid email address");
            } else {
               setEmailError("");
            }
            break;
         case 'ccNumber':
            setFormData((prevFormData) => ({...prevFormData, [name]: value}));
            if (!value) {
               setCcNumberError("Credit card number is required");
            } else if(!isCreditCard(value)) {
               setCcNumberError("Please enter a valid credit card number");
            } else {
               setCcNumberError("");
            }
            break;
         case 'ccExpiryMonth':
            setFormData((prevFormData) => ({...prevFormData, [name]:parseInt(value,10)}));
            if (parseInt(value,10) === 0) {
               setCcExpiryError("Expiration month is required");
            } else {
               setCcExpiryError("");
            }
            break;
         case 'ccExpiryYear':
            setFormData((prevFormData) => ({...prevFormData, [name]: parseInt(value,10)}));
            if (parseInt(value,10) === 0) {
               setCcExpiryError("Expiration year is required");
            } else {
               setCcExpiryError("");
            }
            break;
         default:
            break;
      }
   }

  async function submitOrder(event: FormEvent) {
   event.preventDefault();
   console.log("Submit order");
   
   // Validate all fields and set error messages
   let hasErrors = false;
   
   // Validate name
   if (!formData.name) {
      setNameError("Name is required");
      hasErrors = true;
   } else if (formData.name.length < 4 || formData.name.length > 45) {
      setNameError("Name must be between 4 and 45 characters");
      hasErrors = true;
   } else {
      setNameError("");
   }
   
   // Validate address
   if (!formData.address) {
      setAddressError("Address is required");
      hasErrors = true;
   } else if (formData.address.length < 4 || formData.address.length > 45) {
      setAddressError("Address must be between 4 and 45 characters");
      hasErrors = true;
   } else {
      setAddressError("");
   }
   
   // Validate phone
   if (!formData.phone) {
      setPhoneError("Phone number is required");
      hasErrors = true;
   } else if (!isMobilePhone(formData.phone)) {
      setPhoneError("Please enter a valid phone number");
      hasErrors = true;
   } else {
      setPhoneError("");
   }
   
   // Validate email
   if (!formData.email) {
      setEmailError("Email is required");
      hasErrors = true;
   } else if (!isValidEmail(formData.email)) {
      setEmailError("Please enter a valid email");
      hasErrors = true;
   } else {
      setEmailError("");
   }
   
   // Validate credit card number
   if (!formData.ccNumber) {
      setCcNumberError("Credit card number is required");
      hasErrors = true;
   } else if (!isCreditCard(formData.ccNumber)) {
      setCcNumberError("Please enter a valid credit card number");
      hasErrors = true;
   } else {
      setCcNumberError("");
   }
   
   // Validate expiration date
   if (formData.ccExpiryMonth === 0 || formData.ccExpiryYear === 0) {
      setCcExpiryError("Expiration date is required");
      hasErrors = true;
   } else if (formData.ccExpiryYear < new Date().getFullYear() || 
         (formData.ccExpiryYear === new Date().getFullYear() && 
          formData.ccExpiryMonth < new Date().getMonth() + 1)) {
      setCcExpiryError("Expiration date must be in the future");
      hasErrors = true;
   } else {
      setCcExpiryError("");
   }
   
   if (hasErrors) {
      setCheckoutStatus("ERROR");
   } else {
      setCheckoutStatus("PENDING");
      const orders = await placeOrder({
         name: formData.name,
         address: formData.address,
         phone: formData.phone,
         email: formData.email,
         ccNumber: formData.ccNumber,
         ccExpiryMonth: formData.ccExpiryMonth,
         ccExpiryYear: formData.ccExpiryYear,
      })
      if(orders) {
         setCheckoutStatus("OK");
         navigate('/confirmation');
      } else {
         console.log("Error placing order");
      }
   }
}

   return (
       <>
       {cartQuantity === 0 ? (
          <section className="checkout-cart-table-view">
             <div className="empty-cart-message">
                <h2>Your cart is empty</h2>
                <p>Add items to your cart to proceed with checkout.</p>
                <button 
                   className="continue-shopping-button"
                   onClick={() => navigate('/')}
                >
                   Continue Shopping
                </button>
             </div>
          </section>
       ) : (
          <section className="checkout-cart-table-view">
             <div className="checkout-page-body">
             <div>
                <form
                    className="checkout-form"
                    onSubmit={(event)=>submitOrder(event)}
                    method="post"
                >
                   <div>
                      <label htmlFor="fname">Name</label>
                      <input
                          type="text"
                          size={20}
                          name="name"
                          id="fname"
                          value={formData.name}
                          onChange={handleInputChange}
                      />
                   </div>
                   {nameError && <div className="error"> {nameError}</div>}

                   <div>
                      <label htmlFor="address">Address</label>
                      <input
                         type="text"
                         size={20}
                         name="address"
                         id="address"
                         value={formData.address}
                         onChange={handleInputChange}
                      />
                   </div>
                   {addressError && <div className="error"> {addressError}</div>}

                   <div>
                      <label htmlFor="phone">Phone</label>
                      <input
                         type="text"
                         size={20}
                         name="phone"
                         id="phone"
                         value={formData.phone}
                         onChange={handleInputChange}
                      />
                   </div>
                   {phoneError && <div className="error"> {phoneError}</div>}

                   <div>
                      <label htmlFor="email">Email</label>
                      <input
                         type="text"
                         size={20}
                         name="email"
                         id="email"
                         value={formData.email}
                         onChange={handleInputChange}
                      />
                   </div>
                   {emailError && <div className="error"> {emailError}</div>}

                   <div>
                      <label htmlFor="ccNumber">Credit Card Number</label>
                      <input
                         type="text"
                         size={20}
                         name="ccNumber"
                         id="ccNumber"
                         value={formData.ccNumber}
                         onChange={handleInputChange}
                         autoComplete="off"
                      />
                   </div>
                   {ccNumberError && <div className="error"> {ccNumberError}</div>}

                   <div className="expiry-date-container">
                      <label htmlFor="ccExpiryMonth">Exp Date</label>
                      <div className="expiry-date-selects">
                         <select style={{color:'black'}} name="ccExpiryMonth" value={formData.ccExpiryMonth} onChange={handleInputChange}>
                            <option value="0">Month</option>
                            { months.map((month, i) => (
                                <option key={i} value={i + 1}>
                                   { month }
                                </option>
                            ))}
                         </select>

                        <select style={{color:'black'}} name="ccExpiryYear" value={formData.ccExpiryYear} onChange={handleInputChange}>
                           <option value="0">Year</option>
                           { years.map((year, i) => (
                              <option key={i} value={year}>
                                 { year }
                              </option>
                           ))}
                        </select>
                      </div>
                   </div>
                   {ccExpiryError && <div className="error"> {ccExpiryError}</div>}

                </form>
             </div>

             <div className="checkout-summary">
                <h3>Order Summary</h3>
                <div className="checkout-summary-row">
                   <span>Subtotal:</span>
                   <span>${(cartTotalPrice).toFixed(2)}</span>
                </div>
                <div className="checkout-summary-row">
                   <span>Tax (6%):</span>
                   <span>${(cartTotalPrice * 0.06).toFixed(2)}</span>
                </div>
                <div className="checkout-summary-row total">
                   <span>Total:</span>
                   <span>${(cartTotalPrice * 1.06).toFixed(2)}</span>
                </div>
                <button 
                   type="button" 
                   className="checkout-button"
                   onClick={(e) => {
                      submitOrder(e as unknown as React.FormEvent);
                   }}
                   disabled={cartQuantity === 0}
                >
                   Complete Purchase
                </button>
             </div>


                   <div>
                      {/*The following code displays different string based on the */}
                      {/*value of the checkoutStatus*/}
                      {/*Note the ternary operator*/}
                      {
                         checkoutStatus !== ''?
                             <>
                                <section className="checkoutStatusBox" >
                                   { (checkoutStatus === 'ERROR')?
                                       <div>
                                          Error: Please fix the problems above and try again.
                                       </div>: ( checkoutStatus === 'PENDING'?
                                           <div>
                                              Processing...
                                           </div> : (checkoutStatus === 'OK'?
                                               <div>
                                                  Order placed...
                                               </div>:
                                               <div>
                                                  An unexpected error occurred, please try again.
                                               </div>))}
                                </section>
                             </>
                             :<></>}
                   </div>
                </div>

           <div>
              {/*This displays the information about the items in the cart*/}
              <ul className="checkout-cart-info">
                 {
                    cart?.map((item, i) => (
                        <div className="checkout-cart-book-item" key={i}>
                           <div className="checkout-cart-book-image">
                              <img src={getBookImageUrl(item.book)} alt={item.book.title} className="checkout-cart-info-img" />
                           </div>
                           <div className="checkout-cart-book-info">
                              <div className="checkout-cart-book-title">{ item.book.title }</div>

                              <div className="checkout-cart-book-subtotal">
                                 ${(item.book.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="checkout-cart-book-quantity">
                                 <div className="quantity-control">
                                    <button 
                                       className="checkout-icon-button dec-button" 
                                       onClick={() => {
                                          dispatch({ type: CartTypes.REMOVE, item:item.book, id: item.book.bookId });
                                       }}
                                       aria-label="Decrease quantity"
                                       disabled={item.quantity <= 1}
                                    >
                                       -
                                    </button>
                                    <span className="checkout-num-button">{ item.quantity }</span>
                                    <button 
                                       className="checkout-icon-button inc-button" 
                                       onClick={() => {
                                          dispatch({ type: CartTypes.ADD, item:item.book, id: item.book.bookId });
                                       }}
                                       aria-label="Increase quantity"
                                    >
                                       +
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                    ))
                 }
              </ul>
           </div>
           </section>
        )}
       </>
   );
}

export default CheckoutPage;
