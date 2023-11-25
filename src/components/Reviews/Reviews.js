import React from 'react';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { arrayOf, string } from 'prop-types';
import classNames from 'classnames';
import { Avatar, ReviewRating, UserDisplayName } from '../../components';
import { propTypes } from '../../util/types';

import css from './Reviews.module.css';

const Review = props => {
  const { review, intl } = props;

  const date = review.seller_reviewRating;
  const dateString = intl.formatDate(date, { month: 'long', year: 'numeric' });

  return (
    <div className={css.review}>
      <Avatar className={css.avatar} user={review.author} />
      <div>
        <ReviewRating
          rating={review.rating}
          className={css.mobileReviewRating}
          reviewStarClassName={css.reviewRatingStar}
        />
        <p className={css.reviewContent}>{review.seller_reviewContent}</p>
        <p className={css.reviewInfo}>
          <UserDisplayName user={review.author} intl={intl} />
          <span className={css.separator}>•</span>
          {dateString}
          <span className={css.desktopSeparator}>•</span>
          <span className={css.desktopReviewRatingWrapper}>
            <ReviewRating
              rating={review.rating}
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
      {Object.keys(reviews).map((r,key) => {
        return (
          <li key={`Review_${r.listingId}`} className={css.reviewItem}>
            <Review review={r} intl={intl} />
          </li>
        );
      })}
    </ul>
  );
};

ReviewsComponent.defaultProps = {
  className: null,
  rootClassName: null,
  reviews: [],
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
