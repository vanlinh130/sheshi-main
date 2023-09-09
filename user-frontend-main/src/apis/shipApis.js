import { TOKEN_API } from "@/constants";
import axiosClient from "./axiosClient";

const shipApis = {
  getCity: (body) =>
    axiosClient.post(
      `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
      body,
      {
        headers: {
          token: "92565b32-00d1-11ed-8636-7617f3863de9",
        },
      }
    ),
  getDistrict: (body) =>
    axiosClient.post(
      `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
      body,
      {
        headers: {
          token: "92565b32-00d1-11ed-8636-7617f3863de9",
        },
      }
    ),
  getService: (body) =>
    axiosClient.post(
      `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`,
      body,
      {
        headers: {
          token: TOKEN_API.GIAO_HANG_NHANH,
        },
      }
    ),
  calculatorFeeGhn: (body) =>
    axiosClient.post(
      `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
      body,
      {
        headers: {
          token: TOKEN_API.GIAO_HANG_NHANH,
        },
      }
    ),
  calculatorFeeGhtk: (params) =>
    axiosClient.get("/api/order/calculator-fee-ghtk", { params }),
};

export default shipApis;
