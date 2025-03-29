import React from "react";
import { Row, Col, Card } from "antd";
import PropTypes from "prop-types";

const DynamicGrid = ({
  fields,
  columns = 2,
  shadow = true,
  maxHeight = "50vh",
}) => {
  const colSpan = 24 / columns;

  return (
    <div className={`max-h-[${maxHeight}] h-[${maxHeight}] overflow-y-auto`}>
      <Card variant="borderless" className={shadow ? "shadow-md" : "shadow-none"}>
        <Row gutter={[16, 16]}>
          {fields.map((field, index) => (
            <Col key={index} span={colSpan}>
              {field}
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

DynamicGrid.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.node).isRequired,
  columns: PropTypes.number,
  bordered: PropTypes.bool,
  shadow: PropTypes.bool,
  maxHeight: PropTypes.string,
};

export default DynamicGrid;