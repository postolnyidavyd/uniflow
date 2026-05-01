// не порожній рядок
export const required = (value) => String(value ?? '').trim().length > 0;
// валідна пошта
export const validEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? ''));
// мінімальна довжина
export const minLength = (value, length) =>
  String(value ?? '').trim().length >= length;
// максимальна довжина
export const maxLength = (value, length) =>
  String(value ?? '').trim().length <= length;
// export const isInteger = (value)=> Number.isInteger()
export const match = (a, b) => String(a ?? '') === String(b ?? '');           // збіг значень
// export const num   = v => !Number.isNaN(Number(v));                           // число
// export const range = (v, a, b) => num(v) && Number(v) >= a && Number(v) <= b; // число в діапазоні
// export const url   = v => { try { new URL(String(v ?? '')); return true; } catch { return false; } };
// export const rx    = (v, re) => re.test(String(v ?? ''));                     // патерн (regex)
// export const strongPwd = v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/.test(String(v ?? '')); // сильний пароль
//
// Хелпери
export function minLengthHelper(length) {
  return function (value) {
    return minLength(value, length);
  };
}
export function maxLengthHelper(length) {
  return function (value) {
    return maxLength(value, length);
  };
}
export function matchHelper(otherValue) {
    return function (value) {
        return match(value, otherValue);
    };
}
//Функція валідації
export const validate = (values, rules) => {
  const errors = {};
  for (const [field, checks] of Object.entries(rules)) {
    for (const [validationFn, message] of checks) {
      if (!validationFn(values[field])) {
        errors[field] = message;
        break;
      }
    }
  }
  return errors;
};
