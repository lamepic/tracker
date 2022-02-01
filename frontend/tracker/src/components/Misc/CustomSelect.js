import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SelectUnstyled, {
  selectUnstyledClasses,
} from "@mui/base/SelectUnstyled";
import OptionUnstyled, {
  optionUnstyledClasses,
} from "@mui/base/OptionUnstyled";
import PopperUnstyled from "@mui/base/PopperUnstyled";
import { styled } from "@mui/system";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";

const StyledButton = styled("button")`
  // font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  // min-height: calc(1.5em + 22px);
  width: 264px;
  flex: 1;
  background: #fff;
  border: 0.2px solid var(--light-brown);
  border-radius: 5px;
  // margin: 0.5em;
  padding: 5px 10px 0 5px;
  text-align: left;
  line-height: 1.5;
  color: #000;
  background-color: var(--lightest-brown);

  &.${selectUnstyledClasses.focusVisible} {
    outline: 4px solid rgba(100, 100, 100, 0.3);
  }

  &.${selectUnstyledClasses.expanded} {
    // border-radius: 0.75em 0.75em 0 0;

    &::after {
      content: "▴";
    }
  }

  &::after {
    content: "▾";
    float: right;
  }
`;

const StyledListbox = styled("ul")`
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  background-color: #fff;
  min-width: 200px;
  border: 1px solid #ccc;
  border-top: none;
  color: #000;
`;

const StyledOption = styled(OptionUnstyled)`
  list-style: none;
  padding: 10px 10px;
  margin: 0;
  border-bottom: 1px solid #ddd;
  cursor: default;
  min-width: 261px;
  color: var(--dark-brown);
  font-size: 16px,

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.disabled} {
    color: #888;
  }

  &.${optionUnstyledClasses.selected} {
    background-color: rgba(25, 118, 210, 0.08);
  }

  &.${optionUnstyledClasses.highlighted} {
    background-color: #16d;
    color: #fff;
  }

  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    background-color: #05e;
    color: #fff;
  }

  &:hover:not(.${optionUnstyledClasses.disabled}) {
    background-color: #39e;
  }
`;

const StyledPopper = styled(PopperUnstyled)`
  z-index: 1;
`;

function CustomSelect(props) {
  const components = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} components={components} />;
}

CustomSelect.propTypes = {
  /**
   * The components used for each slot inside the Select.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  components: PropTypes.shape({
    Listbox: PropTypes.elementType,
    Popper: PropTypes.elementType,
    Root: PropTypes.elementType,
  }),
};

const characters = [
  { name: "Custom", race: "Hobbit" },
  { name: "Medical", race: "Hobbit" },
  { name: "Stationary", race: "Hobbit" },
  { name: "Water", race: "Hobbit" },
  { name: "Food", race: "Maia" },
  { name: "Salary", race: "Dwarf" },
];

function SelectInput() {
  const [store, dispatch] = useStateValue();
  const [option, setOption] = useState(null);

  useEffect(() => {
    dispatch({
      type: actionTypes.SET_DOCTYPE,
      payload: option,
    });
  }, [option]);

  return (
    <div>
      <CustomSelect value={store.documentType} onChange={setOption}>
        <div
          style={{
            maxHeight: "250px",
            overflowY: "scroll",
            overflowX: "none",
          }}
        >
          {characters.map((c) => (
            <StyledOption key={c.name} value={c}>
              {c.name}
            </StyledOption>
          ))}
        </div>
      </CustomSelect>
    </div>
  );
}

export default SelectInput;
