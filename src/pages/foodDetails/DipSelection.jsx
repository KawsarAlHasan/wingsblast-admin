import React from "react";
import { Card, Checkbox, Col, Row } from "antd";

const DipSelection = ({
  dip,
  selectedDips,
  handleDipSelection,
  handleToggleDipPaid,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {dip?.map((item) => {
        const selectedDip = selectedDips.find((dip) => dip.dip_id === item.id);
        const isSelected = !!selectedDip;
        const isPaid = selectedDip?.isPaid || false;

        return (
          <Col key={item.id} span={6}>
            <Card
              title={item.name}
              bordered={true}
              style={{ textAlign: "center" }}
            >
              {/* Dip Selection Checkbox */}
              <Checkbox
                checked={isSelected}
                onChange={(e) => handleDipSelection(item.id, e.target.checked)}
              >
                Select
              </Checkbox>

              {/* Paid/Unpaid Checkbox */}
              <Checkbox
                checked={isPaid}
                onChange={(e) => handleToggleDipPaid(item.id, e.target.checked)}
                disabled={!isSelected}
              >
                {isPaid ? "Paid" : "Unpaid"}
              </Checkbox>

              {/* Unpaid Message */}
              {!isPaid && isSelected && (
                <p style={{ color: "red", marginTop: 8 }}>
                  This dip is currently unpaid.
                </p>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default DipSelection;
