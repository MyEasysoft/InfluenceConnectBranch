import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { IconReviewStar } from '../../components';
import { REVIEW_RATINGS } from '../../util/types';

const ReviewRating = props => {
  const { className, rootClassName, reviewStarClassName, rating } = props;
  const classes = classNames(rootClassName, className);

  const stars = REVIEW_RATINGS;
  return (
    <span className={classes} title={`${rating}/5`}>
      {stars.map(star => (
        <IconReviewStar
          key={`star-${star}`}
          className={reviewStarClassName}
          isFilled={star <= rating}
          onClick={(event, newValue) => {
            setValue(newValue);
          }}
        />
      ))}
    </span>
  );
};

ReviewRating.defaultProps = {
  rootClassName: null,
  className: null,
  reviewStarClassName: null,
};

const { string, oneOf } = PropTypes;

ReviewRating.propTypes = {
  rating: oneOf(REVIEW_RATINGS).isRequired,
  reviewStartClassName: string,
  rootClassName: string,
  className: string,
};

export default ReviewRating;
