




const reducer = (state, action) => {
  console.log('action.payload', action.payload)
  let newState;
  switch (action.type) {
    case 'PROD_INIT':

      newState = action.payload;
      break;
    default:
      throw new Error('App state reducer error');
  }
  return newState;
}

export default reducer;

