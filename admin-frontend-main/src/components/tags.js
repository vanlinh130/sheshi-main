import { Tag } from "antd";
import React from "react";

export class Tags {
  static Normal({ children }) {
    return <Tag>{children}</Tag>;
  }

  static Red({ children }) {
    return <Tag color="red">{children}</Tag>;
  }

  static Orange({ children }) {
    return <Tag color="orange">{children}</Tag>;
  }

  static Green({ children }) {
    return <Tag color="green">{children}</Tag>;
  }

  static Volcano({ children }) {
    return <Tag color="volcano">{children}</Tag>;
  }

  static Purple({ children }) {
    return <Tag color="purple">{children}</Tag>;
  }
}
