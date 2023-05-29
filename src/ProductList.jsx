import { useEffect, useState } from "react";
import { gloabalAxiosWithInterceptor as axios } from "./axios";

// Add categoryId as a filter.
// https://fakeapi.platzi.com/en/rest/products-filter

const Product = (props) => {
  return (
    <div>
      <h4>{props.title}</h4>
      <p>${props.price}</p>
      <p>{props.category.name}</p>
      {props.isInCart ? (
        <button onClick={() => props.handleRemoveFromCart(props.id)}>
          Remove from cart
        </button>
      ) : (
        <button onClick={() => props.handleAddToCart(props.id)}>
          Add to cart
        </button>
      )}
    </div>
  );
};

const generateURL = (activeFilters) => {
  const baseURL = "https://api.escuelajs.co/api/v1/products/?";

  let filterString = "";
  let isAndAdded = false;
  for (const filterKey in activeFilters) {
    console.log(isAndAdded);
    if (activeFilters[filterKey]) {
      filterString += `${isAndAdded ? "&" : ""}${filterKey}=${
        activeFilters[filterKey]
      }`;
      isAndAdded = true;
    }
  }

  const finalURL = baseURL + filterString;
  console.log(finalURL);
  return finalURL;
};

const ProductList = () => {
  const [productData, setProductData] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    title: "",
    price_max: 0,
    price_min: 0,
  });
  const [cart, setCart] = useState([]);
  const [isLocalCartInitiaized, setIsLocalCArtInitialized] = useState(false);

  const cartSet = new Set(cart);

  const checkIfProductInCart = (id) => {
    return cartSet.has(id);
  };

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        url: generateURL(activeFilters),
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.request(config);
      setProductData(response?.data);
    };
    fetchData();
  }, [activeFilters.title, activeFilters.price_max, activeFilters.price_min]);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart"));
    if (localCart === null || localCart === undefined) {
      setCart([]);
    } else {
      setCart(localCart);
    }
    setIsLocalCArtInitialized(true);
  }, []);

  useEffect(() => {
    if (isLocalCartInitiaized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const handleTitleChange = (e) =>
    setActiveFilters({
      ...activeFilters,
      title: e.target.value,
    });

  const handleMinPriceChange = (e) =>
    setActiveFilters({
      ...activeFilters,
      [e.target.name]: e.target.value,
    });

  const handleAddToCart = (id) => {
    const newCart = [...cart];
    newCart.push(id);
    setCart(newCart);
  };

  const handleRemoveFromCart = (id) => {
    // [1, 2, 3]
    // 2

    // [1]
    // [1]
    // [1, 3]
    // const newCart = cart.filter((cartItemId) => cartItemId !== id);
    const newCart = [];
    for (let i = 0; i < cart.length; i++) {
      if (cart[i] !== id) {
        newCart.push(cart[i]);
      }
    }
    setCart(newCart);
  };

  return (
    <div>
      <input value={activeFilters.title} onChange={handleTitleChange} />
      <input
        value={activeFilters.price_min}
        onChange={handleMinPriceChange}
        type="number"
        name="price_min"
      />
      <input
        value={activeFilters.price_max}
        onChange={handleMinPriceChange}
        type="number"
        name="price_max"
      />
      <div>
        {productData?.map((product, id) => (
          <Product
            {...product}
            key={id}
            handleAddToCart={handleAddToCart}
            handleRemoveFromCart={handleRemoveFromCart}
            isInCart={checkIfProductInCart(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

// const cart = [1,2,3]
// const newCart = cart
// newCart.push(4);

// console.log(oldCart) [1, 2, 3]
// console.log(newCart) [1, 2, 3, 4]
