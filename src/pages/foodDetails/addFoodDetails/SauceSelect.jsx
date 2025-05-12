import React from "react";
import { Card, Checkbox, Col, Row } from "antd";

const SauceSelect = ({
  sauces,
  selectedSauce,
  handleSauceSelection,
  handleSaucePaid,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {sauces?.map((item) => {
        const selectedSand = selectedSauce.find(
          (sandCust) => sandCust.sauce_id === item.id
        );
        const isSelected = !!selectedSand;
        const isPaid = selectedSand?.isPaid || false;

        return (
          <Col key={item.id} span={6}>
            <Card
              title={item.name}
              bordered={true}
              style={{ textAlign: "center" }}
            >
              {/* sandCust Selection Checkbox */}
              <Checkbox
                checked={isSelected}
                onChange={(e) =>
                  handleSauceSelection(item.id, e.target.checked)
                }
              >
                Select
              </Checkbox>

              {/* Paid/Unpaid Checkbox */}
              <Checkbox
                checked={isPaid}
                onChange={(e) => handleSaucePaid(item.id, e.target.checked)}
                disabled={!isSelected}
              >
                {isPaid ? "Paid" : "Unpaid"}
              </Checkbox>

              {/* Unpaid Message */}
              {!isPaid && isSelected && (
                <p style={{ color: "red", marginTop: 8 }}>
                  This Sauce is currently unpaid.
                </p>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default SauceSelect;
