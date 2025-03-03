import React from "react";
import { FaTrash } from "react-icons/fa";
import { toCamelCase } from "./utils/camel-case";

const Field = ({ field, updateField, removeField, moveFieldUp, moveFieldDown, index, errors, validateField }) => {
  const renderFieldInput = () => (
    <input
      type={field.type}
      className="form-control"
      placeholder={`Enter ${field.label || "field value"}`}
      value={field.value}
      onChange={(e) => {
        updateField(field.id, "value", e.target.value);
        validateField(field);
      }}
      onBlur={() => validateField(field)}
    />
  );

  const errorMessage = errors[toCamelCase(field.label) || field.id];

  return (
    <div key={field.id} className="dynamic-field">
      <div className="row field-header">
        <div className="col-md-4">
          <label className="form-label">Field Type</label>
          <select
            className="form-select"
            value={field.type}
            onChange={(e) => updateField(field.id, "type", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Label</label>
          <input
            type="text"
            className="form-control"
            value={field.label}
            onChange={(e) => updateField(field.id, "label", e.target.value)}
            placeholder="Enter field label"
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={field.required}
              onChange={(e) => updateField(field.id, "required", e.target.checked)}
              id={`required-${field.id}`}
            />
            <label className="form-check-label" htmlFor={`required-${field.id}`}>
              Required
            </label>
          </div>
        </div>
        <div className="col-md-2 d-flex align-items-end field-actions">
          <button
            type="button"
            className="btn btn-sm btn-danger btn-custom"
            onClick={() => removeField(field.id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-12">
          <label className="form-label">Field Value</label>
          {renderFieldInput()}
          {errorMessage && <div className="text-danger">{errorMessage}</div>}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <button
            type="button"
            className="btn btn-secondary btn-custom me-2"
            onClick={() => moveFieldUp(index)}
          >
            Move Up
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-custom"
            onClick={() => moveFieldDown(index)}
          >
            Move Down
          </button>
        </div>
      </div>
    </div>
  );
};

export default Field;
