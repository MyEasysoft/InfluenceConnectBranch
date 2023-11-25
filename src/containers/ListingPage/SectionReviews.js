import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { Heading, H2, Reviews } from '../../components';

import css from './ListingPage.module.css';

const SectionReviews = props => {
  const { reviews, fetchReviewsError } = props;

  const items = Object?.keys(reviews);
  const count = items.length;

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
