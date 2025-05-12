import React, { useContext, useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";
import { Button, Checkbox, Collapse, InputNumber, Switch } from "antd";
import DrinkSelection from "./DrinkSelection";
import {
  useBeverage,
  useDrink,
  useSandCust,
  useSide,
  useSauce,
} from "../../../api/api";
import BeverageSelect from "./BeverageSelect";
import SandCustSelect from "./SandCustSelect";
import RicePlatter from "./RicePlatter";
import ComboSide from "./ComboSide";
import SauceSelect from "./SauceSelect";

const { Panel } = Collapse;

const RowContext = React.createContext({});

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

const AddonItem = ({
  item,
  onChange,
  onSelectedDrinksChange,
  onSelectedBevarageChange,
  onSelectedSandCustChange,
  onSelectedComboSiderChange,
  onSelectedRicePlatterChange,
  onSelectedSauceChange,
}) => {
  const { drink } = useDrink();
  const { beverage } = useBeverage();
  const { sandCust } = useSandCust();
  const { side } = useSide();
  const { sauces } = useSauce();

  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectedBeverages, setSelectedBeverages] = useState([]);
  const [selectedSandCust, setSelectedSandCust] = useState([]);
  const [selectedSauce, setSelectedSauce] = useState([]);
  const [selectedComboSide, setSelectedComboSide] = useState([]);
  const [selectedRicePlatter, setSelectedRicePlatter] = useState([]);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.sn_number });

  // drinks
  const handleDrinkSelection = (id, isChecked) => {
    setSelectedDrinks((prevDrinks) => {
      const updated = isChecked
        ? [...prevDrinks, { drink_id: id, isPaid: false }]
        : prevDrinks.filter((drink) => drink.drink_id !== id);

      // Send updated data to parent
      if (onSelectedDrinksChange) {
        onSelectedDrinksChange(updated);
      }

      return updated;
    });
  };
  const handleToggleDrinkPaid = (id, isChecked) => {
    const updated = selectedDrinks.map((drink) =>
      drink.drink_id === id ? { ...drink, isPaid: isChecked } : drink
    );

    setSelectedDrinks(updated);

    // Send updated data to parent
    if (onSelectedDrinksChange) {
      onSelectedDrinksChange(updated);
    }
  };

  // Beverage Selection Handling
  const handleBeverageSelection = (id, isChecked) => {
    setSelectedBeverages((prevBeverages) => {
      const updated = isChecked
        ? [...prevBeverages, { beverage_id: id, isPaid: false }]
        : prevBeverages.filter((beverage) => beverage.beverage_id !== id);

      if (onSelectedBevarageChange) {
        onSelectedBevarageChange(updated);
      }

      return updated;
    });
  };

  // Beverage paid unpaid
  const handleToggleBeveragePaid = (id, isChecked) => {
    const updated = selectedBeverages.map((beverage) =>
      beverage.beverage_id === id
        ? { ...beverage, isPaid: isChecked }
        : beverage
    );

    setSelectedBeverages(updated);

    // Send updated data to parent
    if (onSelectedBevarageChange) {
      onSelectedBevarageChange(updated);
    }
  };

  // sandCust Selection Handling
  const handleSandCustSelection = (id, isChecked) => {
    setSelectedSandCust((prevSandCust) => {
      const updated = isChecked
        ? [...prevSandCust, { sandCust_id: id, isPaid: false }]
        : prevSandCust.filter((sandCust) => sandCust.sandCust_id !== id);

      if (onSelectedSandCustChange) {
        onSelectedSandCustChange(updated);
      }

      return updated;
    });
  };

  // sandCust paid unpaid
  const handleToggleSandCustPaid = (id, isChecked) => {
    const updated = selectedSandCust.map((sandCust) =>
      sandCust.sandCust_id === id
        ? { ...sandCust, isPaid: isChecked }
        : sandCust
    );

    setSelectedSandCust(updated);

    // Send updated data to parent
    if (onSelectedSandCustChange) {
      onSelectedSandCustChange(updated);
    }
  };

  // sandCust Selection Handling
  const handleSauceSelection = (id, isChecked) => {
    setSelectedSauce((prevSauce) => {
      const updated = isChecked
        ? [...prevSauce, { sauce_id: id, isPaid: false }]
        : prevSauce.filter((sauce) => sauce.sauce_id !== id);

      if (onSelectedSauceChange) {
        onSelectedSauceChange(updated);
      }

      return updated;
    });
  };

  // sandCust paid unpaid
  const handleSaucePaid = (id, isChecked) => {
    const updated = selectedSauce.map((sauce) =>
      sauce.sauce_id === id ? { ...sauce, isPaid: isChecked } : sauce
    );

    setSelectedSauce(updated);

    // Send updated data to parent
    if (onSelectedSauceChange) {
      onSelectedSauceChange(updated);
    }
  };

  // Combo Side selection Handling
  const handleComboSideSelection = (id, isChecked) => {
    setSelectedComboSide((prevSides) => {
      const updated = isChecked
        ? [...prevSides, { side_id: id, isPaid: false }]
        : prevSides.filter((side) => side.side_id !== id);

      if (onSelectedComboSiderChange) {
        onSelectedComboSiderChange(updated);
      }

      return updated;
    });
  };

  // Combo Side paid unpaid
  const handleToggleComboSidePaid = (id, isChecked) => {
    const updated = selectedComboSide.map((prevSides) =>
      prevSides.side_id === id ? { ...prevSides, isPaid: isChecked } : prevSides
    );

    setSelectedComboSide(updated);

    // Send updated data to parent
    if (onSelectedComboSiderChange) {
      onSelectedComboSiderChange(updated);
    }
  };

  // Rice Platter selection Handling
  const handleRicePlatterSelection = (id, isChecked) => {
    setSelectedRicePlatter((prevSides) => {
      const updated = isChecked
        ? [...prevSides, { side_id: id, isPaid: false }]
        : prevSides.filter((side) => side.side_id !== id);

      if (onSelectedRicePlatterChange) {
        onSelectedRicePlatterChange(updated);
      }

      return updated;
    });
  };

  // Rice Platter paid unpaid
  const handleToggleRicePlatterPaid = (id, isChecked) => {
    const updated = selectedRicePlatter.map((prevSides) =>
      prevSides.side_id === id ? { ...prevSides, isPaid: isChecked } : prevSides
    );

    setSelectedRicePlatter(updated);

    // Send updated data to parent
    if (onSelectedRicePlatterChange) {
      onSelectedRicePlatterChange(updated);
    }
  };

  const handleFieldChange = (field, value) => {
    const sanitizedValue = value === undefined || value === null ? 0 : value;
    onChange(item.sn_number, { ...item, [field]: sanitizedValue });
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    background: isDragging ? "#f0f0f0" : "#e9f0fa",
    padding: 0,
    marginBottom: 8,
    borderRadius: 10,
    border: "none",
  };

  const contextValue = useMemo(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  const renderContent = () => {
    switch (item.type) {
      case "Flavor":
        return (
          <div className="flex items-center">
            <div className="gap-2">
              <span className="font-semibold ml-2">
                How many {item.type} to select:
              </span>
              <InputNumber
                className="mx-2"
                htmlType="number"
                value={item.how_many_select}
                onChange={(value) =>
                  handleFieldChange("how_many_select", value)
                }
              />
            </div>
            <div className="gap-2">
              <span className="font-semibold ml-2">How many Wings:</span>
              <InputNumber
                className="mx-2"
                htmlType="number"
                value={item.how_many_choice}
                onChange={(value) =>
                  handleFieldChange("how_many_choice", value)
                }
              />
            </div>
            <div className="gap-2">
              <span className="font-semibold ml-2">{item.type} Required:</span>
              <Checkbox
                className="mx-2"
                value={item.is_required}
                onChange={(e) =>
                  handleFieldChange("is_required", e.target.checked)
                }
              />
            </div>
          </div>
        );
      case "Drink":
        return (
          <div>
            <div className="flex gap-2">
              <div className="gap-2 mb-5">
                <span className="font-semibold ml-2">
                  {item.type} Required:
                </span>
                <Checkbox
                  className="mx-2"
                  value={item.is_required}
                  onChange={(e) =>
                    handleFieldChange("is_required", e.target.checked)
                  }
                />
              </div>

              <div className="gap-2">
                <span className="font-semibold ml-2">Extra {item.type}:</span>
                <Switch
                  className="mx-2"
                  checkedChildren="On"
                  unCheckedChildren="Off"
                  defaultChecked
                  value={item.is_extra_addon}
                  onChange={(value) =>
                    handleFieldChange("is_extra_addon", value)
                  }
                />
              </div>
            </div>

            <DrinkSelection
              drink={drink}
              selectedDrinks={selectedDrinks}
              handleDrinkSelection={handleDrinkSelection}
              handleToggleDrinkPaid={handleToggleDrinkPaid}
            />
          </div>
        );

      case "Combo Side":
        return (
          <div>
            <div className="flex items-center mb-5">
              <div className="gap-2">
                <span className="font-semibold ml-2">
                  How many {item.type} to select:
                </span>
                <InputNumber
                  className="mx-2"
                  htmlType="number"
                  value={item.how_many_select}
                  onChange={(value) =>
                    handleFieldChange("how_many_select", value)
                  }
                />
              </div>
              <div className="gap-2">
                <span className="font-semibold ml-2">
                  How many {item.type} to choices:
                </span>
                <InputNumber
                  className="mx-2"
                  htmlType="number"
                  value={item.how_many_choice}
                  onChange={(value) =>
                    handleFieldChange("how_many_choice", value)
                  }
                />
              </div>
              {/* <div className="gap-2">
                <span className="font-semibold ml-2">
                  {item.type} Required:
                </span>
                <Checkbox
                  className="mx-2"
                  value={item.is_required}
                  onChange={(e) =>
                    handleFieldChange("is_required", e.target.checked)
                  }
                />
              </div> */}
              <div className="gap-2">
                <span className="font-semibold ml-2">Extra {item.type}:</span>
                <Switch
                  className="mx-2"
                  checkedChildren="On"
                  unCheckedChildren="Off"
                  defaultChecked
                  value={item.is_extra_addon}
                  onChange={(value) =>
                    handleFieldChange("is_extra_addon", value)
                  }
                />
              </div>
            </div>
            <ComboSide
              side={side}
              selectedComboSide={selectedComboSide}
              handleComboSideSelection={handleComboSideSelection}
              handleToggleComboSidePaid={handleToggleComboSidePaid}
            />
          </div>
        );
      case "Bakery":
        return (
          <div>
            <div className="gap-2 mb-5">
              <span className="font-semibold ml-2">{item.type} Required:</span>
              <Checkbox
                className="mx-2"
                value={item.is_required}
                onChange={(e) =>
                  handleFieldChange("is_required", e.target.checked)
                }
              />
            </div>
            <BeverageSelect
              beverage={beverage}
              selectedBeverages={selectedBeverages}
              handleBeverageSelection={handleBeverageSelection}
              handleToggleBeveragePaid={handleToggleBeveragePaid}
            />
          </div>
        );
      case "Sandwich Customize":
        return (
          <div>
            <div className="gap-2 mb-5">
              <span className="font-semibold ml-2">{item.type} Required:</span>
              <Checkbox
                className="mx-2"
                value={item.is_required}
                onChange={(e) =>
                  handleFieldChange("is_required", e.target.checked)
                }
              />
            </div>
            <SandCustSelect
              sandCust={sandCust}
              selectedSandCust={selectedSandCust}
              handleSandCustSelection={handleSandCustSelection}
              handleToggleSandCustPaid={handleToggleSandCustPaid}
            />
          </div>
        );
      case "Rice Platter":
        return (
          <div>
            <div className="flex items-center mb-5">
              <div className="gap-2">
                <span className="font-semibold ml-2">
                  How many {item.type} to select:
                </span>
                <InputNumber
                  className="mx-2"
                  htmlType="number"
                  value={item.how_many_select}
                  onChange={(value) =>
                    handleFieldChange("how_many_select", value)
                  }
                />
              </div>
              <div className="gap-2">
                <span className="font-semibold ml-2">
                  How many {item.type} to choices:
                </span>
                <InputNumber
                  className="mx-2"
                  htmlType="number"
                  value={item.how_many_choice}
                  onChange={(value) =>
                    handleFieldChange("how_many_choice", value)
                  }
                />
              </div>

              <div className="gap-2">
                <span className="font-semibold ml-2">
                  {item.type} Required:
                </span>
                <Checkbox
                  className="mx-2"
                  value={item.is_required}
                  onChange={(e) =>
                    handleFieldChange("is_required", e.target.checked)
                  }
                />
              </div>
            </div>
            <RicePlatter
              side={side}
              selectedRicePlatter={selectedRicePlatter}
              handleRicePlatterSelection={handleRicePlatterSelection}
              handleToggleRicePlatterPaid={handleToggleRicePlatterPaid}
            />
          </div>
        );
      case "Topping":
        return (
          <div>
            <div className="flex items-center">
              <div className="gap-2">
                <span className="font-semibold ">Topping:</span>
                <Checkbox
                  className="mx-2"
                  value={item.is_required}
                  onChange={(e) =>
                    handleFieldChange(
                      "how_many_select",
                      e.target.checked === true ? 1 : 0
                    )
                  }
                />
              </div>
            </div>
          </div>
        );

      case "Sauce":
        return (
          <div>
            <div className="gap-2 mb-5">
              <span className="font-semibold ml-2">{item.type} Required:</span>
              <Checkbox
                className="mx-2"
                value={item.is_required}
                onChange={(e) =>
                  handleFieldChange("is_required", e.target.checked)
                }
              />
            </div>
            <SauceSelect
              sauces={sauces}
              selectedSauce={selectedSauce}
              handleSauceSelection={handleSauceSelection}
              handleSaucePaid={handleSaucePaid}
            />
          </div>
        );

      default:
        return (
          <div className="flex items-center">
            <div className="gap-2">
              <span className="font-semibold ml-2">
                How many {item.type} to select:
              </span>
              <InputNumber
                className="mx-2"
                htmlType="number"
                value={item.how_many_select}
                onChange={(value) =>
                  handleFieldChange("how_many_select", value)
                }
              />
            </div>
            <div className="gap-2">
              <span className="font-semibold ml-2">
                How many {item.type} to choices:
              </span>
              <InputNumber
                className="mx-2"
                htmlType="number"
                value={item.how_many_choice}
                onChange={(value) =>
                  handleFieldChange("how_many_choice", value)
                }
              />
            </div>
            <div className="gap-2">
              <span className="font-semibold ml-2">Extra {item.type}:</span>
              <Switch
                className="mx-2"
                checkedChildren="On"
                unCheckedChildren="Off"
                defaultChecked
                value={item.is_extra_addon}
                onChange={(value) => handleFieldChange("is_extra_addon", value)}
              />
            </div>
            <div className="gap-2">
              <span className="font-semibold ml-2">{item.type} Required:</span>
              <Checkbox
                className="mx-2"
                value={item.is_required}
                onChange={(e) =>
                  handleFieldChange("is_required", e.target.checked)
                }
              />
            </div>
          </div>
        );
    }
  };

  return (
    <RowContext.Provider value={contextValue}>
      <div ref={setNodeRef} style={style} {...attributes}>
        <Collapse defaultActiveKey={[]}>
          <Panel
            header={
              <div className="flex justify-between items-center">
                <strong>{item.type}</strong>
                <DragHandle />
              </div>
            }
            key={item.sn_number}
          >
            {renderContent()}
          </Panel>
        </Collapse>
      </div>
    </RowContext.Provider>
  );
};

export default AddonItem;
