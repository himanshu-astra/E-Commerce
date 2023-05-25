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
          <Product {...product} key={id} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
