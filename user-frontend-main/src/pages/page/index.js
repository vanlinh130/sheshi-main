import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Container from "@/components/container";
import pagesData from "@/apis/pagesApis";
import configPageApis from "@/apis/configPageApis";

const Pages = (props) => {
  const { slug } = useParams();
  const pageShow = pagesData.getPageBySlug(slug);
  const [content, setContent] = useState()
  const fetchDataAbout = async () => {
    const contents = await configPageApis.getListConfigPageContent({
      pageCode: pageShow.content,
    });
    setContent(contents[0]?.content);
  }
  useEffect(() => {
    fetchDataAbout()
  }, [pageShow])

  if (pageShow === undefined || pageShow === "") {
    return <Navigate to="/not-found" />;
  } else {
    React.useEffect(() => {
      window.scrollTo(0, 0);
    }, [pageShow]);
    return (
      <Container title={pageShow.display}>
        <div className="pages">
          <section className="title--page text-center">
            <div className="container">
              <h3>{pageShow.display}</h3>
            </div>
          </section>
          <div className="pages__content gap--30">
            <div className="container">
              <div
                className="pages__content__text"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      </Container>
    );
  }
};

export default Pages;
