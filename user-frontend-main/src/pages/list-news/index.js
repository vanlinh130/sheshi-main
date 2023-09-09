import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import { Link, useParams } from "react-router-dom";
import newsApis from "@/apis/newsApis";
import { Button, Card, Col, Row } from "react-bootstrap";
const ListNews = () => {
  const [news, setNews] = useState([]);
  const fetchNewsBySlug = async () => {
    const result = await newsApis.getNews();
    setNews(result.rows);
  }

  console.log(news)
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
      <section className="text-center">
        <div className="container">
          <div className="row d-flex justify-content-between">
            {news.length > 0 &&
              news.map((detailNews) => (
                <Card
                  style={{ width: "25rem" }}
                  key={detailNews.id}
                  className="col-lg-4 col-sm-6 col-xs-6 mb-3 mt-3"
                >
                  <Card.Img
                    variant="top"
                    style={{
                      objectFit: "cover",
                      height: "20vw",
                      width: "100%",
                    }}
                    src={detailNews.thumbnail}
                  />
                  <Card.Body style={{ textAlign: "center" }}>
                    <Card.Title>{detailNews.title}</Card.Title>
                    <Card.Text>
                      {detailNews.description.length > 200
                        ? detailNews.description.substring(0, 200)
                        : detailNews.description + "..."}
                    </Card.Text>
                    <Link to={`/tin-tuc/${detailNews.slug}`}>
                      {" "}
                      <Button variant="primary">Xem thêm</Button>
                    </Link>
                  </Card.Body>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </Container>
  );
};
export default ListNews;
