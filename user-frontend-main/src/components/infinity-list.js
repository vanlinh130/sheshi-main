import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import ProductCard from "@/components/product-card";

const InfinityList = (props) => {
  const perLoad = 20; // items each load
  const listRef = useRef(null);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setData(props.data.slice(0, perLoad));
    setIndex(1);
  }, [props.data]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (listRef && listRef.current) {
        if (
          window.scrollY + window.innerHeight >=
          listRef.current.clientHeight + listRef.current.offsetTop + 200
        ) {
          setLoad(true);
        }
      }
    });
  }, [listRef]);

  useEffect(() => {
    const getItems = () => {
      const pages = Math.floor(props.data.length / perLoad);
      const maxIndex = props.data.length % perLoad === 0 ? pages : pages + 1;

      if (load && index <= maxIndex) {
        const start = perLoad * index;
        const end = start + perLoad;

        setData(data.concat(props.data.slice(start, end)));
        setIndex(index + 1);
      }
    };
    getItems();
    setLoad(false);
  }, [load, index, data, props.data]);

  return (
    <div ref={listRef}>
      <div className="row">
        {data.map((item, index) => (
          <ProductCard
            class={"col-lg-4 col-sm-6 col-xs-6"}
            key={index}
            img01={item.productImage[0]?.image}
            name={item.name}
            price={Number(item.productDetail[0]?.price)}
            priceDiscount={
              item.discount
                ? Number(
                  item.price -
                  (item.price * item.discount.discountPercent) / 100
                )
                : null
            }
            slug={item.productSlug}
          />
        ))}
      </div>
    </div>
  );
};

InfinityList.propTypes = {
  data: PropTypes.array.isRequired,
};

export default InfinityList;
