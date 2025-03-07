import { Autocomplete, MenuItem } from "@mui/material";
import { AutocompleteProps } from "@mui/material/Autocomplete";
import React, { forwardRef } from "react";
import CheckIcon from "@mui/icons-material/Check";
import Chip, { ChipTypeMap } from "@mui/material/Chip";
import useWebPlaygroundStore from "@/store";

export type IDeletableMultiSelect = AutocompleteProps<
  string,
  true,
  false,
  false,
  ChipTypeMap["defaultComponent"]
>;

const DeletableMultiSelect = (props: IDeletableMultiSelect, ref: any) => {
  const [calendarTags] = useWebPlaygroundStore((state) => [state.calendarTags]);
  return (
    <Autocomplete
      {...props}
      ref={ref}
      multiple
      getOptionLabel={(option) => option}
      disableCloseOnSelect
      renderTags={(value, getTagProps) =>
        value.map((v, index) => {
          const tag = calendarTags.find((tag) => tag.id === v);
          return (
            <Chip
              /** @ts-ignore */
              key={v}
              size="small"
              label={
                tag?.value ?? v.replace(/Add "([\w\u4e00-\u9fa5\d]+)"/, "$1")
              }
              {...getTagProps({ index })}
            />
          );
        })
      }
      renderOption={(props, option, { selected }) => {
        const tag = calendarTags.find((tag) => tag.id === option);
        return (
          <MenuItem
            {...props}
            key={option}
            value={option}
            sx={{ justifyContent: "space-between" }}
          >
            {tag?.value ?? option}
            {selected ? <CheckIcon color="info" /> : null}
          </MenuItem>
        );
      }}
    />
  );
};

export default forwardRef(DeletableMultiSelect);

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
