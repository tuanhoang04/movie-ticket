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
import { useState, useEffect } from "react";

export function ProfileMenu({ data }) {
  useEffect(() => {
    console.log(data);
  }, [data]);
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const handleOpen = () => {
    setOpenLogoutConfirm(!openLogoutConfirm);
  };
  return (
    <>
      <Menu placement="bottom-start">
        <MenuHandler>
          <div className="flex flex-row gap-2 items-center cursor-pointer">
            <img
              className="w-8 h-8 rounded-full"
              src={data?.user_img ? data.user_img : "/icons/account.png"}
            />
            <p className="text-xl ">{data ? data.full_name : ""}</p>
          </div>
        </MenuHandler>
        <MenuList className="bg-white text-purple-700 shadow-lg">
          <MenuItem
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 hover:bg-purple-100"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM10 5C10 5.53043 9.78929 6.03914 9.41421 6.41421C9.03914 6.78929 8.53043 7 8 7C7.46957 7 6.96086 6.78929 6.58579 6.41421C6.21071 6.03914 6 5.53043 6 5C6 4.46957 6.21071 3.96086 6.58579 3.58579C6.96086 3.21071 7.46957 3 8 3C8.53043 3 9.03914 3.21071 9.41421 3.58579C9.78929 3.96086 10 4.46957 10 5ZM8 9C7.0426 8.99981 6.10528 9.27449 5.29942 9.7914C4.49356 10.3083 3.85304 11.0457 3.454 11.916C4.01668 12.5706 4.71427 13.0958 5.49894 13.4555C6.28362 13.8152 7.13681 14.0009 8 14C8.86319 14.0009 9.71638 13.8152 10.5011 13.4555C11.2857 13.0958 11.9833 12.5706 12.546 11.916C12.147 11.0457 11.5064 10.3083 10.7006 9.7914C9.89472 9.27449 8.9574 8.99981 8 9Z"
                fill="#773e77"
              />
            </svg>

            <Typography variant="h4" className="font-medium text-lg">
              My Profile
            </Typography>
          </MenuItem>
          {userRole === "1" && (
            <MenuItem
              className="flex items-center gap-3 hover:bg-purple-100"
              onClick={() => {
                navigate("/admin");
              }}
            >
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 1 98 90"
                enable-background="new 0 0 100 100"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    fill="#773e77"
                    d="M49.8,53.2l4.7-4.7c0.2-0.2,0.4-0.4,0.6-0.5c-2.7-3.8-6.5-6.8-10.9-8.5c-3.5,2.3-7.8,3.7-12.3,3.7s-8.8-1.4-12.3-3.7   c-6.4,2.5-11.6,7.7-14,14.4c-1.7,4.8-2.8,9.9-3.2,15c-0.2,2.3,1.7,4.3,4.1,4.3h36.9v-4.6c0-3.3,2.3-6.1,5.5-6.7   C47.2,59.2,47.5,55.5,49.8,53.2z"
                  />
                  <path
                    fill="#773e77"
                    d="M31.9,37.7c9.4,0,17-7.6,17-17c0-9.4-7.6-17-17-17s-17,7.6-17,17C15,30.1,22.6,37.7,31.9,37.7z"
                  />
                  <path
                    fill="#773e77"
                    d="M96.3,67.2l-4.6-0.5c-0.4-1.5-1-2.9-1.7-4.2l2.9-3.6c0.4-0.5,0.4-1.3-0.1-1.8L88,52.4c-0.5-0.5-1.3-0.5-1.8-0.1l-3.6,2.9   c-1.3-0.7-2.7-1.3-4.2-1.7l-0.5-4.6c-0.1-0.7-0.7-1.2-1.4-1.2h-6.6c-0.7,0-1.3,0.5-1.4,1.2L68,53.4c-1.5,0.4-2.9,1-4.2,1.7   l-3.6-2.9c-0.5-0.4-1.3-0.4-1.8,0.1l-4.7,4.7c-0.5,0.5-0.5,1.3-0.1,1.8l2.9,3.6c-0.7,1.3-1.3,2.7-1.7,4.2l-4.6,0.5   c-0.7,0.1-1.2,0.7-1.2,1.4v6.6c0,0.7,0.5,1.3,1.2,1.4l4.6,0.5c0.4,1.5,1,2.9,1.7,4.2l-2.9,3.6c-0.4,0.5-0.4,1.3,0.1,1.8l4.7,4.7   c0.5,0.5,1.3,0.5,1.8,0.1l3.6-2.9c1.3,0.7,2.7,1.3,4.2,1.7l0.5,4.6c0.1,0.7,0.7,1.2,1.4,1.2h6.6c0.7,0,1.3-0.5,1.4-1.2l0.5-4.6   c1.5-0.4,2.9-1,4.2-1.7l3.6,2.9c0.5,0.4,1.3,0.4,1.8-0.1l4.7-4.7c0.5-0.5,0.5-1.3,0.1-1.8l-2.9-3.6c0.7-1.3,1.3-2.7,1.7-4.2   l4.6-0.5c0.7-0.1,1.2-0.7,1.2-1.4v-6. Until 6C97.5,67.9,97,67.3,96.3,67.2z M73.2,81.3c-5.2,0-9.4-4.2-9.4-9.4s4.2-9.4,9.4-9.4   c5.2,0,9.4,4.2,9.4,9.4S78.4,81.3,73.2,81.3z"
                  />
                </g>
              </svg>
              <Typography variant="h4" className="font-medium text-lg">
                Admin
              </Typography>
            </MenuItem>
          )}
          <MenuItem
            className="flex items-center gap-3 hover:bg-purple-100"
            onClick={() => handleOpen()}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                fill="#773e77"
              />
            </svg>
            <Typography variant="h4" className="font-medium text-lg">
              Sign Out
            </Typography>
          </MenuItem>
        </MenuList>
      </Menu>

      <Dialog
        className="xl:px-6 xl:py-4 px-3 py-2 my-4 bg-[#4B4A52] mx-auto min-w-[85%] md:min-w-[30%] gap-6 rounded-lg shadow-lg transition-all duration-300"
        open={openLogoutConfirm}
        size="sm"
        handler={handleOpen}
      >
        <DialogHeader className="text-white pb-3 text-2xl md:text-3xl font-semibold text-center flex justify-center">
          Sign out confirmation
        </DialogHeader>
        <DialogBody className="text-lg md:text-xl text-white py-2 text-center">
          Are you sure you want to sign out?
        </DialogBody>
        <DialogFooter className="flex justify-center gap-3 xl:gap-9">
          <Button
            className="w-fit py-2.5 bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
            onClick={handleOpen}
          >
            Cancel
          </Button>
          <Button
            className="w-fit py-2.5 focus:ring-2 focus:ring-[#D8B4FE] focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
            onClick={() => {
              handleOpen();
              localStorage.clear();
              navigate("/");
            }}
            style={{
              background:
                "linear-gradient(90deg, #f99d63 0%, #f373c6 50%, #ca6fff 100%)",
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}