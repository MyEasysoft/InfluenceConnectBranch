import React from 'react';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { arrayOf, string } from 'prop-types';
import classNames from 'classnames';
import { Avatar, ReviewRating, UserDisplayName } from '../../components';
import { propTypes } from '../../util/types';

import css from './Reviews.module.css';

const Review = props => {
  const { review, intl } = props;

  const date = review.seller_reviewDate;
  const dateString = intl.formatDate(date, { month: 'long', year: 'numeric' });

  return (
    <div className={css.review}>
      <Avatar className={css.avatar} user={review.buyerId} />
      <div>
        <ReviewRating
          rating={review.seller_reviewRating}
          className={css.mobileReviewRating}
          reviewStarClassName={css.reviewRatingStar}
        />
        <p className={css.reviewContent}>{review.seller_reviewContent}</p>
        <p className={css.reviewInfo}>
          <UserDisplayName user={review.seller_displayName} intl={intl} />
          <span className={css.separator}>•</span>
          {dateString}
          <span className={css.desktopSeparator}>•</span>
          <span className={css.desktopReviewRatingWrapper}>
            <ReviewRating
              rating={review.seller_reviewRating}
              className={css.desktopReviewRating}
              reviewStarClassName={css.reviewRatingStar}
            />
          </span>
        </p>
      </div>
    </div>
  );
};

Review.propTypes = {
  review: propTypes.review.isRequired,
  intl: intlShape.isRequired,
};

const ReviewsComponent = props => {
  const { className, rootClassName, reviews, intl } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <ul className={classes}>

      {reviews !== null && Object.keys(reviews).map((r,key) => {
        return (
          <li key={`Review_${reviews[key].listingId}`} className={css.reviewItem}>
            <Review review={reviews[key]} intl={intl} />
          </li>
        );
      })}
    </ul>
  );
};

ReviewsComponent.defaultProps = {
  className: null,
  rootClassName: null,
  reviews: {},
};

ReviewsComponent.propTypes = {
  className: string,
  rootCalssName: string,
  reviews: arrayOf(propTypes.review),

  // from injectIntl
  intl: intlShape.isRequired,
};

const Reviews = injectIntl(ReviewsComponent);

export default Reviews;
