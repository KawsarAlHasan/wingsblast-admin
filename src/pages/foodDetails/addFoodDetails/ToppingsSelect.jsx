import React from "react";
import { Card, Checkbox, Col, Row } from "antd";

const ToppingsSelect = ({
  toppings,
  selectedToppings,
  handleToppingsSelection,
  handleToggleToppingsPaid,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {toppings?.map((item) => {
        const selectedTopping = selectedToppings.find(
          (toppings) => toppings.toppings_id === item.id
        );
        const isSelected = !!selectedTopping;
        const isPaid = selectedTopping?.isPaid || false;

        return (
          <Col key={item.id} span={6}>
            <Card
              title={item.name}
              bordered={true}
              style={{ textAlign: "center" }}
            >
              {/* toppings Selection Checkbox */}
              <Checkbox
                checked={isSelected}
                onChange={(e) =>
                  handleToppingsSelection(item.id, e.target.checked)
                }
              >
                Select
              </Checkbox>

              {/* Paid/Unpaid Checkbox */}
              <Checkbox
                checked={isPaid}
                onChange={(e) =>
                  handleToggleToppingsPaid(item.id, e.target.checked)
                }
                disabled={!isSelected}
              >
                {isPaid ? "Paid" : "Unpaid"}
              </Checkbox>

              {/* Unpaid Message */}
              {!isPaid && isSelected && (
                <p style={{ color: "red", marginTop: 8 }}>
                  This toppings is currently unpaid.
                </p>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ToppingsSelect;
