import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";

export default function Dropdown({ label, options }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [dropdownLabel, setDropdownLabel] = useState(label);
  const handleChooseItem = (option)=>{
    setDropdownLabel(option)
  }
  const height=options.length>3?"290px":"170px";
  console.log(height);
  return (
    <Menu
      open={openMenu}
      handler={setOpenMenu}
      className="text-white text-lg w-64 border-none after:border-none before:border-none"
    >
      <MenuHandler>
        <Button
          variant="outlined"
          className="text-white text-lg border-0 border-l-2 rounded-none border-white flex flex-row items-center gap-1"
        >
          {dropdownLabel}
          <ChevronDownIcon
            strokeWidth={1.9}
            className={`h-8 w-8 transition-transform ${
              openMenu ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="bg-[#313035] text-white w-56 text-lg border-0 overflow-auto overflow-x-hidden dark-scrollbar max-h-[250px]">
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={()=>handleChooseItem(option)}
            className="text-white text-lg"
          >
            {option}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
