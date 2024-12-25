import { Button, Select } from "@navikt/ds-react";
import React, { useState } from "react";

interface Props {
  name: string;
  buyStocks: (name: string, numberOfStock: number) => void;
}

function SelectNumber({ name, buyStocks }: Props) {
  const [selectedNumber, setSelectedNumber] = useState(0);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    buyStocks(name, selectedNumber);
  };

  return (
    <div>
      <form style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <Select
            label=""
            size="small"
            onChange={(e) => setSelectedNumber(Number(e.target.value))}
          >
            <option>Antall aksjer</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </Select>
        </div>
        <Button variant="primary" size="small" onClick={handleSubmit}>
          Primary
        </Button>
      </form>
    </div>
  );
}

export default SelectNumber;
