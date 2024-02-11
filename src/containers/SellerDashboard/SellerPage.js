import React from 'react';
import css from './SellerPage.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faHeart, faSignIn, faEnvelope,faBox,faBoxOpen,faBasketShopping, faBook, faFaceSmile, faGear, faSignOut, faMaskFace} from '@fortawesome/free-solid-svg-icons'
import logo from '../../assets/logo.png';
import avatar from '../../assets/avatar.png';
import profilePhoto from '../../assets/new/Influencer1.PNG';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import classNames from 'classnames';


function SellerPageComponent(){

  return (
    <>

      <nav className={css.profileNav}>
        <img className={css.logo} src={logo}/>

        <div className={css.topRigthIcons}>
          
          <div>
            John Smith
          </div>
          <div>
            <Link to=""><img className={classNames(css.logo,css.profileImage) } src={profilePhoto}/></Link>
          </div>
         
         
        </div>
      </nav>
      
      <div className={css.container}>
      

        <div className={css.aside}>

          <div className={classNames(css.sideLinks,css.noEffect) }>
            <FontAwesomeIcon icon={faSignIn} className={css.icons2} />
            <h4>Seller</h4>
          </div>

          <div className={css.sideLinks}>
            <FontAwesomeIcon icon={faBox} className={css.icons} />
            <Link to="">Products</Link>
          </div>
          <div className={css.sideLinks}>
            <FontAwesomeIcon icon={faBasketShopping} className={css.icons} />
            <Link to="">Orders</Link>
          </div>
          <div className={css.sideLinks}>
            <FontAwesomeIcon icon={faFaceSmile} className={css.icons} />
            <Link to="">My Influencers</Link>
          </div>
          <div className={css.sideLinks}>
            <FontAwesomeIcon icon={faBook} className={css.icons} />
            <Link to="">Gigs</Link>
          </div>

          <div className={css.sideLinks}>
            <FontAwesomeIcon icon={faMessage} className={css.icons} />
            <Link to="">Send Message</Link>
          </div>

          <div className={css.sideLinks}>
            <FontAwesomeIcon icon={faMessage} className={css.icons} />
            <Link to="">Payments</Link>
          </div>

          <div className={css.sideLinks}>
            <FontAwesomeIcon icon={faMessage} className={css.icons} />
            <Link to="">Cancel a project</Link>
          </div>


          <div className={classNames(css.sideLinks,css.magT5,css.noEffect) }>
            <FontAwesomeIcon icon={faSignIn} className={css.icons2} />
            <h4>Pages</h4>
          </div>

          <div className={css.sideLinks}>
            <FontAwesomeIcon icon={faFaceSmile} className={css.icons} />
            <Link to="">Profile</Link>
          </div>
          <div className={css.sideLinks}>
            <FontAwesomeIcon icon={faGear} className={css.icons} />
            <Link to="">Settings</Link>
          </div>
          
          <div className={css.sideLinks}>
            <FontAwesomeIcon icon={faSignOut} className={css.icons} />
            <Link to="">Logout</Link>
          </div>




        </div>
        <div className={css.contentSection}>

          <div className={classNames(css.sideLinks,css.noEffect,css.borderBottom) }>
            <FontAwesomeIcon icon={faSignIn} className={css.icons2} />
            <h4>Dashboard</h4>
          </div>
          <div className={css.cardRow}>
              <div className={css.card1}>
                  <div className={css.row}>
                    <h5 className={css.cardHeader}>Gigs</h5>
                    <FontAwesomeIcon icon={faGear} className={css.icons} />
                  </div>
                  <div className={css.row2}>
                    <FontAwesomeIcon  icon={faBook} className={classNames(css.icons, css.amountIcon)} />
                    <b className={css.amount}>$100</b>
                  </div>
              </div>

              <div className={css.card1}>
                  <div className={css.row}>
                    <h5 className={css.cardHeader}>Total Products</h5>
                    <FontAwesomeIcon icon={faGear} className={css.icons} />
                  </div>
                  <div className={css.row2}>
                    <FontAwesomeIcon  icon={faBook} className={classNames(css.icons, css.amountIcon)} />
                    <b className={css.amount}>15</b>
                  </div>
              </div>


          </div>
          

      </div>
		
	</div>

    </>
  );
};


export default SellerPageComponent;
