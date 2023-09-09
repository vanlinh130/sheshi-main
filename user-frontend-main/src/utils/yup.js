import * as yup from "yup";
import i18n from "../locales/i18n";

yup.setLocale({
  mixed: {
    required: () => i18n.t("validations:required"),
    default: ({ path }) => `${i18n.t(path)} ${i18n.t("validations:invalid")}`,
  },
  string: {
    email: i18n.t("validations:email"),
    min: ({ min }) => i18n.t("validations:minLength", { min }),
    max: ({ max }) => i18n.t("validations:maxLength", { max }),
    length: ({ length }) => i18n.t("validations:length", { length }),
  },
  number: {
    min: ({ min }) => i18n.t("validations:min", { min }),
    max: ({ max }) => i18n.t("validations:max", { max }),
  },
});

export default yup;
