import { validateName, validateEmail, validateAndFormatPhone } from "../utils/validation.js";

export const validateLead = async (req, res, next) => {
	try {
		const { name = null, email = null, phone = null } = req.body;
		if (!name || !email || !phone) {
			return res.status(400).json({ message: "Invalid Lead" });
		}
		if (!validateName(name)) {
			return res.status(400).json({ message: "Invalid Name" });
		}
		if (!validateEmail(email)) {
			return res.status(400).json({ message: "Invalid Email" });
		}
		const formattedPhone = validateAndFormatPhone(phone);
		if (!formattedPhone) {
			return res.status(400).json({ message: "Invalid Phone" });
		}
		req.body.phone = formattedPhone;
		next();
	} catch (error) {
		console.error("Lead Validation error:", error);
    return res.status(400).json({ message: "Invalid Lead" });
	}
};