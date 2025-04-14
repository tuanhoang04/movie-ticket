import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

export default function Dropdown({ label, options }) {
  return (
    <Menu className="text-white text-lg w-60 border-none after:border-none before:border-none">
      <MenuHandler>
        <Button
          variant="outlined"
          className="text-white text-lg border-2 border-white"
        >
          {label}
        </Button>
      </MenuHandler>
      <MenuList className="bg-[#313035] text-white w-56 text-lg border-0 overflow-auto overflow-x-hidden dark-scrollbar h-[200px]">
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={option.onClick}
            className="text-white text-lg"
          >
            {option}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
