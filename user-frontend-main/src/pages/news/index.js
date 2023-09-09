import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import { useParams } from "react-router-dom";
import newsApis from "@/apis/newsApis";
const News = () => {
  const { slug } = useParams();
  const [news, setNews] = useState();
  const fetchNewsBySlug = async () => {
    const result = await newsApis.getDetailNews(slug);
    setNews(result);
  }

  useEffect(() => {
    fetchNewsBySlug()
  }, [])
  return (
    <Container title={news?.nameNews} description={news?.descriptionSEO}>
      <section className="title--page text-center">
        <div className="container">
          <h3>Tin tức</h3>
        </div>
      </section>
      <section className="academy-page gap--60">
        <div className="container">
          <div className="">
            <div className="col-lg-12">
              <div className="academy-page__title">
                <h4>{news?.nameNews}</h4>
              </div>
              <div
                className="academy-page__content"
                dangerouslySetInnerHTML={{ __html: news?.content }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
};
export default News;
