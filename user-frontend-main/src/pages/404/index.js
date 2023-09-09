import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "@/components/container";

const Notfound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const homePage = () => {
    navigate("/");
  };
  return (
    <Container title={t("404")}>
      <div className="page-404">
        <div className="container">
          <div className="page-404__box">
            <h1>{t("404")}</h1>
            <p>{t("404_subtitle")}</p>
            <button onClick={homePage} className="btn btn-primary">
              {t("go_homepage")}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};
export default Notfound;
