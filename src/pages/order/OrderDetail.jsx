import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Divider, message, Select, Spin } from "antd";
import { PrinterOutlined, DownloadOutlined } from "@ant-design/icons";
import html2pdf from "html2pdf.js";
import { API, useOrderDetails } from "../../api/api";

function OrderDetail() {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateItemTotal = (item) => {
    let total = item.price * item.quantity;

    // Calculate addons prices
    Object.values(item.addons).forEach((addonCategory) => {
      if (Array.isArray(addonCategory)) {
        addonCategory.forEach((addon) => {
          if (addon.isPaid || addon.isPaid) {
            total += (addon.price || 0) * (addon.quantity || 1);
          }
        });
      }
    });

    return total.toFixed(2);
  };

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

  // console.log(orderDetails, "orderDetails");

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between p-4 max-w-4xl mx-auto">
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

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div>
          <div className="" ref={invoiceRef}>
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">INVOICE</h1>
                  <p className="mt-1">Order #{orderDetails?.order_id}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-blue-100 text-2xl font-semibold">
                    Wings Blast
                  </h2>
                  <p className="text-blue-100">255 Kingston Ave Brookiyn</p>
                  <p className="text-blue-100">New York, NY 11213</p>
                  <p className="text-blue-100">Phone: +1 (718) 737-3202</p>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Customer Information
                </h2>
                <p className="text-gray-600">
                  {orderDetails.first_name} {orderDetails.last_name}
                </p>
                <p className="text-gray-600">{orderDetails.email}</p>
                <p className="text-gray-600">{orderDetails.phone}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Order Details
                </h2>
                <p className="text-gray-600">
                  <span className="font-medium">Order Date:</span>{" "}
                  {formatDate(orderDetails.created_at)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Delivery Type:</span>{" "}
                  {orderDetails.delivery_type}
                </p>
                {orderDetails.delivery_type === "Delivery" && (
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Delivery Address: </span>
                      {orderDetails.delevery_address || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Building/Suite: </span>
                      {orderDetails.building_suite_apt || "N/A"}
                    </p>
                  </div>
                )}
                {orderDetails.isLater === 1 && (
                  <p className="text-gray-600">
                    <span className="font-medium">Scheduled for: </span>
                    {formatDate(orderDetails.later_date)} (
                    {orderDetails.later_slot})
                  </p>
                )}
                <p className="text-gray-600">
                  <span className="font-medium">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {orderDetails.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Items
              </h2>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderDetails.foods.map((item, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 ">
                                ID: {item?.id}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item.description}
                                </div>
                                <p className="text-xs text-gray-500">
                                  Notes: {item?.note}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${calculateItemTotal(item)}
                            {console.log("item", item)}
                          </td>
                        </tr>
                        {/* Addons */}
                        {Object.entries(item.addons).map(
                          ([category, addons]) =>
                            addons.length > 0 && (
                              <tr
                                key={`${index}-${category}`}
                                className="bg-gray-50"
                              >
                                <td colSpan="4" className="px-6 py-2">
                                  <div className="text-xs font-semibold text-gray-500 uppercase">
                                    {category}
                                  </div>
                                  <div className="pl-4">
                                    {addons.map((addon, addonIndex) => (
                                      <div
                                        key={addonIndex}
                                        className="flex justify-between py-1"
                                      >
                                        <span className="text-sm text-gray-600">
                                          {addon.name}
                                          {addon?.child_item_name
                                            ? ` (${addon?.child_item_name})`
                                            : ""}
                                          {addon?.quantity > 1
                                            ? `(x${addon?.quantity})`
                                            : ""}
                                        </span>
                                        {(addon.isPaid || addon.isPaid) && (
                                          <span className="text-sm text-gray-600">
                                            +${addon.price.toFixed(2)}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ${orderDetails.sub_total.toFixed(2)}
                    </span>
                  </div>
                  {orderDetails.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">
                        ${orderDetails.tax.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {orderDetails.delivery_fee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">
                        ${orderDetails.delivery_fee.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {orderDetails.tips > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tips</span>
                      <span className="font-medium">
                        ${orderDetails.tips.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {orderDetails.coupon_discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -${orderDetails.coupon_discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <Divider className="my-2" />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-blue-600">
                      ${orderDetails.total_price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="bg-gray-100 p-6 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                {/* <p className="text-sm text-gray-500">
                  Thank you for your order!
                </p>
                <p className="text-sm text-gray-500">
                  We appreciate your business.
                </p> */}
              </div>
              <div className="space-x-2">
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  onClick={printInvoice}
                >
                  Print Invoice
                </Button>
                <Button onClick={downloadInvoice} icon={<DownloadOutlined />}>
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
