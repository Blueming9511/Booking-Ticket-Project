import React from "react";
import PropTypes from "prop-types";

const FieldDisplay = ({ label, value, icon, renderValue }) => {
  return (
    <p className="mb-3 text-sm">
      <strong className="text-gray-600">
        {icon} {label}:
      </strong>{" "}
      <span className="text-gray-800">
        {renderValue ? renderValue(value) : value || "N/A"}
      </span>
    </p>
  );
};

FieldDisplay.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  icon: PropTypes.string,
  renderValue: PropTypes.func,
};

export default FieldDisplay;