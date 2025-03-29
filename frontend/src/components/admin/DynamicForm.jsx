import React from "react";
import { Row, Col } from "antd";
import PropTypes from "prop-types";

const DynamicForm = ({
  fields,
  columns = 2,
  maxHeight = "50vh",
  footer = null,
}) => {
  const defaultColSpan = 24 / columns;
  return (
    <>
        <div className={`max-h-[${maxHeight}] overflow-y-auto pr-4`}>
        <Row gutter={[16, 16]}>
            {fields.map((field, index) => (
                <Col key={index} span={defaultColSpan}>
                {field}
            </Col>
            ))}
        </Row>
        </div>
        {footer && <div className="mt-6 text-right">{footer}</div>}
    </>
  );
};

DynamicForm.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.node).isRequired,
  columns: PropTypes.number,
  maxHeight: PropTypes.string,
  footer: PropTypes.node,
};

export default DynamicForm;