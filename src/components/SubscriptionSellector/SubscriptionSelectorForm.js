import React, { useEffect, useState } from 'react';
import css from './CustomSection.module.css';
import classNames from 'classnames';
import s1 from '../../assets/new/Influencer1.PNG';
import s2 from '../../assets/new/Influencer2.PNG';
import s3 from '../../assets/new/Influencer3.PNG';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faHeart, faSignIn, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {
    Avatar,
    InlineTextButton,
    LinkedLogo,
    Menu,
    MenuLabel,
    MenuContent,
    MenuItem,
    NamedLink,
  } from '../../components';

function SubscriptionSellectorComponent(){


    const[plan,setPlan] = useState("Basic");


    useEffect(
        ()=>{
            
        },[]
    );

    const  handleBasicClicked = (event)=>{
        event.preventDefault();
       setPlan("Basic");

    }

   const handleProClicked = (event)=>{
    event.preventDefault();
        setPlan("Pro");
    }

  return (
    <>
    <div className={css.container +' '+ css.textCenter+' '+ css.sectionBgWhite}>
        <div className={css.containerMain}>
          
            
            <div className={css.row}>
                <div className={classNames(css.col4,css.pad1,css.plans)}>
                    <h3 className={css.magB3}>Basic Plan</h3>
                    <h2 className={css.costBasic}>$0.00</h2>
                    
                    <p>

                        Influence Connect Basic offers a no-cost entry point for both creators and sellers.
                        <br/><br/>
                        
                    </p>
                    <div className={css.col12 +" "+ css.magT6+" "+ css.magB4}>
                        <a className={css.linkBtn } href='' onClick={handleBasicClicked}>Subscribe to plan</a>
                    </div>

                   
                    
                </div>

                <div className={classNames(css.col4,css.pad1,css.plans)}>
                    <h3 className={css.magB3}>Pro Plan</h3>
                    <h2 className={css.costPro}>$9.00</h2>
                    
                    <p>

                        Influence Connect Pro unlocks enhanced features for both creators and
                        sellers through a monthly subscription.
                            
                    </p>

                    <div className={css.col12 +" "+ css.magT6+" "+ css.magB4}>
                        <a className={css.linkBtn } href='' onClick={handleProClicked}>Subscribe to plan</a>
                    </div>

                    
                    
                </div>
               
            </div>
           
            

        </div>
	</div>

    </>
  );
};

export default SubscriptionSellectorComponent;
