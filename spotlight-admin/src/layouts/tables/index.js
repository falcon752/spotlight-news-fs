import { useState, useMemo } from "react";
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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SortIcon from '@mui/icons-material/Sort'

import { authors, categories, posts, videos } from "store/mockData";

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
  const trimmed = text.split(" ").slice(0, 5).join(" ") + (text.split(" ").length > 5 ? "..." : "");
  return <MDTypography variant="caption">{trimmed}</MDTypography>;
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
        bgcolor: "rgba(0, 0, 0, 1)",
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

function Tables() {
  const [search, setSearch] = useState("");

  const filterPosts = useMemo(() => {
    return posts.filter(post => {
      const author = authors.find(a => a.id === post.authorId);
      const category = categories.find(c => c.id === post.categoryId);
      const combinedText = `${author?.name} ${category?.name} ${post.title} ${post.desc}`.toLowerCase();
      return combinedText.includes(search.toLowerCase());
    });
  }, [search]);

  const filterVideos = useMemo(() => {
    return videos.filter(video => {
      const author = authors.find(a => a.id === video.authorId);
      const combinedText = `${author?.name} ${video.title} ${video.desc}`.toLowerCase();
      return combinedText.includes(search.toLowerCase());
    });
  }, [search]);

  const postTableData = () => ({
    columns: [
      { Header: "editor", accessor: "editor", width: "20%", align: "left" },
      { Header: "category", accessor: "category", align: "center" },
      { Header: "title", accessor: "title", align: "left" },
      { Header: "description", accessor: "description", align: "left" },
      { Header: "image", accessor: "image", align: "center" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "actions", accessor: "actions", align: "center" },
    ],
    rows: filterPosts.map(post => {
      const author = authors.find(a => a.id === post.authorId);
      const category = categories.find(c => c.id === post.categoryId);
      const color = categoryColors[category?.slug] || "dark";

      return {
        editor: <Editor image={author.avatar} name={author.name} email={`${author.slug}@example.com`} />,
        category: <MDTypography variant="caption" fontWeight="medium" color={color}>{category.name}</MDTypography>,
        title: <MDTypography variant="button" fontWeight="medium">{post.title}</MDTypography>,
        description: <Description text={post.desc} />,
        image: <PostImage src={post.img} alt={post.title} />,
        date: <MDTypography variant="caption">{post.date}</MDTypography>,
        actions: (
          <MDBox display="flex" justifyContent="center" gap={1}>
            <MDButton size="small" variant="gradient" color="info">Edit</MDButton>
            <MDButton size="small" variant="gradient" color="error">Delete</MDButton>
          </MDBox>
        ),
      };
    }),
  });

  const videoTableData = () => ({
    columns: [
      { Header: "editor", accessor: "editor", width: "20%", align: "left" },
      { Header: "title", accessor: "title", align: "left" },
      { Header: "description", accessor: "description", align: "left" },
      { Header: "thumbnail", accessor: "thumbnail", align: "center" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "actions", accessor: "actions", align: "center" },
    ],
    rows: filterVideos.map(video => {
      const author = authors.find(a => a.id === video.authorId);

      return {
        editor: <Editor image={author.avatar} name={author.name} email={`${author.slug}@example.com`} />,
        title: <MDTypography variant="button" fontWeight="medium">{video.title}</MDTypography>,
        description: <Description text={video.desc} />,
        thumbnail: <VideoThumbnail src={video.thumbnail} alt={video.title} onClick={() => {
          const videoId = video.videoUrl.split('youtu.be/')[1].split('?')[0];
          MySwal.fire({
            title: `<a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" style="color:#fff;text-decoration:underline;">${video.title}</a>`,
            html: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`,
            showCloseButton: true,
            showConfirmButton: false,
            customClass: { popup: 'swal2-video-popup', title: 'swal2-video-title' },
          });
        }} />,
        date: <MDTypography variant="caption">{video.date}</MDTypography>,
        actions: (
          <MDBox display="flex" justifyContent="center" gap={1}>
            <MDButton size="small" variant="gradient" color="info">Edit</MDButton>
            <MDButton size="small" variant="gradient" color="error">Delete</MDButton>
          </MDBox>
        ),
      };
    }),
  });

  const { columns: pColumns, rows: pRows } = postTableData();
  const { columns: vColumns, rows: vRows } = videoTableData();

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
                {/* Title on the left */}
                <MDTypography variant="h6" color="white">
                  Post Table
                </MDTypography>

                {/* Search bar centered */}
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
                      input: { color: "#fff" }, // text inside input
                      label: { color: "#fff" }, // floating label
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" }, // normal border
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" }, // hover border
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" }, // focused border
                      "& .MuiInputLabel-root.Mui-focused": { color: "#fff" }, // label when focused
                    }}
                  />

                </MDBox>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
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
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="success" borderRadius="lg" coloredShadow="success">
                <MDTypography variant="h6" color="white">Video Table</MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: vColumns, rows: vRows }}
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

export default Tables;
