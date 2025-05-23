import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSingleOffer } from "../../api/settingsApi";

import { Spin, Select } from "antd";
import SendToUserPromotion from "./SendToUserPromotion";
import PromotionSendUser from "./PromotionSendUser";
import PromotionDetails from "./PromotionDetails";

function SinglePromotion() {
  const { promotionID } = useParams();
  const { singleOffer, isLoading, isError, error, refetch } =
    useSingleOffer(promotionID);
  const [selected, setSelected] = useState("alluser");

  const handleChange = (value) => {
    setSelected(value);
  };

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const data = singleOffer?.data;

  return (
    <div>
      <PromotionDetails promotion={singleOffer?.data} />

      <div className="my-5">
        <Select
          defaultValue={selected}
          style={{
            width: 200,
          }}
          onChange={handleChange}
          options={[
            {
              value: "alluser",
              label: "All User",
            },
            {
              value: "promotionsenduser",
              label: "Promotion Send User",
            },
          ]}
        />
      </div>

      {selected == "alluser" ? (
        <SendToUserPromotion singlepromotion={data} />
      ) : (
        <PromotionSendUser singlepromotion={data} />
      )}
    </div>
  );
}

export default SinglePromotion;
