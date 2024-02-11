import React from 'react';
import css from './CustomSection.module.css';
import bag1 from '../../assets/bag1.jpg';
import bag2 from '../../assets/bag2.jpg';
import bag3 from '../../assets/bag3.jpg';
import bag4 from '../../assets/bag4.jpg';
import bag5 from '../../assets/bag4.jpg';
import bag6 from '../../assets/bag3.jpg';
import profileImg from '../../assets/bg.png';
import s1 from '../../assets/new/Amazonboxes.PNG';
import s2 from '../../assets/new/ShoppableVideos.JPG';
import s3 from '../../assets/new/Pic5.JPG';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faHeart, faSignIn, faEnvelope} from '@fortawesome/free-solid-svg-icons'

function CustomSectionComponent4(){

  return (
    <>
    <div className={css.container +' '+ css.textCenter+' '+ css.sectionBgOffWhite}>
        <div className={css.containerMain}>
           
            <div className={css.col12 +" "+ css.magB2 +" "+ css.magT5}>
                <h4 className={css.magB2 +" "+css.sectionTitle}>PRESS</h4>
            </div>
            <div className={css.row}>
                <div className={css.col4 +" "+css.pad1 +" "+css.leftAlign}>
                    <img className={css.imgFluid} src={s1}/>
                    <p>
                        <span className={css.textbold+" "+css.stretch+" "+css.padB1}>Sam Frank
                        </span> <br/>New York, United States <br/><FontAwesomeIcon className={css.icon} icon={faMessage} />Enquire</p>
                </div>
                <div className={css.col4 +" "+css.pad1 +" "+css.leftAlign}>
                    <img className={css.imgFluid} src={s2}/>
                    <p>
                        <span className={css.textbold+" "+css.stretch+" "+css.padB1}>Sam Frank
                        </span> <br/>New York, United States <br/><FontAwesomeIcon className={css.icon} icon={faMessage} />Enquire</p>
                </div>
                <div className={css.col4 +" "+css.pad1 +" "+css.leftAlign}>
                    <img className={css.imgFluid} src={s3}/>
                    <p>
                        <span className={css.textbold+" "+css.stretch+" "+css.padB1}>Sam Frank
                        </span> <br/>New York, United States <br/><FontAwesomeIcon className={css.icon} icon={faMessage} />Enquire</p>
                </div>
            </div>
           
            <div className={css.col12 +" "+ css.magT6+" "+ css.magB4}>
                <a className={css.linkBtn } href=''>Know More</a>
            </div>

        </div>
	</div>

    </>
  );
};

export default CustomSectionComponent4;
