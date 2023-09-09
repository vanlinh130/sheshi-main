import React from "react";
import Pagination from "react-bootstrap/Pagination";

const Pagging = () => (
  <div className="custom-paging text-center">
    <Pagination>
      <Pagination.Prev />
      <Pagination.Item>{1}</Pagination.Item>
      <Pagination.Item active>{2}</Pagination.Item>
      <Pagination.Item>{3}</Pagination.Item>
      <Pagination.Ellipsis />
      <Pagination.Next />
    </Pagination>
  </div>
);

export default Pagging;
