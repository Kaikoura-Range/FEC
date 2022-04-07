import React, {useState, useEffect, useRef, useContext} from "react";
import Carousel from "./ProductCarousel.js";
import { DispatchContext } from './../../appState/index.js';
import { FlexRow, FlexColumn } from './../styles/Flex.styled.js'
import { StylesImages, StylesContainer } from './../styles/Styles.styled.js'
import StyledSizeQty from './../styles/SizeQty.styled.js'
import { StyledOverviewContainer, StyledPrice, StyledCurrentStyle, StyledCategory } from './../styles/Overview.styled.js'
import { StyledExpandedViewContainer, StyledExpandedViewModal, StyledDotImage } from './../styles/ExpandedCarouselView.styled.js';
import _ from "underscore";

function ProductInfo(props) {
  const [activeStyle, setActiveStyle] = useState({});
  const [count, setCount] = useState(0);
  const [skus, setSkus] = useState([]);
  const [availableQty, setAvailableQty] = useState(0);
  const [isAddCartValid, setIsAddCartValid] = useState(true);
  const [salePrice, setSalePrice] = useState(null);
  const selectedSize = useRef('default');
  const selectedQuantity = useRef(0);
  const [expandedViewImage, setExpandedViewImage] = useState(null);
  const [expandedViewIndex, setExpandedViewIndex] = useState(null);
  const [showExpandedView, setShowExpandedView] = useState(false);
  const [, dispatch] = useContext(DispatchContext);

  const handleSizeDuplicates = (originalSkus) => {
    const sizeDuplicates = originalSkus.reduce((allSkus, currentSku) => {
      const size = currentSku.size;
      const quantity = currentSku.quantity;
      if (!allSkus[size]) {
        allSkus[size] = quantity;
      } else {
        allSkus[size] += quantity;
      }

      return allSkus;
    }, {});
    return sizeDuplicates;
  }

  // Triggered when the whole product changes
  useEffect(() => {
    if (props.styles) {
      setActiveStyle(props.styles.results[0]);
      if (!props.styles.results.skus) {
        setSkus(['OUT OF STOCK']);
      }
      const initialSkus = handleSizeDuplicates((Object.values(props.styles.results[0].skus)));
      setSkus(Object.entries(initialSkus));
      setCount(prev => prev + 1);
      setExpandedViewIndex(0);
    }
  }, [props.styles])

  // Triggered when the active style changes
  useEffect(() => {
    if (activeStyle.name) {
      const newSkus = handleSizeDuplicates((Object.values(activeStyle.skus)));
      setSkus(Object.entries(newSkus));

      setSalePrice( activeStyle.sale_price || null );
    }
  }, [activeStyle])

  useEffect(() => {
    if (activeStyle.photos) {
      setExpandedViewImage(activeStyle.photos[expandedViewIndex]['url']);
    }
  }, [expandedViewIndex])


  if (activeStyle.name) {
    const {name, category} = props.product;

    const handleSelectedStyle = (e, style) => {
      setActiveStyle(style);
    }

    const allStyles = props.styles.results.map(style =>
      <StylesImages src={style.photos[0].thumbnail_url} alt={style.name} key={style.style_id} onClick={(e) => handleSelectedStyle(e, style)}/>
    )

    const availableSizes = skus.map((sku, index) =>
      <option key={index} value={sku[0]}>{sku[0]}</option>
    )

    const onSizeChange = (e) => {
      const selectedSizeIndex = e.target.options.selectedIndex - 1;

      if (selectedSizeIndex === -1) {
        setAvailableQty(0);
      } else if (skus[selectedSizeIndex][1] > 15) {
        setAvailableQty(15);
      } else {
        setAvailableQty(skus[selectedSizeIndex][1]);
      }
    }

    const availableQuantities = (_.range(1, availableQty + 1)).map((qty, index) =>
      <option key={index} value={qty}>{qty}</option>
    )

    const defaultQty = <option value="none">-</option>;

    const handleAddToCart = () => {
      if (selectedSize.current.value !== 'default') {
        dispatch({
          type: 'ADD_PRODUCT_TO_CART',
          payload: {
            style: activeStyle.name,
            size: selectedSize.current.value,
            quantity: selectedQuantity.current.value,
          }
        })
      } else {
        selectedSize.current.focus();
        setIsAddCartValid(false);
      }
    }

    const toggleExpandedView = (e, index) => {
      setExpandedViewIndex(prev => index || prev);
      setShowExpandedView(prev => !prev);
    }

    const handleArrowsClickExpandedView = (e, num) => {
      const currentIndex = expandedViewIndex;
      const allPhotos = activeStyle.photos.length - 1;
      if (currentIndex + num < 0) {
        setExpandedViewIndex(allPhotos);
      } else if (currentIndex + num > allPhotos) {
        setExpandedViewIndex(0);
      } else {
        setExpandedViewIndex(prev => prev + num);
      }
    }

    const expandedViewDots = activeStyle.photos.map((dot, index) => <StyledDotImage activeDot={expandedViewIndex === index ? true : false } key={index}/>)

    return(<>
      {/**  Expanded View (Modal) */}
      {showExpandedView ?
      <StyledExpandedViewModal onClick={(e) => toggleExpandedView(e, '')}>
        <StyledExpandedViewContainer bgImg={expandedViewImage} onClick={(e) => e.stopPropagation()}>
          <button onClick={(e, num) => handleArrowsClickExpandedView(e, -1)}>Previous</button>
          {expandedViewDots}
          <button onClick={(e, num) => handleArrowsClickExpandedView(e, +1)}>Next</button>
        </StyledExpandedViewContainer>
      </StyledExpandedViewModal> : '' }

      {/**  Carousel */}
      <FlexRow>
      <Carousel photos={activeStyle.photos} handleExpandedView={toggleExpandedView} expandedImage={expandedViewIndex} newProduct={count}/>

      {/**  Right-side (main product info) */}
      <FlexColumn>
        <StyledOverviewContainer>
          <StyledCategory>{category}</StyledCategory>
          <h1>{name}</h1>
          <StyledPrice salePrice={ salePrice ? true : false }><span>${ salePrice ? salePrice  : activeStyle.original_price }</span><span>{ salePrice ? '$' + activeStyle.original_price  : '' }</span></StyledPrice>
          <StyledCurrentStyle><span>style ></span> {activeStyle.name}</StyledCurrentStyle>
        </StyledOverviewContainer>
        <StylesContainer>
          {allStyles}
        </StylesContainer>
          <StyledSizeQty>
            <p>{isAddCartValid ? '' : 'Please select a size'}</p>
            <FlexRow>
              <select name="size" id="size" onChange={onSizeChange} ref={selectedSize} disabled={skus[0] === 'OUT OF STOCK' ? true : false}>
                <option key="default" value="default">{skus[0] === 'OUT OF STOCK' ? 'OUT OF STOCK' : 'SELECT SIZE'}</option>
                {availableSizes}
              </select>
              <select name="quantity" id="quantity" disabled={availableQty ? false : true} ref={selectedQuantity}>
                {selectedSize.current.value === 'default' ? defaultQty : availableQuantities}
              </select>
            </FlexRow>
            <button onClick={handleAddToCart}>Add to cart</button>
            <button>Star</button>
          </StyledSizeQty>
      </FlexColumn>
    </FlexRow></>)
  } else {
    return <p>loading</p>
  }
}

export default ProductInfo;