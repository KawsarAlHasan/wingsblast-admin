import React from "react";
import Tax from "./Tax";
import DeliveryFee from "./DeliveryFee";

function TaxAndDeliveryFee() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Tax />
        <DeliveryFee />
      </div>
    </div>
  );
}

export default TaxAndDeliveryFee;
