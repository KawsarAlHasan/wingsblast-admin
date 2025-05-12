import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "antd";
import AddonItem from "./AddonItem";

const FoodAddons = () => {
  const initialAddons = [
    { type: "Dip", sn_number: 2 },
    { type: "Side", sn_number: 1 },
    { type: "Bakery", sn_number: 3 },
    { type: "Flavor", sn_number: 4 },
    { type: "Drink", sn_number: 5 },
    { type: "Rice Platter", sn_number: 6 },
    { type: "Sandwich Customize", sn_number: 7 },
    { type: "Topping", sn_number: 8 },
    { type: "Sauce", sn_number: 9 },
  ];

  const [dataSource, setDataSource] = useState(
    initialAddons.map((item) => ({
      ...item,
      how_many_select: item.how_many_select || 0,
      how_many_choice: item.how_many_choice || 0,
    }))
  );

  const handleAddonChange = (sn_number, updatedItem) => {
    setDataSource((prev) =>
      prev.map((item) => (item.sn_number === sn_number ? updatedItem : item))
    );
  };

  const onDragEnd = ({ active, over }) => {
    if (!over) return;
    if (active.id !== over.id) {
      setDataSource((prev) => {
        const oldIndex = prev.findIndex((i) => i.sn_number === active.id);
        const newIndex = prev.findIndex((i) => i.sn_number === over.id);
        if (newIndex === -1) return prev;

        const newData = arrayMove(prev, oldIndex, newIndex);

        // Update sn_number
        const updatedWithSN = newData.map((item, index) => ({
          ...item,
          sn_number: index + 1,
        }));

        return updatedWithSN;
      });
    }
  };

  const handleSubmit = () => {
    console.log("Submitted addons:", dataSource);
  };

  return (
    <div>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource.map((i) => i.sn_number)}
          strategy={verticalListSortingStrategy}
        >
          {dataSource.map((item) => (
            <AddonItem
              key={item.sn_number}
              item={item}
              onChange={handleAddonChange}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div style={{ marginTop: 24 }}>
        <Button type="primary" onClick={handleSubmit}>
          Save Addons
        </Button>
      </div>
    </div>
  );
};

export default FoodAddons;
