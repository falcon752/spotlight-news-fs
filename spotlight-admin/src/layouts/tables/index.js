import { useState, useMemo, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import usePostStore from "store/usePostStore";
import useVideoStore from "store/useVideoStore";

const MySwal = withReactContent(Swal);

const Editor = ({ image, name, email }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDAvatar src={image} name={name} size="sm" />
    <MDBox ml={2} lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
      <MDTypography variant="caption">{email}</MDTypography>
    </MDBox>
  </MDBox>
);

const Description = ({ text }) => {
  const trimmed =
    text
      .replace(/<[^>]+>/g, "")
      .split(" ")
      .slice(0, 5)
      .join(" ") + (text.split(" ").length > 5 ? "..." : "");
  return <MDTypography variant="caption">{trimmed}</MDTypography>;
};

const TrimmedTitle = ({ text, wordLimit = 3 }) => {
  const words = text.split(" ");
  const trimmed =
    words.slice(0, wordLimit).join(" ") +
    (words.length > wordLimit ? "..." : "");
  return (
    <MDTypography variant="button" fontWeight="medium">
      {trimmed}
    </MDTypography>
  );
};

const PostImage = ({ src, alt }) => (
  <MDBox
    component="img"
    src={src}
    alt={alt}
    sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: "4px" }}
  />
);

