export class ValidationUtils {
    
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+880|880)?1[3-9]\d{8}$/;
    return phoneRegex.test(phone);
  }

  static sanitizeString(str: string): string {
    return str.replace(/<[^>]*>/g, '').trim();
  }

  static isValidName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 100;
  }
}