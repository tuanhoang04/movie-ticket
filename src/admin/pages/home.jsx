import { Helmet } from "react-helmet-async";
import { DashboardContent } from "../layouts/dashboard";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

// ----------------------------------------------------------------------
export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>{`Home | Admin Page for Starlight Movie Ticket Sales Website`}</title>
      </Helmet>

      <DashboardContent>
        <Box sx={{ padding: 4, textAlign: "center" }}>
          <Typography variant="h2" gutterBottom>
            Welcome to the Dashboard!
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 3 }}>
            Here, you can manage and view analytics and statistics about the
            website's data.
          </Typography>
          <Button
            component={Link}
            to="/admin/dashboard"
            variant="outlined"
            color="primary"
          >
            Get Started
          </Button>
        </Box>
      </DashboardContent>
    </>
  );
}
