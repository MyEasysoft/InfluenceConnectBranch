import React from 'react';
import css from './Profile.module.css';
import w1 from '../../assets/cover1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faHeart, faSignIn, faEnvelope} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames';
import NamedLink from '../NamedLink/NamedLink';
import ExternalLink from '../ExternalLink/ExternalLink';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';


const Profile = props => {

  const {user} = props;
  //if(user.profileImage === null || user.profileImage.attributes === null)return;
  const profileImageUrl = user.profileImage.attributes.variants["square-small"].url;
  const {firstName, lastName,bio,protectedData,displayName} = user.attributes.profile;
  const storeFront = user.attributes.profile.publicData.storeFront;
  const role = user.attributes.profile.protectedData.role;
  const {showStore} = props;
  //const storeFront = profileUser?.attributes?.profile?.publicData?.storeFront ;

  const displayNames = firstName && lastName?firstName +" "+lastName:displayName;
  
 
  return (
    <>

      <div className={css.container}>
          <div className={css.containerMain}>
              <div>
                      <img className={classNames(css.imgFluid,css.round)} src={profileImageUrl}/>
                      <div className={css.center}>
                          <h4 className={css.magTop30}>{displayNames}</h4>
                          {role === "Influencer"?
                            <ExternalLink className={css.link} href={storeFront}>
                                Visit my store
                            </ExternalLink>:""
                          }
                      </div>
                      
                      
                      <p>{bio} </p>
              </div>
              
          </div>
          
      
      </div>

    </>
  );
};


export default Profile;
