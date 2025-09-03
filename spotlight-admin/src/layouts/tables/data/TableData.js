/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Spotlight Admin - Posts Table
=========================================================
*/

// Spotlight Admin components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";

// Example Images (avatars + post images)
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

import home1 from "../../../assets/images/home-decor-1.jpg";
import home2 from "../../../assets/images/home-decor-2.jpg";
import home3 from "../../../assets/images/home-decor-3.jpg";
import home4 from "../../../assets/images/home-decor-4.jpeg";

export default function data() {
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

  const PostDescription = ({ text }) => {
    const trimmed =
      text.split(" ").slice(0, 5).join(" ") +
      (text.split(" ").length > 5 ? "..." : "");
    return <MDTypography variant="caption">{trimmed}</MDTypography>;
  };

  const PostImage = ({ src, alt }) => (
    <MDBox
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: 60,
        height: 60,
        objectFit: "cover",
        borderRadius: "4px",
      }}
    />
  );

  return {
    columns: [
      { Header: "editor", accessor: "editor", width: "20%", align: "left" },
      { Header: "category", accessor: "category", align: "center" },
      { Header: "title", accessor: "title", align: "left" },
      { Header: "description", accessor: "description", align: "left" },
      { Header: "image", accessor: "image", align: "center" },
      { Header: "actions", accessor: "actions", align: "center" },
    ],

    rows: [
      {
        editor: (
          <Editor
            image={team1}
            name="John Michael"
            email="john@creative-tim.com"
          />
        ),
        category: (
          <MDTypography variant="caption" fontWeight="medium" color="info">
            News
          </MDTypography>
        ),
        title: (
          <MDTypography variant="button" fontWeight="medium">
            Breaking News
          </MDTypography>
        ),
        description: (
          <PostDescription text="This is a detailed description of the breaking news post for demonstration purposes." />
        ),
        image: <PostImage src={home1} alt="Breaking News" />,
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
      },
      {
        editor: (
          <Editor
            image={team2}
            name="Alexa Liras"
            email="alexa@creative-tim.com"
          />
        ),
        category: (
          <MDTypography variant="caption" fontWeight="medium" color="warning">
            Investigation
          </MDTypography>
        ),
        title: (
          <MDTypography variant="button" fontWeight="medium">
            Investigation Report
          </MDTypography>
        ),
        description: (
          <PostDescription text="An in-depth look into the latest investigation conducted by the team today." />
        ),
        image: <PostImage src={home2} alt="Investigation Report" />,
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
      },
      {
        editor: (
          <Editor
            image={team3}
            name="Laurent Perrier"
            email="laurent@creative-tim.com"
          />
        ),
        category: (
          <MDTypography variant="caption" fontWeight="medium" color="success">
            Lifestyle
          </MDTypography>
        ),
        title: (
          <MDTypography variant="button" fontWeight="medium">
            Lifestyle Tips
          </MDTypography>
        ),
        description: (
          <PostDescription text="Tips and tricks to improve your daily lifestyle and enhance productivity." />
        ),
        image: <PostImage src={home3} alt="Lifestyle Tips" />,
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
      },
      {
        editor: (
          <Editor
            image={team4}
            name="Richard Davis"
            email="richard@creative-tim.com"
          />
        ),
        category: (
          <MDTypography variant="caption" fontWeight="medium" color="primary">
            Fact Check
          </MDTypography>
        ),
        title: (
          <MDTypography variant="button" fontWeight="medium">
            Fact Check Report
          </MDTypography>
        ),
        description: (
          <PostDescription text="Verifying the authenticity of widely circulated claims and reports." />
        ),
        image: <PostImage src={home4} alt="Fact Check Report" />,
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
      },
      {
        editor: (
          <Editor
            image={team3}
            name="Maria Smith"
            email="maria@creative-tim.com"
          />
        ),
        category: (
          <MDTypography variant="caption" fontWeight="medium" color="secondary">
            Impacts
          </MDTypography>
        ),
        title: (
          <MDTypography variant="button" fontWeight="medium">
            Community Impacts
          </MDTypography>
        ),
        description: (
          <PostDescription text="Exploring the impacts of recent events on the local community and society at large." />
        ),
        image: <PostImage src={home2} alt="Community Impacts" />,
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
      },
    ],
  };
}
