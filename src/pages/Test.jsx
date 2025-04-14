import React, { useContext, useMemo, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";
import { Button } from "antd";

const RowContext = React.createContext({});

// Drag Handle Button
const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move", marginRight: 8 }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

// Initial Data
const addons = [
  { type: "Flavor", how_many_select: 1, how_many_choice: 5, sn_number: 1 },
  { type: "Dip", how_many_select: 1, how_many_choice: 5, sn_number: 2 },
  { type: "Side", how_many_select: 4, how_many_choice: 12, sn_number: 3 },
  { type: "Drink", how_many_select: 4, how_many_choice: 12, sn_number: 4 },
  { type: "Bakery", how_many_select: 2, how_many_choice: 5, sn_number: 5 },
  {
    type: "Rice Platter",
    how_many_select: 2,
    how_many_choice: 5,
    sn_number: 6,
  },
  {
    type: "Sandwich Customize",
    how_many_select: 2,
    how_many_choice: 5,
    sn_number: 7,
  },
  { type: "Topping", how_many_select: 2, how_many_choice: 5, sn_number: 8 },
];

// Single Item Component
const Item = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.item.sn_number });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    background: isDragging ? "#f0f0f0" : "#fff",
    padding: 16,
    marginBottom: 8,
    border: "1px solid #ddd",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    ...props.style,
  };

  const contextValue = useMemo(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  const { item } = props;

  return (
    <RowContext.Provider value={contextValue}>
      <div ref={setNodeRef} style={style} {...attributes}>
        <DragHandle />
        <div>
          <strong>{item.type}</strong>
        </div>
      </div>
    </RowContext.Provider>
  );
};

// 🔹 Main App Component
const FoodAddons = () => {
  const [dataSource, setDataSource] = useState(addons);

  //  Drag End Handler
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

  //  Save Handler (Send to backend)
  const handleSubmit = () => {
    const addonsResult = dataSource.map(({ type, sn_number }) => ({
      type,
      sn_number,
    }));

    console.log("Submitted addonsResult =", addonsResult);
  };

  return (
    <div style={{ padding: 24 }}>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource.map((i) => i.sn_number)}
          strategy={verticalListSortingStrategy}
        >
          {dataSource.map((item) => (
            <Item key={item.sn_number} item={item} />
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
