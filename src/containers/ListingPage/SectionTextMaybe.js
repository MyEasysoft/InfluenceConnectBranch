import React from 'react';
import { ExternalLink, Heading } from '../../components';
import { richText } from '../../util/richText';

import css from './ListingPage.module.css';

const MIN_LENGTH_FOR_LONG_WORDS = 20;

const SectionTextMaybe = props => {
  const { text, heading, showAsIngress = false } = props;
  const textClass = showAsIngress ? css.ingress : css.text;
  const content = richText(text, {
    longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
    longWordClass: css.longWord,
    breakChars: '/',
  });

  
  const productLinkOrText = heading === 'Product Link'?
        <ExternalLink href={props.text}>See product</ExternalLink>:<p className={textClass}>{content}</p>;

  return text ? (
    <div className={css.sectionText}>
      {heading ? (
        <Heading as="h2" rootClassName={css.sectionHeading}>
          {heading}
        </Heading>
      ) : null}
      {productLinkOrText}
    </div>
  ) : null;
};

export default SectionTextMaybe;
