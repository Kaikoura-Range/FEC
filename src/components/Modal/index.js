import React, { useContext, useState, useEffect } from 'react';
import CompareModal from './Compare'
import { StateContext, DispatchContext } from '../../appState/index';
import { checkModalState, toggleModal } from './methods.js'
import componentsInit from './components'

const fadeTime = 300
const {  ModalContent, ModalContainer } = componentsInit(fadeTime)

const Modals = {
  none: null,
  compare: CompareModal,

}


const Modal = ({ children }) => {
  const [state] = useContext(StateContext)
  const [, dispatch] = useContext(DispatchContext)
  const [modalOpen, setModalOpen] = useState(false)
  const Child = Modals[state.modal.name] || null;
  const toShow = !!Child

  useEffect(() => {
    checkModalState(toShow, modalOpen, setModalOpen, fadeTime)
  }, [toShow, modalOpen])

  const modalToggle = toShow ? () => toggleModal(dispatch) : () => toggleModal(dispatch, 'compare')
  return Child && (
    <ModalContainer open={modalOpen}  show={toShow} onClick={modalToggle} data-testid="Modal" >
      <ModalContent show={toShow} onClick={(e) => e.stopPropagation()} >
        <Child { ...state.modal.props } />
      </ModalContent>
    </ModalContainer>
  )
}



export default Modal