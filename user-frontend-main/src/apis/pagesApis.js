import { CONTENT_PAGE } from "@/constants";

const pages = [
  {
    display: "Hướng dẫn mua hàng",
    pageSlug: "huong-dan-mua-hang",
    image: "/imgproduct/dm1.png",
    content: CONTENT_PAGE.POLICY_PAGE_GUIDE,
  },
  {
    display: "Chính sách đổi trả",
    pageSlug: "chinh-sach-doi-tra",
    image: "/imgproduct/dm1.png",
    content: CONTENT_PAGE.POLICY_PAGE_RETURN,
  },
  {
    display: "Chính sách giao hàng",
    pageSlug: "chinh-sach-giao-hang",
    image: "/imgproduct/dm1.png",
    content: CONTENT_PAGE.POLICY_PAGE_DELIVER,
  },
  {
    display: "Chính sách bảo mật",
    pageSlug: "chinh-sach-bao-mat",
    image: "/imgproduct/dm1.png",
    content: CONTENT_PAGE.POLICY_PAGE_SECURITY,
  },
];

const getPageBySlug = (slug) => pages.find((e) => e.pageSlug === slug);

const pageData = {
  getPageBySlug,
};

export default pageData;
