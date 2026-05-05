"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUtils = void 0;
class ValidationUtils {
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static isValidPhone(phone) {
        const phoneRegex = /^(\+880|880)?1[3-9]\d{8}$/;
        return phoneRegex.test(phone);
    }
    static sanitizeString(str) {
        return str.replace(/<[^>]*>/g, '').trim();
    }
    static isValidName(name) {
        return name.trim().length >= 2 && name.trim().length <= 100;
    }
}
exports.ValidationUtils = ValidationUtils;
//# sourceMappingURL=validation.js.map