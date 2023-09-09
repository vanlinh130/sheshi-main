import React, { useCallback, useState, useEffect, useRef } from "react";
import Container from "@/components/container";
import CheckBox from "@/components/checkbox";
import productData from "@/apis/productApis";
import capacitys from "@/apis/capacityApis";
import categoryApis from "@/apis/categoryApis";
import Button from "@/components/button";
import InfinityList from "@/components/infinity-list";
import productsApis from "@/apis/productApis";
import { GLOBAL_STATUS } from "@/constants";

const initFilter = {
  category: [],
  capacity: [],
};

const Catalog = () => {
  const filterRef = useRef(null);
  const [filter, setFilter] = useState(initFilter);
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsOption, setProductsOption] = useState([]);

  const getListCategory = async () => {
    setCategory(await categoryApis.getAllCategory())
  }

  const getListProduct = async () => {
    const params = {
      size: 14,
      getMainImage: true,
      status: GLOBAL_STATUS.ACTIVE
    };

    const result = await productsApis.getAllProducts(params);
    setProducts(result.rows)
    setProductsOption(result.rows)
  }

  const updateProducts = useCallback(() => {
    let temp = productsOption;

    if (filter.category.length > 0) {
      temp = temp?.filter((e) => filter.category.includes(e.productCategory.categorySlug));
    }

    // if (filter.capacity.length > 0) {
    //   temp = temp.filter(e => {
    //     const check = e.capacitys.find(capacity => filter.capacity.includes(capacity))
    //     return check !== undefined
    //   })
    // }

    setProducts(temp);
  }, [filter]);

  useEffect(() => {
    getListCategory()
    getListProduct()
  }, [])

  useEffect(() => {
    updateProducts();
  }, [updateProducts]);

  const filterSelect = (type, checked, item) => {
    if (checked) {
      switch (type) {
        case "CATEGORY":
          setFilter({
            ...filter,
            category: [...filter.category, item.categorySlug],
          });
          break;
        case "CAPACITY":
          setFilter({ ...filter, capacity: [...filter.capacity, item.capacity] })
          break
        default:
      }
    } else {
      switch (type) {
        case "CATEGORY":
          const newCategory = filter.category.filter(
            (e) => e !== item.categorySlug
          );
          setFilter({ ...filter, category: newCategory });
          break;
        case "CAPACITY":
          const newCapacity = filter.capacity.filter(e => e !== item.capacity)
          setFilter({ ...filter, capacity: newCapacity })
          break
        default:
      }
    }
  };

  const clearFilter = () => setFilter(initFilter);
  const showHideFilter = () => filterRef.current.classList.toggle("active");

  return (
    <Container title="Sản phẩm">
      <section className="title--page text-center">
        <div className="container">
          <h3>Sản phẩm</h3>
        </div>
      </section>
      <div className="container mt-5">
        <div className="catalog">
          <div className="catalog__filter" ref={filterRef}>
            <div
              className="catalog__filter__close"
              onClick={() => showHideFilter()}
            >
              <i className="bi bi-x"></i>
            </div>
            <div className="catalog__filter__widget">
              <div className="catalog__filter__widget__title">
                Danh mục sản phẩm
              </div>
              <div className="catalog__filter__widget__content">
                {category.map((item, index) => (
                  <div
                    key={index}
                    className="catalog__filter__widget__content__item"
                  >
                    <CheckBox
                      label={item.name}
                      onChange={(input) =>
                        filterSelect("CATEGORY", input.checked, item)
                      }
                      checked={filter.category.includes(item.categorySlug)}
                    />
                  </div>
                ))}
              </div>
            </div>
{/* 
            <div className="catalog__filter__widget">
              <div className="catalog__filter__widget__title">
                Dung tích/ Trọng lượng
              </div>
              <div className="catalog__filter__widget__content">
                {
                  capacitys.map((item, index) => (
                    <div key={index} className="catalog__filter__widget__content__item">
                      <CheckBox
                        label={item.display}
                        onChange={(input) => filterSelect("CAPACITY", input.checked, item)}
                        checked={filter.capacity.includes(item.capacity)}
                      />
                    </div>
                  ))
                }
              </div>
            </div> */}

            <div className="catalog__filter__widget">
              <div className="catalog__filter__widget__content">
                <div className="btn-fillter">
                  <Button className="btn-sm" onClick={clearFilter}>
                    <i className="bi bi-x"></i> Xóa bộ lọc
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="catalog__filter__toggle">
            <Button onClick={() => showHideFilter()}>
              <i className="bi bi-funnel"></i> Bộ lọc
            </Button>
          </div>
          <div className="catalog__content">
            {products && <InfinityList data={products} />}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Catalog;
