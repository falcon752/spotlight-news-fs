import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { posts, videos } from "store/mockData"; // only posts and videos

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import useAuthStore from "store/authStore"; // Zustand store

// Helper to calculate percentage change
const calculatePercentage = (current, previous) => {
  if (previous === 0) return "+100%";
  const percent = ((current - previous) / previous) * 100;
  return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`;
};

function Dashboard() {
  const { authors, fetchAuthors, isLoading } = useAuthStore();

  // Fetch authors on mount
  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  // Simulated previous counts (replace with real historical data)
  const prevPosts = 2;
  const prevVideos = 3;
  const prevAuthors = 4;

  const postsChange = calculatePercentage(posts.length, prevPosts);
  const videosChange = calculatePercentage(videos.length, prevVideos);
  const authorsChange = calculatePercentage(authors.length, prevAuthors);

  const { sales, tasks } = reportsLineChartData;

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3} textAlign="center">
          Loading dashboard...
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Top Statistics Cards */}
        <Grid container spacing={3}>
          {/* Posts */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="article"
                title="Posts"
                count={posts.length}
                percentage={{
                  color: posts.length - prevPosts >= 0 ? "success" : "error",
                  amount: postsChange,
                  label: "compared to last week",
                }}
              />
            </MDBox>
          </Grid>

          {/* Videos */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="video_library"
                title="Videos"
                count={videos.length}
                percentage={{
                  color: videos.length - prevVideos >= 0 ? "success" : "error",
                  amount: videosChange,
                  label: "compared to last week",
                }}
              />
            </MDBox>
          </Grid>

          {/* Total Users */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="person"
                title="Total Users"
                count={authors.length} // from Zustand store
                percentage={{
                  color: authors.length - prevAuthors >= 0 ? "success" : "error",
                  amount: `${authorsChange}%`,
                  label: "compared to last week",
                }}
              />
            </MDBox>
          </Grid>

          {/* Followers */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* Charts */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Website Views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Daily Sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Completed Tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Projects & Orders */}
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
