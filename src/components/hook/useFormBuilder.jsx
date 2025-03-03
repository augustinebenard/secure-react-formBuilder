import { useState, useCallback, useEffect } from "react";
import * as yup from "yup";
import { toast } from "sonner";
import { toCamelCase } from "../utils/camel-case";

const useFormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const addField = () => {
    const newField = {
      id: Date.now(),
      type: "text",
      label: "",
      required: false,
      value: "",
    };
    setFields([...fields, newField]);
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateField = (id, key, value) => {
    setFields(
      fields.map((field) => (field.id === id ? { ...field, [key]: value } : field))
    );
  };

  const moveField = (fromIndex, toIndex) => {
    const newFields = [...fields];
    [newFields[fromIndex], newFields[toIndex]] = [newFields[toIndex], newFields[fromIndex]];
    setFields(newFields);
  };

  const moveFieldUp = (index) => {
    if (index === 0) return;
    moveField(index, index - 1);
  };

  const moveFieldDown = (index) => {
    if (index === fields.length - 1) return;
    moveField(index, index + 1);
  };

  const validateFields = useCallback((fields) => {
    const schemaShape = fields.reduce((acc, field) => {
      const key = toCamelCase(field.label) || field.id;
      let validator = yup.string();

      switch (field.type) {
        case "email":
          validator = yup.string().email("Invalid email format");
          break;
        case "number":
          validator = yup.number().typeError("Must be a number");
          break;
        case "date":
          validator = yup.date().typeError("Must be a valid date");
          break;
        default:
          break;
      }

      if (field.required) {
        validator = validator.required(`${field.label || "Field"} is required`);
      }

      acc[key] = validator;
      return acc;
    }, {});

    return yup.object().shape(schemaShape);
  }, []);

  const validateField = async (field) => {
    const key = toCamelCase(field.label) || field.id;
    const schema = yup.object().shape({
      [key]: validateFields([field]).fields[key],
    });

    try {
      await schema.validate({ [key]: field.value }, { abortEarly: false });
      setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    } catch (err) {
      if (err.inner) {
        const errorMessages = err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setErrors((prevErrors) => ({ ...prevErrors, ...errorMessages }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const serializedData = fields.reduce((acc, field) => {
      const key = toCamelCase(field.label) || field.id;
      acc[key] = field.value;
      return acc;
    }, {});

    const schema = validateFields(fields);

    try {
      const validData = await schema.validate(serializedData, { abortEarly: false });
      console.log("Form Submitted:", validData);
      toast.success("Form submitted successfully. Check the console for data.");
    } catch (err) {
      if (err.inner) {
        const errorMessages = err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        console.log("Validation Errors:", errorMessages);
        setErrors(errorMessages);
        toast.error("Form has errors. Please fix them.");
      } else {
        console.log(err);
        toast.error("Form validation failed.");
      }
    }
  };

  useEffect(() => {
    const validateAllFields = async () => {
      const allErrors = {};
      for (const field of fields) {
        const key = toCamelCase(field.label) || field.id;
        const schema = yup.object().shape({
          [key]: validateFields([field]).fields[key],
        });

        try {
          await schema.validate({ [key]: field.value }, { abortEarly: false });
          allErrors[key] = "";
        } catch (err) {
          if (err.inner) {
            const errorMessages = err.inner.reduce((acc, curr) => {
              acc[curr.path] = curr.message;
              return acc;
            }, {});
            Object.assign(allErrors, errorMessages);
          }
        }
      }
      setErrors(allErrors);
      setIsFormValid(Object.values(allErrors).every((error) => error === ""));
    };

    validateAllFields();
  }, [fields, validateFields]);

  return {
    fields,
    addField,
    removeField,
    updateField,
    moveFieldUp,
    moveFieldDown,
    handleSubmit,
    errors,
    isFormValid,
    validateField,
  };
};

export default useFormBuilder;
