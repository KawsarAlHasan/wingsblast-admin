import React from "react";
import { Card, Checkbox, Col, Row } from "antd";

const FishChoice = ({
  fishChoice,
  selectedFishChoice,
  handleFishChoiceSelection,
  handleToggleFishChoicePaid,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {fishChoice?.map((item) => {
        const selectedFish = selectedFishChoice.find(
          (fish) => fish.fish_id === item.id
        );
        const isSelected = !!selectedFish;
        const isPaid = selectedFish?.isPaid || false;

        return (
          <Col key={item.id} span={6}>
            <Card
              title={item.name}
              bordered={true}
              style={{ textAlign: "center" }}
            >
              {/* fish Selection Checkbox */}
              <Checkbox
                checked={isSelected}
                onChange={(e) =>
                  handleFishChoiceSelection(item.id, e.target.checked)
                }
              >
                Select
              </Checkbox>

              {/* Paid/Unpaid Checkbox */}
              <Checkbox
                checked={isPaid}
                onChange={(e) =>
                  handleToggleFishChoicePaid(item.id, e.target.checked)
                }
                disabled={!isSelected}
              >
                {isPaid ? "Paid" : "Unpaid"}
              </Checkbox>

              {/* Unpaid Message */}
              {!isPaid && isSelected && (
                <p style={{ color: "red", marginTop: 8 }}>
                  This Fish Choice is currently unpaid.
                </p>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default FishChoice;
