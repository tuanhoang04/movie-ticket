import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function ProfileMenu({ fullname }) {
  const navigate = useNavigate();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const handleOpen = () => {
    setOpenLogoutConfirm(!openLogoutConfirm);
  };
  return (
    <>
      <Menu placement="bottom-start" className="z-50 ">
        <MenuHandler>
          <div className="flex flex-row items-center cursor-pointer">
            <img className="w-8 h-8 mr-1" src="/icons/account.png" />
            <p className="text-xl">{fullname}</p>
          </div>
        </MenuHandler>
        <MenuList className="p-1">
          <MenuItem
            color="purple"
            onClick={() => navigate("/profile")}
            className="flex items-center gap-4 hover:!bg-gray-300 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="30"
              fill="currentColor"
              class="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>

            <Typography variant="small" className="font-medium text-lg ">
              My Profile
            </Typography>
          </MenuItem>
          <MenuItem
            className="flex items-center gap-4 hover:!bg-gray-300"
            onClick={() => handleOpen()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              class="bi bi-box-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
              />
              <path
                fill-rule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              />
            </svg>
            <Typography variant="small" className="font-medium text-lg  ">
              Sign Out
            </Typography>
          </MenuItem>
        </MenuList>
      </Menu>

      <Dialog
        className="bg-[#58565f] p-3"
        open={openLogoutConfirm}
        handler={handleOpen}
      >
        <DialogHeader className="text-white">
          Sign out confirmation
        </DialogHeader>
        <DialogBody className="text-xl text-white py-0">
          Are you sure you want to sign out?
        </DialogBody>
        <DialogFooter>
          <Button
            color="gray"
            onClick={handleOpen}
            className="bg-gray-800 mr-8"
          >
            <span>Cancel</span>
          </Button>
          <Button
            color="purple"
            onClick={() => {
              handleOpen();
              localStorage.removeItem("jwt");
              navigate("/");
            }}
            className="!bg-[#773e77] self-start w-auto"
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
