import React from 'react';
import css from './SettingsPage.module.css';

import w1 from '../../assets/cover1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faHeart, faSignIn, faEnvelope} from '@fortawesome/free-solid-svg-icons'
import Checkout from '../PaypalCom/Checkout';


function SettingsComponent(props){


    const [currentUser] = props;

  return (

    <div class={css.container}>
        <Checkouts 
            currentUser={currentUser}
        />
    </div>
    
  );
};



const mapStateToProps = state => {
    
    const { currentUser } = state.user;
    return {
      
      currentUser,
     
    };
  };
  
  
  const SettingsPage = compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    ),
    injectIntl
  )(SettingsComponent);
  



export default SettingsPage;
