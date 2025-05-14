import '../assets/css/AppFooter.css'
import '../assets/css/global.css'
import {Link} from "react-router-dom";


function AppFooter(){
return(
<footer className="footer">
      <a href="https://maps.app.goo.gl/XwRnQGHMJnPLGHYz7" target="_blank" rel="noopener noreferrer">Directions</a>
      <span className="separator">|</span>
      <a href="mailto:storyspark@gmail.com" className="contact-info">
        <img 
          src={require('../assets/images/site/gmail.png')} 
          alt="Email" 
          className="contact-icon" 
        />
        storyspark@gmail.com
      </a>
      <span className="separator">|</span>
      <a href="tel:+15712650574" className="contact-info">
        <img 
          src={require('../assets/images/site/call.png')} 
          alt="Phone" 
          className="contact-icon" 
        />
        (571)-265-0574
      </a>
      <span className="separator">|</span>
      <span>&copy; 2025 StorySpark. All rights reserved</span>
      <span className="separator">|</span>
      <div className="social-icons">
        <a href="https://facebook.com/story--sparkkk" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page">
          <img src={require('../assets/images/site/facebook.png')} alt="" className="social-icon" />
          <span className="sr-only">Facebook</span>
        </a>
        <a href="https://instagram.com/storys--park_booksss" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
          <img src={require('../assets/images/site/instagram.png')} alt="" className="social-icon" />
          <span className="sr-only">Instagram</span>
        </a>
        <a href="https://twitter.com/story--sparkkk" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X (Twitter)">
          <img src={require('../assets/images/site/x.png')} alt="" className="social-icon x-icon" />
          <span className="sr-only">X (Twitter)</span>
        </a>
        <a href="https://youtube.com/c/story--sparkkk" target="_blank" rel="noopener noreferrer" aria-label="Subscribe to our YouTube channel">
          <img src={require('../assets/images/site/youtube.png')} alt="" className="social-icon" />
          <span className="sr-only">YouTube</span>
        </a>
      </div>
    </footer>
)
}
export default AppFooter;
