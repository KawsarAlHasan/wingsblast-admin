import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Divider, message, Select, Spin } from "antd";
import html2pdf from "html2pdf.js";
import { API, useOrderDetails } from "../../api/api";

function OrderDetails() {
  const { orderID } = useParams();
  const { orderDetails, isLoading, isError, error, refetch } =
    useOrderDetails(orderID);
  const [status, setStatus] = useState(orderDetails?.status);
  const invoiceRef = useRef();

  useEffect(() => {
    if (orderDetails) {
      setStatus(orderDetails.status);
    }
  }, [orderDetails]);

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;

  const handleStatusChange = async (value) => {
    try {
      const response = await API.put(`/orders/status/${orderID}`, {
        status: value,
      });

      if (response.statusText == "OK") {
        setStatus(value); // Update status locally
        message.success("Order status updated successfully");
        refetch(); // Refresh order details after update
      } else {
        message.error("Failed to update order status");
      }
    } catch (error) {
      message.error(`Error updating status ${error.message}`);
    }
  };

  const downloadInvoice = () => {
    const element = invoiceRef.current;
    html2pdf().from(element).save("invoice.pdf");
  };

  const printInvoice = () => {
    const element = invoiceRef.current;

    html2pdf()
      .set({
        margin: 1,
        filename: "invoice.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        pdf.autoPrint();
        const pdfData = pdf.output("dataurlstring");
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";
        iframe.src = pdfData;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow.print();
        };
      });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between p-4">
        <h2 className="font-semibold text-2xl">Order Details</h2>
        <div>
          <Select
            value={status}
            onChange={handleStatusChange}
            style={{ width: 120 }}
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Processing", label: "Processing" },
              { value: "Completed", label: "Completed" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
          />
        </div>
      </div>
      <div className="bg-gray-100">
        <Card className="shadow-lg" ref={invoiceRef}>
          <div className="invoice-content">
            <h1 className="text-2xl font-bold mb-4">Invoice</h1>

            {/* Order and Customer Details */}
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Order ID: {orderDetails.id}</p>
                <p>
                  Date: {new Date(orderDetails.created_at).toLocaleDateString()}
                </p>
                <p>Status: {orderDetails.status || "Pending"}</p>
                <p>
                  Customer Name: {orderDetails.first_name}{" "}
                  {orderDetails.last_name}
                </p>
                <p>Phone: {orderDetails.phone}</p>
                <p>Email: {orderDetails.email}</p>
              </div>
              <div>
                <p className="font-semibold">
                  Delivery Type: {orderDetails.delivery_type || "N/A"}
                </p>
                <p>
                  Delivery Address: {orderDetails.delevery_address || "N/A"}
                </p>
                <p>
                  Building/Suite: {orderDetails.building_suite_apt || "N/A"}
                </p>
                <p>
                  Delivery Date:{" "}
                  {orderDetails.later_date
                    ? new Date(orderDetails.later_date).toLocaleDateString()
                    : "ASAP"}
                </p>
                <p>Delivery Slot: {orderDetails.later_slot || "N/A"}</p>
              </div>
            </div>

            <Divider />

            {/* Food Items */}
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <div className="space-y-4">
              {orderDetails.foods.map((food) => (
                <div
                  key={food.id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex items-center">
                    <div>
                      <h3 className="font-semibold">{food.name}</h3>
                      <p className="text-gray-600">{food.description}</p>
                      <p>
                        Price: ${food.price.toFixed(2)} x {food.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>Total: ${(food.price * food.quantity).toFixed(2)}</p>
                    <div>
                      {Object.entries(food.addons).map(([key, addons]) => (
                        <div key={key} className="text-sm mt-2">
                          <p className="font-semibold capitalize">{key}:</p>
                          {addons.map((addon, index) => (
                            <div key={index} className="ml-4">
                              <p>
                                {addon.name}{" "}
                                {addon.price && <span>- ${addon.price}</span>}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Divider />

            {/* Summary */}
            <div className="text-right space-y-2">
              <p>Subtotal: ${orderDetails.sub_total.toFixed(2)}</p>
              <p>Tax: ${orderDetails.tax.toFixed(2)}</p>
              <p className="text-xl font-bold">
                Total: ${orderDetails.total_price.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        {/* Download and Print Buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          <Button onClick={downloadInvoice}>Download PDF</Button>
          <Button onClick={printInvoice}>Print</Button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
