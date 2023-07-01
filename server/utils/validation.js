import { isValidPhoneNumber } from "libphonenumber-js";
import { NAME_REGEX, EMAIL_REGEX } from "../config/constants.js";

export const validateName = (name = "") => {
  return name.trim().length > 0 && NAME_REGEX.test(name.trim());
};

export const validateEmail = (email = "") => {
  return EMAIL_REGEX.test(email);
};

export const validateAndFormatPhone = (phone = "") => {
  const formattedPhone = `+${phone.trim().replace(/\D/g, '')}`;
  return isValidPhoneNumber(formattedPhone) ? formattedPhone : null;
};
