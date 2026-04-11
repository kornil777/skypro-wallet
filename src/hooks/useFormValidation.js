import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';

    if (rule.required && (!value || value.trim() === '')) {
      return rule.message || 'Поле обязательно для заполнения';
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || 'Неверный формат';
    }

    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `Минимум ${rule.minLength} символов`;
    }

    return '';
  }, [validationRules]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) newErrors[name] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules, validateField]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Если поле уже было тронуто, пересчитываем ошибку
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const setAllTouched = useCallback(() => {
    const allTouched = {};
    Object.keys(validationRules).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    // Пересчитываем ошибки для всех полей
    const newErrors = {};
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) newErrors[name] = error;
    });
    setErrors(newErrors);
  }, [validateField, values, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isFormValid = useCallback(() => {
    // Проверяем, что все обязательные поля заполнены и нет ошибок
    const allFieldsValid = Object.keys(validationRules).every(name => {
      const value = values[name];
      const hasValue = value && value.toString().trim() !== '';
      const noError = !errors[name];
      return hasValue && noError;
    });
    return allFieldsValid;
  }, [values, errors, validationRules]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    isFormValid,
    setAllTouched,
  };
};