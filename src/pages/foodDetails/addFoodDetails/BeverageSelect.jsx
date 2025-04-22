import React from "react";
import { Card, Checkbox, Col, Row } from "antd";

const BeverageSelect = ({
  beverage,
  selectedBeverages,
  handleBeverageSelection,
  handleToggleBeveragePaid,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {beverage?.map((item) => {
        const selectedBeverage = selectedBeverages.find(
          (beverage) => beverage.beverage_id === item.id
        );
        const isSelected = !!selectedBeverage;
        const isPaid = selectedBeverage?.isPaid || false;

        return (
          <Col key={item.id} span={6}>
            <Card
              title={item.name}
              bordered={true}
              style={{ textAlign: "center" }}
            >
              {/* beverage Selection Checkbox */}
              <Checkbox
                checked={isSelected}
                onChange={(e) =>
                  handleBeverageSelection(item.id, e.target.checked)
                }
              >
                Select
              </Checkbox>

              {/* Paid/Unpaid Checkbox */}
              <Checkbox
                checked={isPaid}
                onChange={(e) =>
                  handleToggleBeveragePaid(item.id, e.target.checked)
                }
                disabled={!isSelected}
              >
                {isPaid ? "Paid" : "Unpaid"}
              </Checkbox>

              {/* Unpaid Message */}
              {!isPaid && isSelected && (
                <p style={{ color: "red", marginTop: 8 }}>
                  This beverage is currently unpaid.
                </p>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default BeverageSelect;
