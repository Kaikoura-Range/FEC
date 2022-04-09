
import get from './get.js'
import methods from './post.js'
const { post, report, upvote } = methods


Promise.all.obj = (asyncObj) => {
  const promiseArray = []
  const indToKey = Object.keys(asyncObj).map((key, ind) => {
    promiseArray.push(asyncObj[key])
    return key
  })
  return Promise.all(promiseArray)
    .then(allRes => allRes.reduce((memo, result, ind) => {
        memo[indToKey[ind]] = result
        return memo
      }, {}))
    .catch(err => {
      console.log('Promise.all.obj err', err)
      console.log('input obj', asyncObj)
    })
}


const loadNewProduct = (productId, dispatch) => {
  get.allProductData(productId)
  .then((response) => {
    response.currentProduct = productId
    dispatch({
      type: 'PROD_INIT',
      payload: response,
    });
  })
  .catch((err) => {
    console.log('Data init fetch error: ', err)
    dispatch({ type: '' }) //sets state so that the app rerenders and trys again.
  })
}

const load = {
  newProduct: loadNewProduct
}

const api = { get, post, load, report, upvote };


export default api;






// const productId = 37311;
// const testObj = {
//   product: [`/products/${productId}`, {}],
//   styles: [`/products/${productId}/styles`, {}]
// }
// const testArray = [
//    [`/products/${productId}`, {}],
//    [`/products/${productId}/styles`, {}]
// ]



// get.all(testObj)
// .then(objRes => console.log('objRes', objRes))

// get.all(testArray)
// .then(ArrayRes => console.log('ArrayRes', ArrayRes))
