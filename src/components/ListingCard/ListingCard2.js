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

export const ListingCard2Component = props => {
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
  } = props;


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

ListingCard2Component.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  setActiveListing: null,
  showAuthorInfo: true,
};

ListingCard2Component.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,
  showAuthorInfo: bool,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

export default injectIntl(ListingCard2Component);
