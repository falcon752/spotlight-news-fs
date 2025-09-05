import { useRef, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import usePostStore from "store/usePostStore";
import { useCategoryStore } from "store/useCategoryStore";
import useAuthStore from "store/authStore";

function CreateForm() {
  const editorRef = useRef();
  const createPost = usePostStore((state) => state.createPost);
  const { categories, fetchCategories } = useCategoryStore();
  const { author } = useAuthStore(); // ✅ get logged-in author

  const [primaryImagePreview, setPrimaryImagePreview] = useState(null);
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [contentType, setContentType] = useState("post"); 
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePrimaryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrimaryImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setPrimaryImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const content = editorRef.current.editor.getData();

  const selectedCategories =
    contentType === "post"
      ? Array.from(e.target.elements["categories"])
          .filter((el) => el.checked)
          .map((el) => parseInt(el.value))
      : [];

  if (!author) {
    alert("You must be logged in to create a post.");
    return;
  }

  // Build the payload for debugging
  const payload = {
    title,
    content,
    categories: selectedCategories,
    primaryImage: primaryImageFile,
    authorId: author.id,
  };

  console.log("🚀 Payload being sent:", payload);

  try {
    await createPost(payload);

    alert("Post created successfully!");
    e.target.reset();
    setPrimaryImagePreview(null);
    setPrimaryImageFile(null);
    editorRef.current.editor.setData("");
  } catch (err) {
    console.error("❌ Failed to create post:", err.response?.data || err.message);
    alert("Error creating post. Check console.");
  }
};


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">
                  Create New Content
                </MDTypography>
              </MDBox>

              <MDBox p={3}>
                <form onSubmit={handleSubmit}>
                  <MDBox mb={2}>
                    <MDInput label="Title" name="title" fullWidth />
                  </MDBox>

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

                  <MDBox mb={2}>
                    <MDTypography variant="subtitle2" color="text">
                      <h4>Content</h4>
                    </MDTypography>
                    <CKEditor
                      editor={ClassicEditor}
                      data=""
                      onReady={(editor) => {
                        editorRef.current = { editor };
                        const fileRepository = editor.plugins.get("FileRepository");
                        fileRepository.createUploadAdapter = (loader) => ({
                          upload: () =>
                            loader.file.then(
                              (file) =>
                                new Promise((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = () => resolve({ default: reader.result });
                                  reader.onerror = (err) => reject(err);
                                  reader.readAsDataURL(file);
                                })
                            ),
                        });
                      }}
                    />
                  </MDBox>

                  <MDBox mb={2}>
                    <MDTypography variant="subtitle2" color="text"><h4>Primary Image</h4></MDTypography>
                    <MDBox
                      onClick={() => document.getElementById("primary-image-input").click()}
                      sx={{
                        width: "100%", height: "300px", border: "2px dashed #1976d2",
                        borderRadius: "8px", display: "flex", alignItems: "center",
                        justifyContent: "center", cursor: "pointer",
                        backgroundColor: "#f4f6f8", position: "relative",
                        overflow: "hidden", "&:hover .overlay": { opacity: 1 },
                      }}
                    >
                      {!primaryImagePreview ? (
                        <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={1}>
                          <PhotoCamera sx={{ fontSize: 50, color: "#1976d2" }} />
                          <span style={{ color: "#1976d2", fontWeight: 500 }}>
                            Click or tap to upload primary image
                          </span>
                        </MDBox>
                      ) : (
                        <>
                          <img
                            src={primaryImagePreview}
                            alt="Primary Preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
                          />
                          <MDBox className="overlay"
                            sx={{
                              position: "absolute", top: 0, left: 0,
                              width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              opacity: 0, transition: "opacity 0.3s", color: "#fff", fontSize: 14, fontWeight: 500,
                            }}
                          >
                            <PhotoCamera sx={{ fontSize: 40, marginRight: "8px" }} /> Change Image
                          </MDBox>
                        </>
                      )}
                      <input type="file" id="primary-image-input" style={{ display: "none" }} accept="image/*" onChange={handlePrimaryImageChange} />
                    </MDBox>
                  </MDBox>

                  {contentType === "post" && (
                    <MDBox mb={2}>
                      <MDTypography variant="subtitle2" color="text" mb={1}>Select Categories</MDTypography>
                      <MDBox display="flex" flexDirection="column">
                        {categories.map(cat => (
                          <label key={cat.id} style={{ marginBottom: "6px", fontWeight: 500 }}>
                            <input type="checkbox" name="categories" value={cat.id} style={{ marginRight: "6px" }} />
                            {cat.name}
                          </label>
                        ))}
                      </MDBox>
                    </MDBox>
                  )}

                  <MDBox mt={3}>
                    <MDButton type="submit" variant="gradient" color="info" fullWidth>Submit</MDButton>
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
