import { useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Spotlight Admin components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Spotlight Admin example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// CKEditor
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// MUI Icon
import PhotoCamera from "@mui/icons-material/PhotoCamera";

function CreateForm() {
  const editorRef = useRef();
  const [primaryImagePreview, setPrimaryImagePreview] = useState(null);
  const [contentType, setContentType] = useState("post"); // Default type
  const [videoUrl, setVideoUrl] = useState("");

  const handlePrimaryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPrimaryImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = editorRef.current.editor.getData();

    // Only collect categories if type = post
    const categories =
      contentType === "post"
        ? Array.from(e.target.elements["categories"])
            .filter((el) => el.checked)
            .map((el) => el.value)
        : [];

    console.log({ title, contentType, content, categories, videoUrl, primaryImagePreview });
    // send data to API
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Card>
              {/* Header */}
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Create New Content
                </MDTypography>
              </MDBox>

              {/* Form */}
              <MDBox p={3}>
                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <MDBox mb={2}>
                    <MDInput label="Title" name="title" fullWidth />
                  </MDBox>

                  {/* Content Type Selector */}
                  <MDBox mb={2}>
                    <MDTypography variant="subtitle2" color="text" mb={1}>
                      Select Type
                    </MDTypography>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
                    >
                      <option value="post">Post</option>
                      <option value="video">Video</option>
                    </select>
                  </MDBox>

                  {/* Video URL (only if type = video) */}
                  {contentType === "video" && (
                    <MDBox mb={2}>
                      <MDInput
                        label="Video URL (YouTube)"
                        name="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        fullWidth
                      />
                    </MDBox>
                  )}

                  {/* CKEditor Section */}
                  <MDBox mb={2}>
                    <MDTypography variant="subtitle2" color="text">
                      <h4>Content</h4>
                    </MDTypography>
                    <CKEditor
                      editor={ClassicEditor}
                      data=""
                      onReady={(editor) => {
                        editorRef.current = { editor };

                        // Enable Base64 image upload
                        const fileRepository = editor.plugins.get("FileRepository");
                        fileRepository.createUploadAdapter = (loader) => {
                          return {
                            upload: () =>
                              loader.file.then((file) => {
                                return new Promise((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = () => resolve({ default: reader.result });
                                  reader.onerror = (err) => reject(err);
                                  reader.readAsDataURL(file);
                                });
                              }),
                          };
                        };
                      }}
                    />
                  </MDBox>

                  {/* Primary Image Upload */}
                  <MDBox mb={2}>
                    <MDTypography variant="subtitle2" color="text">
                      <h4>Primary Image</h4>
                    </MDTypography>

                    <MDBox
                      onClick={() => document.getElementById("primary-image-input").click()}
                      sx={{
                        width: "100%",
                        height: "300px",
                        border: "2px dashed #1976d2",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        backgroundColor: "#f4f6f8",
                        position: "relative",
                        overflow: "hidden",
                        "&:hover .overlay": { opacity: 1 },
                      }}
                    >
                      {!primaryImagePreview && (
                        <MDBox
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          gap={1}
                        >
                          <PhotoCamera sx={{ fontSize: 50, color: "#1976d2" }} />
                          <span style={{ color: "#1976d2", fontWeight: 500 }}>
                            Click or tap to upload primary image
                          </span>
                        </MDBox>
                      )}

                      {primaryImagePreview && (
                        <>
                          <img
                            src={primaryImagePreview}
                            alt="Primary Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              position: "absolute",
                              top: 0,
                              left: 0,
                            }}
                          />
                          <MDBox
                            className="overlay"
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0,0,0,0.4)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "opacity 0.3s",
                              color: "#fff",
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                          >
                            <PhotoCamera sx={{ fontSize: 40, marginRight: "8px" }} />
                            Change Image
                          </MDBox>
                        </>
                      )}

                      <input
                        type="file"
                        id="primary-image-input"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handlePrimaryImageChange}
                      />
                    </MDBox>
                  </MDBox>

                  {/* Categories (only for posts) */}
                  {contentType === "post" && (
                    <MDBox mb={2}>
                      <MDTypography variant="subtitle2" color="text" mb={1}>
                        Select Categories
                      </MDTypography>
                      <MDBox display="flex" flexDirection="column">
                        {["News", "Fact Check", "Investigation", "Impact", "Lifestyle"].map((cat) => (
                          <label key={cat} style={{ marginBottom: "6px", fontWeight: 500 }}>
                            <input
                              type="checkbox"
                              name="categories"
                              value={cat.toLowerCase()}
                              style={{ marginRight: "6px" }}
                            />
                            {cat}
                          </label>
                        ))}
                      </MDBox>
                    </MDBox>
                  )}

                  <MDBox mt={3}>
                    <MDButton type="submit" variant="gradient" color="info" fullWidth>
                      Submit
                    </MDButton>
                  </MDBox>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CreateForm;