const VideoThumbnail = ({ src, alt, onClick }) => (
  <MDBox
    position="relative"
    width={80}
    height={60}
    sx={{ cursor: "pointer", borderRadius: "4px", overflow: "hidden" }}
    onClick={onClick}
  >
    <MDBox
      component="img"
      src={src}
      alt={alt}
      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <MDBox
      position="absolute"
      top="50%"
      left="50%"
      sx={{
        transform: "translate(-50%, -50%)",
        color: "#fff",
        bgcolor: "rgba(0, 0, 0, 0.7)",
        borderRadius: "50%",
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PlayArrowIcon fontSize="small" />
    </MDBox>
  </MDBox>
);

const categoryColors = {
  investigation: "info",
  news: "success",
  "fact-check": "warning",
  politics: "error",
  sports: "primary",
  entertainment: "secondary",
};

export default function Tables() {
  const [search, setSearch] = useState("");

  const { posts, fetchPosts } = usePostStore();
  const { videos, fetchVideos } = useVideoStore();

  // Fetch data only once on mount
  useEffect(() => {
    fetchPosts();
    fetchVideos();
  }, [fetchPosts, fetchVideos]);

  const filterPosts = useMemo(() => {
    return posts.filter((post) => {
      const author = post.author;
      const category = post.categories?.[0];
      const combinedText = `${author?.name || ""} ${category?.name || ""} ${
        post.title
      } ${post.desc}`.toLowerCase();
      return combinedText.includes(search.toLowerCase());
    });
  }, [posts, search]);

  const filterVideos = useMemo(() => {
    return videos.filter((video) => {
      const author = video.author;
      const combinedText = `${author?.name || ""} ${video.title} ${
        video.desc
      }`.toLowerCase();
      return combinedText.includes(search.toLowerCase());
    });
  }, [videos, search]);

  const postTableData = useMemo(
    () => ({
      columns: [
        { Header: "editor", accessor: "editor", width: "20%", align: "left" },
        { Header: "category", accessor: "category", align: "center" },
        { Header: "title", accessor: "title", align: "left" },
        { Header: "description", accessor: "description", align: "left" },
        { Header: "image", accessor: "image", align: "center" },
        { Header: "date", accessor: "date", align: "center" },
        { Header: "actions", accessor: "actions", align: "center" },
      ],
      rows: filterPosts.map((post) => {
        const author = post.author;
        const categories = post.categories || [];

        // Handle category display with multiple categories
        let categoryCell;
        if (categories.length === 1) {
          const color = categoryColors[categories[0]?.slug] || "dark";
          categoryCell = (
            <MDTypography variant="caption" fontWeight="medium" color={color}>
              {categories[0].name}
            </MDTypography>
          );
        } else if (categories.length > 1) {
          categoryCell = (
            <MDBox
              display="flex"
              alignItems="center"
              position="relative"
              sx={{ cursor: "default" }}
            >
              <MDTypography
                variant="caption"
                fontWeight="medium"
                color={categoryColors[categories[0]?.slug] || "dark"}
              >
                {categories[0].name}
              </MDTypography>
              <MDBox
                component="span"
                sx={{
                  ml: 1,
                  bgcolor: "info.main",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  fontSize: "0.6rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={categories.map((cat) => cat.name).join(", ")} // hover shows all categories
              >
                {categories.length}
              </MDBox>
            </MDBox>
          );
        } else {
          categoryCell = null;
        }

        return {
          editor: (
            <Editor
              image={author?.avatar}
              name={author?.name}
              email={`${author?.slug || author?.name}@example.com`}
            />
          ),
          category: categoryCell,
          title: <TrimmedTitle text={post.title} />,
          description: <Description text={post.desc} />,
          image: post.img ? (
            <PostImage
              src={`http://127.0.0.1:8000/storage/${post.img}`}
              alt={post.title}
            />
          ) : null,
          date: <MDTypography variant="caption">{post.date}</MDTypography>,
          actions: (
            <MDBox display="flex" justifyContent="center" gap={1}>
              <MDButton size="small" variant="gradient" color="info">
                Edit
              </MDButton>
              <MDButton size="small" variant="gradient" color="error">
                Delete
              </MDButton>
            </MDBox>
          ),
        };
      }),
    }),
    [filterPosts]
  );

  const videoTableData = useMemo(
    () => ({
      columns: [
        { Header: "editor", accessor: "editor", width: "20%", align: "left" },
        { Header: "title", accessor: "title", align: "left" },
        { Header: "description", accessor: "description", align: "left" },
        { Header: "thumbnail", accessor: "thumbnail", align: "center" },
        { Header: "date", accessor: "date", align: "center" },
        { Header: "actions", accessor: "actions", align: "center" },
      ],
      rows: filterVideos.map((video) => {
        const author = video.author;
        const videoId = video.videoUrl?.split("youtu.be/")[1]?.split("?")[0];

        return {
          editor: (
            <Editor
              image={author?.avatar}
              name={author?.name}
              email={`${author?.slug || author?.name}@example.com`}
            />
          ),
          title: <TrimmedTitle text={video.title} />,
          description: <Description text={video.desc} />,
          thumbnail: video.thumbnail ? (
            <VideoThumbnail
              src={video.thumbnail}
              alt={video.title}
              onClick={() => {
                MySwal.fire({
                  title: `<a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" style="color:#fff;text-decoration:underline;">${video.title}</a>`,
                  html: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`,
                  showCloseButton: true,
                  showConfirmButton: false,
                  customClass: {
                    popup: "swal2-video-popup",
                    title: "swal2-video-title",
                  },
                });
              }}
            />
          ) : null,
          date: <MDTypography variant="caption">{video.date}</MDTypography>,
          actions: (
            <MDBox display="flex" justifyContent="center" gap={1}>
              <MDButton size="small" variant="gradient" color="info">
                Edit
              </MDButton>
              <MDButton size="small" variant="gradient" color="error">
                Delete
              </MDButton>
            </MDBox>
          ),
        };
      }),
    }),
    [filterVideos]
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                position="relative"
                display="flex"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Post Table
                </MDTypography>
                <MDBox
                  sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <MDInput
                    label="Search posts/videos"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{
                      width: 300,
                      input: { color: "#fff" },
                      label: { color: "#fff" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff",
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
                    }}
                  />
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={postTableData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
              >
                <MDTypography variant="h6" color="white">
                  Video Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={videoTableData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
