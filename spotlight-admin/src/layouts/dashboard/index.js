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

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";

// Stores
import useAuthStore from "store/useAuthStore";
import usePostStore from "store/usePostStore";
import useVideoStore from "store/useVideoStore";
import { useCategoryStore } from "store/useCategoryStore";
import usePageVisitStore from "store/usePageVisitStore"; // <-- import new store

// Helper to calculate percentage change
const calculatePercentage = (current, previous) => {
  if (previous === 0) return "+100%";
  const percent = ((current - previous) / previous) * 100;
  return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`;
};

function Dashboard() {
  const { authors, fetchAuthors, isLoading } = useAuthStore();
  const { posts, fetchPosts, loading: postsLoading } = usePostStore();
  const { videos, fetchVideos, loading: videosLoading } = useVideoStore();
  const { categories, fetchCategories, loading: categoriesLoading } =
    useCategoryStore();

  const { totalVisits, fetchTotalVisits, loading: visitsLoading } =
    usePageVisitStore(); // fetch total page visits

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([
        fetchAuthors(),
        fetchPosts(),
        fetchVideos(),
        fetchCategories(),
        fetchTotalVisits(), // fetch visits dynamically
      ]);
    };
    fetchAll();
  }, [fetchAuthors, fetchPosts, fetchVideos, fetchCategories, fetchTotalVisits]);

  // Simulated previous counts
  const prevPosts = 2;
  const prevVideos = 3;
  const prevAuthors = 4;
  const prevCategories = 3;

  const postsChange = calculatePercentage(posts.length, prevPosts);
  const videosChange = calculatePercentage(videos.length, prevVideos);
  const authorsChange = calculatePercentage(authors.length, prevAuthors);
  const categoriesChange = calculatePercentage(categories.length, prevCategories);

  // Loader
  if (
    isLoading ||
    postsLoading ||
    videosLoading ||
    categoriesLoading ||
    visitsLoading
  ) {
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
                count={authors.length}
                percentage={{
                  color: authors.length - prevAuthors >= 0 ? "success" : "error",
                  amount: authorsChange,
                  label: "compared to last week",
                }}
              />
            </MDBox>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="category"
                title="Categories"
                count={categories.length}
                percentage={{
                  color: categories.length - prevCategories >= 0 ? "success" : "error",
                  amount: categoriesChange,
                  label: "compared to last week",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* Projects and Total Page Visits side by side */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {/* Projects */}
            <Grid item xs={12} md={8} lg={8}>
              <Projects />
            </Grid>

            {/* Total Page Visits */}
            <Grid item xs={12} md={4} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="visibility"
                  title="Total Page Visits"
                  count={totalVisits} // <-- dynamic total visits
                  percentage={{
                    color: "success",
                    amount: "+0%", // Optional: calculate weekly change if needed
                    label: "compared to last week",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
