import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { Heading, H2, Reviews } from '../../components';

import css from './ListingPage.module.css';

const SectionReviews = props => {
  const { reviews, fetchReviewsError } = props;

 
  const count = 0;
  try{
    const items = Object?.keys(reviews);
    count = items.length;
  }catch(e){}

  return (
    <div className={css.sectionReviews}>
      <Heading as="h2" rootClassName={css.sectionHeadingWithExtraMargin}>
        <FormattedMessage id="ListingPage.reviewsTitle" values={{ count: count }} />
      </Heading>
     
      <Reviews reviews={reviews}/>
    </div>
  );
};

export default SectionReviews;
