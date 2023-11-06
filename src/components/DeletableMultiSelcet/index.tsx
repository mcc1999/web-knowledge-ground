import { Autocomplete, MenuItem } from '@mui/material'
import { AutocompleteProps } from '@mui/material/Autocomplete'
import React, { forwardRef } from 'react'
import CheckIcon from "@mui/icons-material/Check";
import Chip, { ChipTypeMap } from '@mui/material/Chip';

export type IDeletableMultiSelect = AutocompleteProps<string, true, false, false, ChipTypeMap['defaultComponent']> 

const DeletableMultiSelect = (props: IDeletableMultiSelect, ref: any) => {
  return (
    <Autocomplete
      {...props}
      ref={ref}
      multiple
      getOptionLabel={(option) => option}
      disableCloseOnSelect
      renderTags={(value, getTagProps) => 
        // eslint-disable-next-line react/jsx-key
         value.map((v, index) => <Chip size='small' { ...getTagProps({index}) } label={v.replace(/Add "(\w+)"/, '$1')} />)
      }
      renderOption={(props, option, { selected }) => (
        <MenuItem
          {...props}
          key={option}
          value={option}
          sx={{ justifyContent: "space-between" }}
        >
          {option}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
    />
  )
}

export default forwardRef(DeletableMultiSelect)

// Select Version, 不能很好处的处理onChange， defaultValue的问题
// const DeletableMultiSelect = (props: SelectProps, ref: any) => {  
//   const [selectedValues, setSelectedValues] = useState([])
//   console.log('props', props, ref.current);
  
//   return (
//     <FormControl fullWidth={props.fullWidth} margin={props.margin} size={props.size}>
//       <InputLabel margin={undefined}>{props.label}</InputLabel>
//       <Select 
//         {...props}
//         ref={ref}
//         multiple
//         value={selectedValues}
//         onChange={(e) => {
//           setSelectedValues(e.target.value as any);
//           props.onChange && props.onChange(e, ref)
//         }}
//         renderValue={(selected: any) => (
//           <Stack gap={1} direction="row" flexWrap="wrap">
//             {selected.map((value: any) => (
//               <Chip
//                 key={value}
//                 size='small'
//                 label={value}
//                 onDelete={() =>
//                   setSelectedValues(
//                     selectedValues.filter((item) => item !== value)
//                   )
//                 }
//                 deleteIcon={
//                   <CancelIcon
//                     onMouseDown={(event) => event.stopPropagation()}
//                   />
//                 }
//               />
//             ))}
//           </Stack>
//         )}
//       />
//     </FormControl>
//   )
// }

// export default forwardRef(DeletableMultiSelect)