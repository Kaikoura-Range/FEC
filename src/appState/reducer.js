

// var actionTest = {
//   type: 'ADD_POSTED_QUESTION',
//   payload: newPost,
// }

// dispatch(actionTest)

function reducer(state, action) {
  let newState;
  const toLog = state.dev.logs && state.dev.reducer
  switch (action.type) {

    case 'PROD_INIT':
      newState = { ...state, ...action.payload}
      if (toLog) {
        console.log('\n\nDEV  STATE-REDUCER   PROD_INIT   prodId: ', newState.currentProduct)
      }
      return newState


    case 'CHANGE_PRODUCT':
      newState = {...state, currentProduct: action.payload}
      if (toLog) {
        console.log('\n\nDEV  STATE-REDUCER   CHANGE_PRODUCT    prodId: ', newState.currentProduct)
      }
      return newState


    case 'ADD_PRODUCT_TO_CART':
      newState = {...state}
      newState.user.cart.push(action.payload)
      if (toLog) {
        console.log('\n\nDEV  STATE-REDUCER   ADD_PRODUCT_TO_CART    added prodId: ', action.payload)
      }
      return newState


    case 'SET_OUTFIT':
      newState = { ...state }
      newState.user.outfit = action.payload
      if (toLog) {
        console.log('\n\nDEV  STATE-REDUCER   SET_OUTFIT   new Outfit: ', newState.currentProduct)
      }
      return newState


    case 'TOGGLE_MODAL':
      newState = {...state}
      newState.modal= action.payload || 'none';
      if (toLog) {
        console.log('\n\nDEV  STATE-REDUCER   TOGGLE_MODAL    changed modal: ', action.payload)
      }
      return newState

    case 'ADD_POSTED_QUESTION':
      newState = {...state}
      newState.QA.results = [ action.payload, ...newState.QA.results ]
      if (toLog) {
        console.log('\n\nDEV  STATE-REDUCER   ADD_POSTED_QUESTION    added question: ', action.payload)
      }
      return newState


    default:
      console.log('\n\nDEV  STATE-REDUCER   default    prodId: ', newState.currentProduct)
      return { ...state};
  }
}

export default reducer;

