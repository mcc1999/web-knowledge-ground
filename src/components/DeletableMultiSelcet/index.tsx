import { Chip, Select, Stack, FormControl, InputLabel } from '@mui/material'
import { SelectProps } from '@mui/material/Select'
import React, { useState } from 'react'
import CancelIcon from "@mui/icons-material/Cancel";

const DeletableMultiSelect: React.FC<SelectProps> = (props) => {  
  const [selectedValues, setSelectedValues] = useState([])
  return (
    <FormControl fullWidth={props.fullWidth} margin={props.margin} size={props.size}>
      <InputLabel margin={undefined}>{props.label}</InputLabel>
      <Select 
        {...props}
        multiple
        value={selectedValues}
        onChange={(e) => setSelectedValues(e.target.value as any)}
        renderValue={(selected: any) => (
          <Stack gap={1} direction="row" flexWrap="wrap">
            {selected.map((value: any) => (
              <Chip
                key={value}
                size='small'
                label={value}
                onDelete={() =>
                  setSelectedValues(
                    selectedValues.filter((item) => item !== value)
                  )
                }
                deleteIcon={
                  <CancelIcon
                    onMouseDown={(event) => event.stopPropagation()}
                  />
                }
              />
            ))}
          </Stack>
        )}
      />
    </FormControl>
  )
}

export default DeletableMultiSelect