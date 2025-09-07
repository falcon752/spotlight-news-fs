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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import usePostStore from "store/usePostStore";
import useVideoStore from "store/useVideoStore";

const MySwal = withReactContent(Swal);

// Editor component for avatar, name, email
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
  const { posts, fetchPosts, deletePost, clearPosts } = usePostStore();
  const { videos, fetchVideos, deleteVideo, clearVideos } = useVideoStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentCategories, setCurrentCategories] = useState([]);
  const open = Boolean(anchorEl);

  const handleCategoryClick = (event, categories) => {
    setAnchorEl(event.currentTarget);
    setCurrentCategories(categories);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentCategories([]);
  };

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

  // 🔹 Delete single post
  const handleDeletePost = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await deletePost(id);
        MySwal.fire("Deleted!", "The post has been deleted.", "success");
      } catch (err) {
        MySwal.fire("Error!", err.message || "Failed to delete post.", "error");
      }
    }
  };

  // 🔹 Delete single video
  const handleDeleteVideo = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await deleteVideo(id);
        MySwal.fire("Deleted!", "The video has been deleted.", "success");
      } catch (err) {
        MySwal.fire("Error!", err.message || "Failed to delete video.", "error");
      }
    }
  };

  // 🔹 Clear all posts
  const handleClearPosts = async () => {
    if (posts.length === 0) {
      MySwal.fire("Nothing to clear", "No posts found in the table.", "info");
      return;
    }

    const result = await MySwal.fire({
      title: "Delete ALL posts?",
      text: "This will permanently remove all posts. This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await clearPosts();
        MySwal.fire("Cleared!", "All posts have been deleted.", "success");
      } catch (err) {
        MySwal.fire("Error!", err.message || "Failed to clear posts.", "error");
      }
    }
  };

  // 🔹 Clear all videos
  const handleClearVideos = async () => {
    if (videos.length === 0) {
      MySwal.fire("Nothing to clear", "No videos found in the table.", "info");
      return;
    }

    const result = await MySwal.fire({
      title: "Delete ALL videos?",
      text: "This will permanently remove all videos. This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await clearVideos();
        MySwal.fire("Cleared!", "All videos have been deleted.", "success");
      } catch (err) {
        MySwal.fire("Error!", err.message || "Failed to clear videos.", "error");
      }
    }
  };

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

        let categoryCell = null;
        if (categories.length === 1) {
          const color = categoryColors[categories[0]?.slug] || "dark";
          categoryCell = (
            <Tooltip title={categories[0].name} arrow>
              <MDTypography variant="caption" fontWeight="medium" color={color}>
                {categories[0].name}
              </MDTypography>
            </Tooltip>
          );
        } else if (categories.length > 1) {
          categoryCell = (
            <Tooltip title={categories.map((cat) => cat.name).join(", ")} arrow>
              <MDBox
                display="flex"
                alignItems="center"
                position="relative"
                sx={{ cursor: "pointer" }}
                onClick={(e) => handleCategoryClick(e, categories)}
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
                >
                  {categories.length}
                </MDBox>
              </MDBox>
            </Tooltip>
          );
        }

        return {
          editor: (
            <Editor
              image={author?.avatar_url || ""}
              name={author?.name}
              email={author?.email || ""}
            />
          ),
          category: categoryCell,
          title: <TrimmedTitle text={post.title} />,
          description: <Description text={post.desc} />,
          image: post.img ? (
            <PostImage src={post.img_url} alt={post.title} />
          ) : null,
          date: (
            <MDTypography variant="caption">
              {post.created_at
                ? new Date(post.created_at).toLocaleString()
                : "-"}
            </MDTypography>
          ),
          actions: (
            <MDBox display="flex" justifyContent="center" gap={1}>
              <MDButton size="small" variant="gradient" color="info">
                Edit
              </MDButton>
              <MDButton
                size="small"
                variant="gradient"
                color="error"
                onClick={() => handleDeletePost(post.id)}
              >
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

        let videoId = "";
        if (video.video_url) {
          try {
            const url = new URL(video.video_url);
            videoId = url.hostname.includes("youtu.be")
              ? url.pathname.slice(1)
              : url.searchParams.get("v") || "";
          } catch (error) {
            videoId = "";
          }
        }

        const thumbnailUrl = videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : null;

        return {
          editor: (
            <Editor
              image={author?.avatar_url || ""}
              name={author?.name}
              email={author?.email || ""}
            />
          ),
          title: <TrimmedTitle text={video.title} />,
          description: <Description text={video.desc} />,
          thumbnail: thumbnailUrl ? (
            <VideoThumbnail
              src={thumbnailUrl}
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
              <MDButton
                size="small"
                variant="gradient"
                color="error"
                onClick={() => handleDeleteVideo(video.id)}
              >
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
          {/* Post Table */}
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
              <MDBox p={2} display="flex" justifyContent="flex-end">
                <MDButton variant="gradient" color="error" onClick={handleClearPosts}>
                  Clear Table
                </MDButton>
              </MDBox>
            </Card>
          </Grid>

          {/* Video Table */}
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
              <MDBox p={2} display="flex" justifyContent="flex-end">
                <MDButton variant="gradient" color="error" onClick={handleClearVideos}>
                  Clear Table
                </MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {currentCategories.map((cat) => (
          <MenuItem key={cat.id}>{cat.name}</MenuItem>
        ))}
      </Menu>

      <Footer />
    </DashboardLayout>
  );
}
