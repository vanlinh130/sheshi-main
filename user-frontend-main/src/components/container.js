import React from "react";
import { Helmet } from "react-helmet";

const Container = ({
  title = "CÔNG TY CỔ PHẦN TẬP ĐOÀN SHESHI",
  description = "SHESHI là thương hiệu mỹ phẩm cao cấp được xây dựng từ tâm huyết của những con người có kinh nghiệm lâu năm trong lĩnh vực làm đẹp và mỹ phẩm. Những sản phẩm tại SHESHI đều đã được trải qua nhiều công đoạn dày công nghiên cứu và phát triển để đem đến cho khách hàng những sản phẩm chất lượng tốt nhất.",
  image = window.location.origin + "/sheshicosmetic.jpg",
  children,
  className,
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={window.location.href} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:image" content={image} />
        <meta property="twitter:site" content={window.location.href} />
      </Helmet>
      {children}
    </>
  );
};

export default Container;
