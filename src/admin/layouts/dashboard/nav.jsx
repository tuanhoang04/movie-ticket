import { useEffect } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import { useTheme } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import { usePathname } from "../../routes/hooks";
import { Link } from "react-router-dom";
import { varAlpha } from "../../theme/styles";
import { Scrollbar } from "../../components/scrollbar";
import Typography from "@mui/material/Typography";

export function NavContent({ data, slots, sx }) {
  const pathname = usePathname();
  const full_name = localStorage.getItem("full_name");
  const handleLogout = (path) => {
    if (path === "/home") {
      window.location.href = "/home";
    }
  };

  return (
    <>
      {/* Logo and Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 3,
          mb: 6,
          gap: 2,
          // background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)",
          // backdropFilter: "blur(8px)",
          // borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box
          component="div"
          sx={{
            backgroundColor: "white",
            borderRadius: "50%",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Box component="span" sx={{ color: "#502A50", fontSize: 28 }}>
            ⬢
          </Box>
        </Box>
        <Typography
          variant="h4"
          sx={{ color: "white", fontWeight: "bold", fontSize: "2rem" }}
        >
          Starlight Cinema
        </Typography>
      </Box>

      <Scrollbar>
        <Box
          component="nav"
          display="flex"
          flex="1 1 auto"
          flexDirection="column"
          sx={{
            px: 1.5,
            ...sx,
          }}
        >
          <Box
            component="ul"
            sx={{ gap: 1.5, display: "flex", flexDirection: "column" }}
          >
            {data
              .filter((item) => item.path !== "/auth")
              .map((item) => {
                const isActived = item.path === pathname;

                return (
                  <ListItem disableGutters disablePadding key={item.title}>
                    <ListItemButton
                      disableGutters
                      component={Link}
                      to={item.path}
                      onClick={() => handleLogout(item.path)}
                      sx={{
                        pl: 2,
                        py: 1.5,
                        gap: 2.5,
                        pr: 1.5,
                        borderRadius: 1.5,
                        typography: "body2",
                        fontWeight: "fontWeightMedium",
                        color: "rgba(255, 255, 255, 0.85)",
                        minHeight: 48,
                        transition: "all 0.2s ease", // Hiệu ứng mượt mà, thời gian ngắn hơn để tinh tế
                        position: "relative", // Để thêm viền bên trái
                        ...(isActived && {
                          fontWeight: "fontWeightSemiBold",
                          background: "rgba(255,255,255,0.05)", // Nền nhẹ hơn
                          color: "white",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: "4px", // Viền bên trái dày hơn khi activeline
                            background: "ar-gradient(180deg, #ffffff 0%, #d1d1d1 100%)", // Gradient trắng cho viền
                            borderRadius: "0 4px 4px 0",
                          },
                          "&:hover": {
                            background: "rgba(255,255,255,0.1)",
                            "&::before": {
                              width: "4px", // Giữ viền khi hover
                            },
                          },
                        }),
                        "&:hover": {
                          background: "rgba(255,255,255,0.08)",
                          color: "white",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: "2px", // Viền bên trái mỏng khi hover
                            background: "rgba(255,255,255,0.3)",
                            borderRadius: "0 4px 4px 0",
                          },
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 32,
                          height: 32,
                          color: "rgba(255, 255, 255, 0.85)",
                          display: "flex",
                          alignItems: "center",
                          ...(isActived && {
                            color: "white",
                          }),
                        }}
                      >
                        {item.icon}
                      </Box>

                      <Box
                        component="span"
                        flexGrow={1}
                        sx={{
                          fontSize: "1.25rem",
                        }}
                      >
                        {item.title}
                      </Box>

                      {item.path !== "/admin/dashboard" && (
                        <Box
                          component="span"
                          sx={{
                            color: isActived
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(255, 255, 255, 0.4)",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {'>'}
                        </Box>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </Box>
        </Box>
      </Scrollbar>

      {/* User greeting card */}
      <Box
        sx={{
          mx: 3,
          mb: 10,
          mt: 0,
          p: 2.5,
          borderRadius: 2,
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 100%)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.2)",
          border: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "all 0.3s ease",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "white", fontWeight: "medium", fontSize: "1.25rem" }}
        >
          Hi, {full_name || "Admin"} 👋
        </Typography>

        <Box
          component="button"
          onClick={() => (window.location.href = "/home")}
          sx={{
            mt: 2.5,
            display: "inline-flex",
            py: 1.5,
            px: 3,
            color: "white",
            background: "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.4) 100%)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 50,
            cursor: "pointer",
            fontSize: "1.1rem",
            fontWeight: "medium",
            justifyContent: "center",
            alignItems: "center",
            textDecoration: "none",
            width: "fit-content",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.5) 100%)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Return to Homepage
        </Box>
      </Box>
    </>
  );
}

export function NavDesktop({ sx, data, slots, layoutQuery }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 0,
        px: 0,
        top: 0,
        left: 0,
        height: 1,
        display: "none",
        position: "fixed",
        flexDirection: "column",
        background: "rgb(80, 42, 80)", // Gradient tối kiểu Vercel
        zIndex: "var(--layout-nav-zIndex)",
        width: "var(--layout-nav-vertical-width)",
        boxShadow: "0 0 40px rgba(0,0,0,0.15)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        [theme.breakpoints.up(layoutQuery)]: {
          display: "flex",
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} />
    </Box>
  );
}

export function NavMobile({ sx, data, open, slots, onClose }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 0,
          px: 0,
          overflow: "unset",
          background: "linear-gradient(180deg, #1a1a1a 0%, #121212 100%)", // Gradient tối kiểu Vercel
          width: "var(--layout-nav-mobile-width)",
          boxShadow: "0 0 40px rgba(0,0,0,0.15)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}