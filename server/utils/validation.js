import { isValidPhoneNumber } from "libphonenumber-js";
import { EMAIL_REGEX } from "../config/constants.js";

export const validateName = (name = "") => {
	return name.trim().length > 0;
};

export const validateEmail = (email = "") => {
  return EMAIL_REGEX.test(email);
};

export const validateAndFormatPhone = (phone = "") => {
	const formattedPhone = phone.startsWith("+") ? phone.trim() : `+${phone.trim()}`;
	return isValidPhoneNumber(formattedPhone) ? formattedPhone : null;
};