/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Import mock data
import { posts, videos, authors } from "store/mockData";

export default function data() {
  const avatars = (authorIds) =>
    authorIds.map((id) => {
      const author = authors.find((a) => a.id === id);
      return (
        <Tooltip key={author?.name} title={author?.name || "Unknown"} placeholder="bottom">
          <MDAvatar
            src={author?.avatar}
            alt={author?.name}
            size="xs"
            sx={{
              border: ({ borders: { borderWidth }, palette: { white } }) =>
                `${borderWidth[2]} solid ${white.main}`,
              cursor: "pointer",
              position: "relative",
              "&:not(:first-of-type)": { ml: -1.25 },
              "&:hover, &:focus": { zIndex: "10" },
            }}
          />
        </Tooltip>
      );
    });

  const Company = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  // Helper to calculate progress for completion bar
  const maxViews = Math.max(
    ...posts.map((p) => p.views || 0),
    ...videos.map((v) => v.views || 0),
    1
  );

const createRow = (item) => {
  const views = item.views || Math.floor(Math.random() * 1000); // ensure views exist
  return {
    companies: <Company name={item.title} />,
    members: <MDBox display="flex" py={1}>{avatars([item.authorId])}</MDBox>,
    budget: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {views} views
      </MDTypography>
    ),
    completion: (
      <MDBox width="8rem" textAlign="left">
        <MDProgress
          value={Math.floor((views / maxViews) * 100)} // use same views
          color="info"
          variant="gradient"
          label={false}
        />
      </MDBox>
    ),
    rawViews: views, // helper for sorting
  };
};


  // Combine posts and videos into rows and sort descending by views
  const rows = [...posts, ...videos]
    .map(createRow)
    .sort((a, b) => b.rawViews - a.rawViews) // highest views first
    .map(({ rawViews, ...rest }) => rest); // remove helper field

  return {
    columns: [
      { Header: "Title", accessor: "companies", width: "45%", align: "left" },
      { Header: "Author", accessor: "members", width: "10%", align: "left" },
      { Header: "Views", accessor: "budget", align: "center" },
      // { Header: "Popularity", accessor: "completion", align: "center" },
    ],
    rows,
  };
}
