import React from 'react';
import { arrayOf, bool, func, node, object, oneOf, shape, string } from 'prop-types';
import classNames from 'classnames';

// Section components
import SectionArticle from './SectionArticle';
import SectionCarousel from './SectionCarousel';
import SectionColumns from './SectionColumns';
import SectionFeatures from './SectionFeatures';

// Styles
// Note: these contain
// - shared classes that are passed as defaultClasses
// - dark theme overrides
// TODO: alternatively, we could consider more in-place way of theming components
import css from './SectionBuilder.module.css';
import SectionFooter from './SectionFooter';
import { H2, ListingCard, NamedLink } from '../../../components';
import SearchPage from '../../SearchPage/SearchPageWithMap';
import ListingCard2 from '../../../components/ListingCard/ListingCard2';

// These are shared classes.
// Use these to have consistent styles between different section components
// E.g. share the same title styles
const DEFAULT_CLASSES = {
  sectionDetails: css.sectionDetails,
  title: css.title,
  description: css.description,
  ctaButton: css.ctaButton,
  blockContainer: css.blockContainer,
};

/////////////////////////////////////////////
// Mapping of section types and components //
/////////////////////////////////////////////

const defaultSectionComponents = {
  article: { component: SectionArticle },
  carousel: { component: SectionCarousel },
  columns: { component: SectionColumns },
  features: { component: SectionFeatures },
  footer: { component: SectionFooter },
};

//////////////////////
// Section builder //
//////////////////////

const SectionBuilder = props => {
  const { sections, options ,listings} = props;
  const { sectionComponents = {}, isInsideContainer, ...otherOption } = options || {};

  // If there's no sections, we can't render the correct section component
  if (!sections || sections.length === 0) {
    return null;
  }

  // Selection of Section components
  const components = { ...defaultSectionComponents, ...sectionComponents };
  const getComponent = sectionType => {
    const config = components[sectionType];
    return config?.component;
  };

  //console.log(listings+"                 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

  let first = true;
  return (
    <>
    
      {sections.map((section, index) => {
        const Section = getComponent(section.sectionType);
        // If the default "dark" theme should be applied (when text color is white).
        // By default, this information is stored to customAppearance field
        const isDarkTheme = section?.appearance?.textColor === 'white';
        const classes = classNames({ [css.darkTheme]: isDarkTheme });

       
        first = false;
        

        if (Section) {
          return (
            <>
              <Section
                key={`${section.sectionId}_${index}`}
                className={classes}
                defaultClasses={DEFAULT_CLASSES}
                isInsideContainer={isInsideContainer}
                options={otherOption}
                {...section}
              />
             
             {index === 0 && listings !== undefined? (
              <>
                <ListingView  listings={listings.data} images={listings.included} />
              </>
              ) : ""}

            </>
           
            
          );
        } else {
          // If the section type is unknown, the app can't know what to render
          console.warn(`Unknown section type (${section.sectionType}) detected.`);
          return null;
        }
      })}
    </>
  );
};


const getImageIndex = (images,imageId) => {
  
  if(images === undefined || images === null || imageId === undefined)return null;
  const keys = Object?.keys(images);
  let index = null;
  keys.forEach(key => {
    
    try{
        if(parseInt(images[0]) !== undefined && images[key].id.uuid === imageId){
          index = key;
        }
    }catch(error){}
   
  });
  return index;
};


const ListingView = props =>{
  //listings[0].id.uuid
  const{listings,images} = props;
  const lists = listings;
  
  const hasListings = lists !== undefined;
  let listCount = 0;
  
   if(hasListings){
    return <div>     
      <ul>
        <div className={classNames(css.textCenter,css.marginT) }>
          <h2 >PRODUCTS & OPPORTUNITIES</h2>
          <p className={css.textCenter}>Collaboration opportunities posted by sellers and brands seeking Influencers to create shoppable videos for their products</p>
        </div>
        <div className={css.mainContainer}>
                  <div className={classNames(css.container, css.marginB)}> 

           {hasListings?
               lists.map((list,index)=>{
                let marginTop = index>2?css.marginT: "";
                let imgId = "";
                try{
                  imgId =  list?.relationships?.images?.data[0]?.id?.uuid;
                }catch(e){}
                
                let imageIndex = getImageIndex(images,imgId);
                
                
                if(listCount > 2 ||imageIndex === undefined || imageIndex === null){
                  return;
                }
                
                listCount += 1;
                
      //index - 1 is important to make sure the data tallies with the index to load the LandingPage listing properly.
               return (
                    <div className={classNames(css.listItem,marginTop) }><ListingCard2  listing={list} images={images} index={parseInt(imageIndex)} /></div>
               )
            })
           :""
           }
         
         </div>
        </div>

           <div className={css.textCenter}>
              <NamedLink className={css.viewAll}  name="SearchPage">
                VIEW ALL
              </NamedLink>
           </div>
        
      </ul>
    </div>
   }
  return(
    ""
  );
}

const propTypeSection = shape({
  sectionId: string.isRequired,
  sectionType: oneOf(['article', 'carousel', 'columns', 'features']).isRequired,
  // Plus all kind of unknown fields.
  // BlockBuilder doesn't really need to care about those
});

const propTypeOption = shape({
  fieldComponents: shape({ component: node, pickValidProps: func }),
  blockComponents: shape({ component: node }),
  sectionComponents: shape({ component: node }),
  // isInsideContainer boolean means that the section is not taking
  // the full viewport width but is run inside some wrapper.
  isInsideContainer: bool,
});

const defaultSections = shape({
  sections: arrayOf(propTypeSection),
  options: propTypeOption,
});

const customSection = shape({
  sectionId: string.isRequired,
  sectionType: string.isRequired,
  // Plus all kind of unknown fields.
  // BlockBuilder doesn't really need to care about those
});
const propTypeOptionForCustomSections = shape({
  fieldComponents: shape({ component: node, pickValidProps: func }),
  blockComponents: shape({ component: node }),
  sectionComponents: shape({ component: node }).isRequired,
  // isInsideContainer boolean means that the section is not taking
  // the full viewport width but is run inside some wrapper.
  isInsideContainer: bool,
});

const customSections = shape({
  sections: arrayOf(customSection),
  options: propTypeOptionForCustomSections.isRequired,
  listings:object,
});

SectionBuilder.defaultProps = {
  sections: [],
  options: null,
  listings:[]
};

SectionBuilder.propTypes = oneOf([defaultSections, customSections]).isRequired;

export default SectionBuilder;
