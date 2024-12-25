import { Button, TextField } from "@navikt/ds-react";
import React, { useState } from "react";

interface Props {
  name: string;
  buyStocks: (name: string, numberOfStock: number) => void;
}

function InputNumber({ name, buyStocks }: Props) {
  const [selectedNumber, setSelectedNumber] = useState(0);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    buyStocks(name, selectedNumber);
  };
  return (
    <div>
      <form style={{ display: "flex", flexDirection: "row", gap: "5%" }}>
        <TextField
          label="Har du noen tilbakemeldinger?"
          hideLabel
          onChange={(e) => setSelectedNumber(Number(e.target.value))}
        />
        <Button variant="primary" size="small" onClick={handleSubmit}>
          Kjøp
        </Button>
      </form>
    </div>
  );
}

export default InputNumber;
