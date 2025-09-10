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
import useAuthStore from "store/useAuthStore";
import useVideoStore from "store/useVideoStore";
import Swal from "sweetalert2";
import axiosAdmin from "api/axiosAdmin";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ Custom upload adapter using axiosAdmin
class CustomUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;
    const formData = new FormData();
    formData.append("upload", file);

    try {
      const { data } = await axiosAdmin.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { default: data.url }; // backend must return { url: "..." }
    } catch (err) {
      console.error("Upload adapter error:", err.response?.data || err.message);
      throw err;
    }
  }

  abort() {
    // Optional: implement abort logic if needed
  }
}

function CreateForm() {
  const location = useLocation(); // ✅ added
  const navigate = useNavigate(); // ✅ added

  const editorRef = useRef();

  const createPost = usePostStore((state) => state.createPost);
  const updatePost = usePostStore((state) => state.updatePost); // ✅ added
  const createVideo = useVideoStore((state) => state.createVideo);
  const updateVideo = useVideoStore((state) => state.updateVideo); // ✅ added

  const { categories, fetchCategories } = useCategoryStore();
  const { author } = useAuthStore();

  const [title, setTitle] = useState("");
  const [primaryImagePreview, setPrimaryImagePreview] = useState(null);
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [contentType, setContentType] = useState("post");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const editingItem = location.state?.data || null; // ✅ use location safely
  const editingType = location.state?.type || null;
  const isEditing = Boolean(editingItem);

  // Load draft or editing data
  useEffect(() => {
    fetchCategories();

    if (editingItem) {
      setTitle(editingItem.title || "");
      setContent(editingItem.desc || editingItem.content || "");
      setContentType(editingType);
      setVideoUrl(editingItem.video_url || "");
      setSelectedCategories(editingItem.categories?.map((c) => c.id) || []);
      setPrimaryImagePreview(
        editingItem.img_url || editingItem.thumbnail || null
      );
    } else {
      const draft = JSON.parse(localStorage.getItem("createFormDraft"));
      if (draft) {
        setTitle(draft.title || "");
        setContent(draft.content || "");
        setContentType(draft.contentType || "post");
        setVideoUrl(draft.videoUrl || "");
        setSelectedCategories(draft.categories || []);
        setPrimaryImagePreview(draft.primaryImagePreview || null);
      }
    }
  }, [editingItem, editingType, fetchCategories]);

  // Save draft
  useEffect(() => {
    if (!isEditing) {
      localStorage.setItem(
        "createFormDraft",
        JSON.stringify({
          title,
          content,
          contentType,
          videoUrl,
          categories: selectedCategories,
          primaryImagePreview,
        })
      );
    }
  }, [
    title,
    content,
    contentType,
    videoUrl,
    selectedCategories,
    primaryImagePreview,
    isEditing,
  ]);

  const handlePrimaryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrimaryImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setPrimaryImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Validation
  const validate = () => {
    let temp = {};
    if (!title.trim()) temp.title = "Title is required.";
    if (!content.trim()) temp.content = "Content is required.";
    if (contentType === "post" && !primaryImageFile && !isEditing)
      temp.primaryImage = "Primary image is required."; // ✅ fixed validation
    if (contentType === "video" && !videoUrl.trim())
      temp.videoUrl = "Video URL is required.";
    if (contentType === "post" && selectedCategories.length === 0)
      temp.categories = "At least one category must be selected.";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please fix the errors before submitting.",
    });
    return;
  }

  if (!author) {
    Swal.fire({
      icon: "warning",
      title: "Not Logged In",
      text: "You must be logged in to create content.",
    });
    return;
  }

  try {
    if (isEditing) {
      if (contentType === "video") {
        await updateVideo(editingItem.id, {
          title,
          desc: content,
          video_url: videoUrl,
          author_id: author.id,
          thumbnail: primaryImageFile || editingItem.thumbnail,
        });
      } else {
        await updatePost(editingItem.id, {
          title,
          desc: content,
          categories: selectedCategories,
          primaryImage: primaryImageFile instanceof File ? primaryImageFile : null,
          date: editingItem.date, // optional
        });
      }

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${contentType === "video" ? "Video" : "Post"} updated successfully.`,
      });

      navigate(-1); // go back
      return;
    }

    // CREATE NEW
    if (contentType === "video") {
      await createVideo({
        title,
        content,
        videoUrl,
        authorId: author.id,
        thumbnail: primaryImageFile,
      });
    } else {
      await createPost({
        title,
        desc: content,
        categories: selectedCategories,
        primaryImage: primaryImageFile,
        authorId: author.id,
        videoUrl: null,
      });
    }

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `${contentType === "video" ? "Video" : "Post"} created successfully.`,
      confirmButtonColor: "#3085d6",
    });

    // Reset form
    setTitle("");
    setContent("");
    setContentType("post");
    setVideoUrl("");
    setSelectedCategories([]);
    setPrimaryImagePreview(null);
    setPrimaryImageFile(null);
    setErrors({});
    if (editorRef.current?.editor) editorRef.current.editor.setData("");
    localStorage.removeItem("createFormDraft");
  } catch (err) {
    console.error("❌ Failed to submit:", err.response?.data || err.message);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `Error submitting ${contentType}. Your draft is saved.`,
    });
  }
};


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
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
              >
                <MDTypography variant="h6" color="white">
                  {isEditing ? "Edit Content" : "Create New Content"}{" "}
                  {/* ✅ dynamic title */}
                </MDTypography>
              </MDBox>

              <MDBox p={3}>
                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <MDBox mb={2}>
                    <MDInput
                      label="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      fullWidth
                    />
                    {errors.title && (
                      <span style={{ color: "red", fontSize: "14px" }}>
                        {errors.title}
                      </span>
                    )}
                  </MDBox>

                  {/* Content Type */}
                  <MDBox mb={2}>
                    <MDTypography variant="subtitle2" color="text" mb={1}>
                      Select Type
                    </MDTypography>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      style={{ width: "100%", padding: "10px" }}
                      disabled={isEditing} // lock type when editing
                    >
                      <option value="post">Post</option>
                      <option value="video">Video</option>
                    </select>
                  </MDBox>

                  {/* Video URL */}
                  {contentType === "video" && (
                    <MDBox mb={2}>
                      <MDInput
                        label="Video URL (YouTube)"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        fullWidth
                      />
                      {errors.videoUrl && (
                        <span style={{ color: "red", fontSize: "14px" }}>
                          {errors.videoUrl}
                        </span>
                      )}
                    </MDBox>
                  )}

                  {/* Content */}
                  <MDBox mb={2}>
                    <MDTypography variant="subtitle2" color="text">
                      <h4>Content</h4>
                    </MDTypography>
                    <CKEditor
                      editor={ClassicEditor}
                      data={content}
                      onReady={(editor) => {
                        editorRef.current = { editor };
                        editor.plugins.get(
                          "FileRepository"
                        ).createUploadAdapter = (loader) =>
                          new CustomUploadAdapter(loader);
                      }}
                      onChange={(event, editor) => setContent(editor.getData())}
                      onError={(error, { willEditorRestart }) => {
                        // Suppress harmless errors
                        if (
                          error?.message?.includes("view-position-before-root")
                        ) {
                          console.warn(
                            "CKEditor harmless error suppressed:",
                            error.message
                          );
                          return;
                        }
                        throw error; // Let other errors bubble
                      }}
                    />

                    {errors.content && (
                      <span style={{ color: "red", fontSize: "14px" }}>
                        {errors.content}
                      </span>
                    )}
                  </MDBox>

                  {/* Primary Image */}
                  {contentType === "post" && (
                    <MDBox mb={2}>
                      <MDTypography variant="subtitle2" color="text">
                        <h4>Primary Image</h4>
                      </MDTypography>
                      <MDBox
                        onClick={() =>
                          document.getElementById("primary-image-input").click()
                        }
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
                        {!primaryImagePreview ? (
                          <MDBox
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            gap={1}
                          >
                            <PhotoCamera
                              sx={{ fontSize: 50, color: "#1976d2" }}
                            />
                            <span style={{ color: "#1976d2", fontWeight: 500 }}>
                              Click or tap to upload primary image
                            </span>
                          </MDBox>
                        ) : (
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
                              <PhotoCamera
                                sx={{ fontSize: 40, marginRight: "8px" }}
                              />{" "}
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
                      {errors.primaryImage && (
                        <span style={{ color: "red", fontSize: "14px" }}>
                          {errors.primaryImage}
                        </span>
                      )}
                    </MDBox>
                  )}

                  {/* Categories */}
                  {contentType === "post" && (
                    <MDBox mb={2}>
                      <MDTypography variant="subtitle2" color="text" mb={1}>
                        Select Categories
                      </MDTypography>
                      <MDBox display="flex" flexDirection="column">
                        {categories.map((cat) => (
                          <label
                            key={cat.id}
                            style={{ marginBottom: "6px", fontWeight: 500 }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat.id)}
                              onChange={() => handleCategoryChange(cat.id)}
                              style={{ marginRight: "6px" }}
                            />
                            {cat.name}
                          </label>
                        ))}
                      </MDBox>
                      {errors.categories && (
                        <span style={{ color: "red", fontSize: "14px" }}>
                          {errors.categories}
                        </span>
                      )}
                    </MDBox>
                  )}

                  {/* Submit */}
                  <MDBox mt={3}>
                    <MDButton
                      type="submit"
                      variant="gradient"
                      color="info"
                      fullWidth
                    >
                      {isEditing ? "Update" : "Submit"}{" "}
                      {/* ✅ dynamic button */}
                    </MDButton>
                    {!isEditing && (
                      <MDButton
                        variant="outlined"
                        color="error"
                        size="small"
                        fullWidth
                        sx={{ mt: 1 }}
                        onClick={() => {
                          setTitle("");
                          setContent("");
                          setContentType("post");
                          setVideoUrl("");
                          setSelectedCategories([]);
                          setPrimaryImagePreview(null);
                          setPrimaryImageFile(null);
                          setErrors({});
                          if (editorRef.current?.editor) {
                            editorRef.current.editor.setData("");
                          }
                          localStorage.removeItem("createFormDraft");

                          Swal.fire({
                            icon: "info",
                            title: "Cleared",
                            text: "All inputs and saved draft have been cleared.",
                          });
                        }}
                      >
                        Clear Inputs
                      </MDButton>
                    )}
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
