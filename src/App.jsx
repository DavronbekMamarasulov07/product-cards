import { BsFillHeartFill } from "react-icons/bs"; 
import { AiOutlineMenuUnfold } from "react-icons/ai"; 
import { useEffect, useReducer, useState } from 'react'
import './App.css'
import axios from "./api"
import { v4 as uuidv4 } from 'uuid'

const reducer = (state,action) => {
  switch(action.type){
    case "ADD_TO_CARD" :
      return [...state, action.product]
    case "REMOVE_FROM_CART": 
    const newState = state.filter(product => product.id !== action.id)
    return newState
      default:
       return state
  }
}


const showReducer = (showState, showAction) => {
    switch(showAction.type){
      case "CHANGE_WITH":
        return{
          status : !showState.status
        }
    }
}


 


function App() {
  const [products, setProducts] = useState([])
  const [total,setTotal] = useState(0)
  const initialState = []
  const [state,dispatch] = useReducer(reducer,initialState, )
  const [showState,showDispatch] = useReducer(showReducer, {status: false})
 

  useEffect(() => {
    const loadData = async () => {
      const res = await axios("/products")
      const data = res.data.products;
      setProducts(data)

    }
    
    loadData()
  },[])





  useEffect(() => {
    setTotal(state.reduce((acc, b) => acc + b.price, 0).toFixed(2))
  }, [state])


  const addToCart = (product) => {
      dispatch({type: "ADD_TO_CARD", product})

  }

  const removeFromCard = (id) => {
    dispatch({type: "REMOVE_FROM_CART", id})
  }


  const toggleCard = () => {
      showDispatch({type: "CHANGE_WITH"})
  }

 
  const [likedProducts, setLikedProducts] = useState({});

  const toggleLiked = (productId) => {
    setLikedProducts(prevLiked => ({
      ...prevLiked,
      [productId]: !prevLiked[productId]
    }));
  };
 


  return (
    <div className='main_card_content' >
      <div className='products'>
        <h1>Products <button onClick={toggleCard}><AiOutlineMenuUnfold /></button></h1>
        <div className="products_content">
        {
          products.slice(1,-1).map(product =>
            <div key={uuidv4()} className='products_item'>
                <img width={250} height={250} src={product.images[0]} alt="" />
                <h3>{product.title}</h3>
                <span className="product_rating">{product.rating}</span>
                <div className="product_footer">
                  <p className="product_price">${product.price} </p><p className="product_stock">{product.stock}</p>
                </div>
                <button onClick={() => {addToCart(product); toggleLiked(product.id)}}>{likedProducts[product.id] ? (
                    <BsFillHeartFill  style={{ color: 'red' }} />
                  ) : (
                    <BsFillHeartFill  />
                  )}</button>
            </div>
          ) 
        }
        </div>
      </div>
      <div className='card_products' style={showState.status ? {width: "100%"} : {width: "0%",padding: "0", opacity: "0 "}} > 
          <h2 >Card Products
          <strong>Total: ${total}</strong>
          </h2>
          
          {
            state.map(product =>
              <div key={uuidv4()  } className='products_item'>
                  <img width={250} height={250} src={product.images[0]} alt="" />
                  <h3>{product.title}</h3>
                  <span className="product_rating">{product.rating}</span>
                  <p>${product.price} </p><p>{product.stock}</p>
                  <button onClick={() => removeFromCard(product.id)}><BsFillHeartFill  className="product_card_svg"/></button>
              </div>
            ) 
          }
      </div>
    </div>
  )
}

export default App
