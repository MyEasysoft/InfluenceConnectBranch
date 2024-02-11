import React from 'react';
import css from './CustomSection.module.css';
import bag1 from '../../assets/bag1.jpg';
import bag2 from '../../assets/bag2.jpg';
import bag3 from '../../assets/bag3.jpg';
import bag4 from '../../assets/bag4.jpg';
import bag5 from '../../assets/bag4.jpg';
import bag6 from '../../assets/bag3.jpg';
import profileImg from '../../assets/bg.png';
import s1 from '../../assets/s1.jpg';
import s2 from '../../assets/s2.jpg';
import w1 from '../../assets/cover1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faHeart, faSignIn, faEnvelope} from '@fortawesome/free-solid-svg-icons'


function CustomSectionComponent1(){

  return (
    <>

    
    <div className={css.container +' '+ css.textCenter +' '+ css.sectionBgOffWhite}>
        <div className={css.containerMain}>
            <div className={css.col12}>
                        <h4 className={css.magB3+" "+css.sectionTitle}>EXHIBITIONS</h4>
            </div>
            
            <div>
                <div className={css.col4 +" "+css.pad1 +" "+css.leftAlign}>
                    
                    <p className={css.magT16}>
                        <span className={css.textbold+" "+css.stretch+" "+css.padT8}>Zoey Frank: Wonder Creator<br/></span><br/>
                    </p>
                    <p>
                        
                            <FontAwesomeIcon className={css.icon} icon={faMessage} />Enquire
                        
                    </p>
                    <p>

                        John Frank is one of our best Creators. He is so adept in what he knows best. He has sold thousands of copies of these products.
                        John Frank is one of our best Creators. He is so adept in what he knows best. He has sold thousands of copies of these products.
                        John Frank is one of our best Creators. He is so adept in what he knows best. He has sold thousands of copies of these products.
                        John Frank is one of our best Creators. He is so adept in what he knows best. He has sold thousands of copies of these products.
                    </p>
                </div>
                <div className={css.col8 +" "+css.pad1 +" "+css.leftAlign}>
                    <img className={css.imgFluid} src={w1}/>
                    
                </div>
                
            </div>
            <div className={css.col12 +" "+ css.magT6+" "+ css.magB4}>
                <a className={css.linkBtn } href=''>View well known Creators</a>
            </div>
        </div>
        
		
	</div>

    </>
  );
};


export default CustomSectionComponent1;
