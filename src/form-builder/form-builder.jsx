import React from "react";
import { Toaster } from "sonner";
import useFormBuilder from "../components/hook/useFormBuilder";
import Field from "../components/field";

const FormBuilder = () => {
  const {
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
  } = useFormBuilder();

  return (
    <div className="container mt-5">
      <h1>Dynamic Form Builder</h1>
      <hr />
      <button className="btn btn-primary mb-3 btn-custom" onClick={addField}>
        Add Field
      </button>
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <Field
            key={field.id}
            field={field}
            updateField={updateField}
            removeField={removeField}
            moveFieldUp={moveFieldUp}
            moveFieldDown={moveFieldDown}
            index={index}
            errors={errors}
            validateField={validateField}
          />
        ))}
        {fields.length > 0 && (
          <button
            type="submit"
            className="btn btn-success btn-custom submit-btn"
            disabled={!isFormValid}
          >
            Submit
          </button>
        )}
      </form>
      <Toaster />
    </div>
  );
};

export default FormBuilder;
