import styled from 'styled-components';

export const StyledCarouselContainer = styled.div`
  background-image: url(${(({ photo }) => photo ? photo.url : '')});
  background-size: cover;
  width: 65%;
`

export const StyledCarouselPhotos = styled.span`
  background-image: url(${({src}) => src});
  min-height: 60px;
  max-width: 60px;
  background-size: cover;
  border-bottom: ${({ isActive }) => isActive ? '3px solid rgb(247,193,18);' : ''};
`

export const StyledThumbnailContainer = styled.div`
  display: flex;
  margin-left: 30px;
  margin-top: 30px;
  flex-direction: column;
  overflow: auto;
  height: 430px;
`

export const StyledArrowsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15%;

  button {
    width: 30px;
    height: 30px;
    font-size: var(--fs-2);
    font-weight: 400;
    border-radius: 50%;
    margin: 30px 30px 20px;
  }
`
export const StyledArrowButton = styled.button`
  visibility: ${({disabled}) => disabled ? 'hidden' : 'visible'}
`
