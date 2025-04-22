import React from "react";
import { Card, Checkbox, Col, Row } from "antd";

const DrinkSelection = ({
  drink,
  selectedDrinks,
  handleDrinkSelection,
  handleToggleDrinkPaid,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {drink?.map((item) => {
        const selectedDrink = selectedDrinks.find(
          (drink) => drink.drink_id === item.id
        );
        const isSelected = !!selectedDrink;
        const isPaid = selectedDrink?.isPaid || false;

        return (
          <Col key={item.id} span={6}>
            <Card
              title={item.name}
              bordered={true}
              style={{ textAlign: "center" }}
            >
              {/* Drink Selection Checkbox */}
              <Checkbox
                checked={isSelected}
                onChange={(e) =>
                  handleDrinkSelection(item.id, e.target.checked)
                }
              >
                Select
              </Checkbox>

              {/* Paid/Unpaid Checkbox */}
              <Checkbox
                checked={isPaid}
                onChange={(e) =>
                  handleToggleDrinkPaid(item.id, e.target.checked)
                }
                disabled={!isSelected}
              >
                {isPaid ? "Paid" : "Unpaid"}
              </Checkbox>

              {/* Unpaid Message */}
              {!isPaid && isSelected && (
                <p style={{ color: "red", marginTop: 8 }}>
                  This Drink is currently unpaid.
                </p>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default DrinkSelection;
