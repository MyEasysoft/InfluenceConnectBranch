import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { InlineTextButton, NamedLink } from '../../components';

import css from './TabNavHorizontal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown, faCaretSquareDown, faContactBook, faKey, faRemove } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

export const LIGHT_SKIN = 'light';
export const DARK_SKIN = 'dark';

const { arrayOf, bool, func, node, object, oneOf, string, shape } = PropTypes;

const Tab = props => {
  const { className, disabled, text, selected, onClick, linkProps, isDark } = props;
  const darkSkinClasses = isDark
    ? classNames(css.tabContentDarkSkin, {
        [css.selectedTabContentDarkSkin]: selected,
        [css.disabledDarkSkin]: disabled,
      })
    : null;

  const linkClasses = classNames(
    css.tabContent,
    {
      [css.selectedTabContent]: selected,
      [css.disabled]: disabled,
    },
    darkSkinClasses
  );

  const buttonClasses = classNames(
    css.tabContent,
    css.button,
    {
      [css.selectedTabContent]: selected,
      [css.disabled]: disabled,
    },
    darkSkinClasses
  );

  const isButton = !!onClick;

  return (
    <div className={className}>
      {isButton ? (
        <InlineTextButton rootClassName={buttonClasses} onClick={onClick}>
          {text}
        </InlineTextButton>
      ) : (
        <NamedLink className={linkClasses} {...linkProps}>
          {text}
        </NamedLink>
      )}
    </div>
  );
};

Tab.defaultProps = { className: null, disabled: false, selected: false };

Tab.propTypes = {
  className: string,
  text: node.isRequired,
  disabled: bool,
  selected: bool,
  onClick: func,
  linkProps: object,
  isDark: bool.isRequired,
};

const TabNavHorizontal = props => {
  const { className, rootClassName, tabRootClassName, tabs, skin } = props;

  
  const PasswordChangePage = {
    name: 'PasswordChangePage',
    match: { url: '/' },
  };

  const DeleteAccountPage = {
    name: 'DeleteAccountPage',
    match: { url: '/' },
  };

  const ContactDetailsPage = {
    name: 'ContactDetailsPage',
    match: { url: '/' },
  };

  const PaymentSettingPage = {
    name: 'PaymentSettingPage',
    match: { url: '/' },
  };

  const[show,setShow] = useState(false);
  

  const showMenu = ()=>{
    setShow((show) => true);
  }

  const hideMenu = ()=>{
    setShow((show) => !show);
  }
  const location = useLocation();
  const path = location.pathname;

  const contactDetailsMenu = (path==="/" || path==="/login" || path==="/signup" || path.indexOf("u")===1)?"":
          <button onClick={hideMenu}  className={css.dropDown}>
              <span className={css.margR}>Account Settings</span>
              <FontAwesomeIcon icon={faCaretSquareDown}/>
              {show &&
                <div className={css.navMenu} onClick={hideMenu} >
                    <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                      <FontAwesomeIcon icon={faContactBook}/>
                      <NamedLink {...ContactDetailsPage} className={css.accountSetting} >Contact Details</NamedLink>
                    </button>

                    <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                      <FontAwesomeIcon icon={faKey}/>
                      <NamedLink {...PasswordChangePage} className={css.accountSetting} >Password</NamedLink>
                    </button>

                    <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                      <FontAwesomeIcon icon={faRemove}/>
                      <NamedLink {...DeleteAccountPage} className={css.accountSetting} >Delete Account</NamedLink>
                    </button>
                   
                    
                </div>
              }

        </button>
  ;

  
  const skinColor = (path==="/" || path==="/login" || path==="/signup" || path.indexOf("u")===1)?DARK_SKIN:LIGHT_SKIN;
  const isDark = skin === skinColor;
  const classes = classNames(rootClassName || css.root, { [css.darkSkin]: isDark }, className);
  const tabClasses = tabRootClassName || css.tab;
  

  return (
    <nav className={classes}>
      
     
      {tabs.map((tab, index) => {
        const key = typeof tab.text === 'string' ? tab.text : index;
        return <Tab key={key} className={tabClasses} {...tab} isDark={isDark} />;
      })}

      {contactDetailsMenu}
     
    </nav>
  );
};

/**
 * A tab navigation element with buttons. Requires onClick
 * function param for tab objects passed as parameter.
 */
export const ButtonTabNavHorizontal = props => <TabNavHorizontal {...props} />;

ButtonTabNavHorizontal.defaultProps = {
  className: null,
  rootClassName: null,
  tabRootClassName: null,
  tabClassName: null,
  skin: LIGHT_SKIN,
};

ButtonTabNavHorizontal.propTypes = {
  className: string,
  rootClassName: string,
  tabRootClassName: string,
  tabs: arrayOf(
    shape({
      text: node.isRequired,
      disabled: bool,
      selected: bool,
      onClick: func.isRequired,
    })
  ).isRequired,
  skin: oneOf([LIGHT_SKIN, DARK_SKIN]),
};

/**
 * A tab navigation element with links. Requires linkProps
 * object param for tab objects passed as parameter.
 */
export const LinkTabNavHorizontal = props => <TabNavHorizontal {...props} />;

LinkTabNavHorizontal.defaultProps = {
  className: null,
  rootClassName: null,
  tabRootClassName: null,
  tabClassName: null,
  skin: LIGHT_SKIN,
};

LinkTabNavHorizontal.propTypes = {
  className: string,
  rootClassName: string,
  tabRootClassName: string,
  tabs: arrayOf(
    shape({
      text: node.isRequired,
      disabled: bool,
      selected: bool,
      linkProps: object.isRequired,
    })
  ).isRequired,
  skin: oneOf([LIGHT_SKIN, DARK_SKIN]),
};
