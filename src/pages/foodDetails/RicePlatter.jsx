import React from "react";
import { Card, Checkbox, Col, Row } from "antd";

const RicePlatter = ({
  side,
  selectedRicePlatter,
  handleRicePlatterSelection,
  handleToggleRicePlatterPaid,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {side?.map((item) => {
        const selectedSide = selectedRicePlatter.find(
          (side) => side.side_id === item.id
        );
        const isSelected = !!selectedSide;
        const isPaid = selectedSide?.isPaid || false;

        return (
          <Col key={item.id} span={6}>
            <Card
              title={item.name}
              bordered={true}
              style={{ textAlign: "center" }}
            >
              {/* Side Selection Checkbox */}
              <Checkbox
                checked={isSelected}
                onChange={(e) =>
                  handleRicePlatterSelection(item.id, e.target.checked)
                }
              >
                Select
              </Checkbox>

              {/* Paid/Unpaid Checkbox */}
              <Checkbox
                checked={isPaid}
                onChange={(e) =>
                  handleToggleRicePlatterPaid(item.id, e.target.checked)
                }
                disabled={!isSelected}
              >
                {isPaid ? "Paid" : "Unpaid"}
              </Checkbox>

              {/* Unpaid Message */}
              {!isPaid && isSelected && (
                <p style={{ color: "red", marginTop: 8 }}>
                  This side is currently unpaid.
                </p>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default RicePlatter;
