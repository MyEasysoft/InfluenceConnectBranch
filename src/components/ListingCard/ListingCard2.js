import React from 'react';
import { string, func, bool } from 'prop-types';
import classNames from 'classnames';

import { useConfiguration } from '../../context/configurationContext';

import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { displayPrice } from '../../util/configHelpers';
import { lazyLoadWithDimensions } from '../../util/uiHelpers';
import { propTypes } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureListing, ensureUser } from '../../util/data';
import { richText } from '../../util/richText';
import { createSlug } from '../../util/urlHelpers';
import { isBookingProcessAlias } from '../../transactions/transaction';

import { AspectRatioWrapper, NamedLink, ResponsiveImage } from '../../components';

import css from './ListingCard.module.css';
import { compose } from 'redux';
import { connect } from 'react-redux';

const MIN_LENGTH_FOR_LONG_WORDS = 10;

const priceData = (price, currency, intl) => {
  if (price && price.currency === currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: intl.formatMessage(
        { id: 'ListingCard2.unsupportedPrice' },
        { currency: price.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'ListingCard2.unsupportedPriceTitle' },
        { currency: price.currency }
      ),
    };
  }
  return {};
};

const LazyImage = lazyLoadWithDimensions(ResponsiveImage, { loadAfterInitialRendering: 3000 });

const PriceMaybe = props => {
  const { price, publicData, config, intl } = props;
  const { listingType } = publicData || {};
  const validListingTypes = config.listing.listingTypes;
  const foundListingTypeConfig = validListingTypes.find(conf => conf.listingType === listingType);
  const showPrice = displayPrice(foundListingTypeConfig);
  if (!showPrice && price) {
    return null;
  }

  const isBookable = isBookingProcessAlias(publicData?.transactionProcessAlias);
  const { formattedPrice, priceTitle } = priceData(price, config.currency, intl);
  return (
    <div className={css.price}>
      <div className={css.priceValue} title={priceTitle}>
        {formattedPrice}
      </div>
      {isBookable ? (
        <div className={css.perUnit}>
         
        </div>
      ) : null}
    </div>
  );
};

export const ListingCard2Componentt = props => {
  const config = useConfiguration();
  const {
    className,
    rootClassName,
    intl,
    listing,
    images,
    index,
    setActiveListing,
    showAuthorInfo,
    currentUser
  } = props;


  

  const listingId = listing.id;
  const agreements = currentUser?.attributes?.profile?.privateData?.Agreements;
  const getAcceptedAgreement = (agreements,agreementToCheckForAcceptance) => {
  
  if(agreements === undefined || agreements === null)return[];
  const res = [];
  const keys = Object?.keys(agreements);
  keys.forEach(key => {
    
    try{
        if(parseInt(agreements[0]) !== undefined && agreements[key].listingId === agreementToCheckForAcceptance && agreements[key].status === "Started"){
          
          //console.log(obj[key].listingId+"  ooooooooooooooooooooooooooooooooooooooooo    "+ listingId);
          res.push(
            agreements[key]
          );
        }

       

    }catch(error){}
   
  });
  return res;
};

 let influencerToBePaidDisplayName = "";
  let influencerToBePaidId = "";
  let alternateListingSellersPayToId ;
  let role = "";
if(currentUser !== undefined && currentUser !== null){
  role = currentUser?.attributes?.profile?.protectedData?.role;
  
  let InfluencerToBePaidFromAgreement = getAcceptedAgreement(agreements,listingId.uuid);
  if(role==="Seller" && InfluencerToBePaidFromAgreement.length > 0){
    //Get the User to be paid from the selected Agreement if available
    
    influencerToBePaidDisplayName = currentUser.id.uuid === InfluencerToBePaidFromAgreement[0].partyA?InfluencerToBePaidFromAgreement[0].partyBName:InfluencerToBePaidFromAgreement[0].partyAName;
    influencerToBePaidId = currentUser.id.uuid === InfluencerToBePaidFromAgreement[0].partyA?InfluencerToBePaidFromAgreement[0].partyB:InfluencerToBePaidFromAgreement[0].partyA;
    alternateListingSellersPayToId = InfluencerToBePaidFromAgreement[0].alternateListingSellersPayToId;
  }

  if(role==="Seller" && alternateListingSellersPayToId !== undefined){
    listing.id.uuid = alternateListingSellersPayToId;
    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

  }

}
  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");


  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing?.id?.uuid;
  const { title = '', price, publicData } = currentListing?.attributes;
  const slug = createSlug(title);
  const author = ensureUser(listing?.author);
  const authorName = author?.attributes?.profile?.displayName;
  const firstImage = images && images.length > 0 ? images[0] : null;

 
  const {
    aspectWidth = 1,
    aspectHeight = 1,
    variantPrefix = 'listing-card',
  } = config.layout.listingImage;
  const variants = {0: "listing-card" ,1: "listing-card-2x"};

  const setActivePropsMaybe = setActiveListing
    ? {
        onMouseEnter: () => setActiveListing(currentListing.id),
        onMouseLeave: () => setActiveListing(null),
      }
    : null;

   const renderSizes = "(max-width: 549px) 100vw, (max-width: 767px) 50vw, (max-width: 1439px) 26vw, (max-width: 1920px) 18vw, 14vw";

   console.log(id+"    ------------------Original-----------------------   "+slug);

  return (
    <NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
      <AspectRatioWrapper
        className={css.aspectRatioWrapper}
        width={aspectWidth}
        height={aspectHeight}
       
        {...setActivePropsMaybe}
      >{firstImage?
        <img
        src={images[index]?.attributes?.variants["listing-card"]?.url}
        width={images[index]?.attributes?.variants["listing-card"]?.width}
        height={images[index]?.attributes?.variants["listing-card"]?.height}
      />:""
      }
       
      </AspectRatioWrapper>
      <div className={css.info}>
       
        <div className={css.mainInfo}>
          <div className={css.title}>
            {richText(title, {
              longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
              longWordClass: css.longWord,
            })}
          </div>
          {showAuthorInfo ? (
            <div className={css.authorInfo}>
              <PriceMaybe price={price} publicData={publicData} config={config} intl={intl} />
              <FormattedMessage id="ListingCard.author" values={{ authorName }} />
            </div>
          ) : null}
        </div>
        
      </div>
    </NamedLink>
  );
};

ListingCard2Componentt.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  setActiveListing: null,
  showAuthorInfo: true,
};

ListingCard2Componentt.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,
  showAuthorInfo: bool,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

const mapStateToProps = state => {
  
  const { currentUser } = state.user;
  return {
    
    currentUser,
   
  };



};


const ListingCard2Component = compose(connect(mapStateToProps))(ListingCard2Componentt);


export default injectIntl(ListingCard2Component);
