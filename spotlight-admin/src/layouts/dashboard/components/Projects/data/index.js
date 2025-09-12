/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import axiosAdmin from "api/axiosAdmin";

export default function useAdminPostsData() {
  const [data, setData] = useState({ columns: [], rows: [] });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts with authors and views
        const posts = await axiosAdmin.get("/posts"); // expects author & views included

        const avatars = (author) => (
          <Tooltip
            key={author?.id}
            title={author?.name || "Unknown"}
            placement="bottom"
          >
            <MDAvatar
              src={author?.avatar_url || null}
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

        const maxViews = Math.max(...posts.data.map((i) => i.views_count || 0), 1);

        const createRow = (item) => {
          const views = item.views_count || 0;

          // Trim title to first 4 words
          const trimmedTitle = item.title
            ? item.title.split(" ").slice(0, 4).join(" ") +
              (item.title.split(" ").length > 4 ? "..." : "")
            : "";

          return {
            companies: (
              <MDBox display="flex" alignItems="center" lineHeight={1}>
                <MDTypography
                  variant="button"
                  fontWeight="medium"
                  ml={1}
                  lineHeight={1}
                >
                  {trimmedTitle}
                </MDTypography>
              </MDBox>
            ),
            members: (
              <MDBox display="flex" py={1}>
                {avatars(item.author)}
              </MDBox>
            ),
            budget: (
              <MDTypography variant="caption" color="text" fontWeight="medium">
                {views} views
              </MDTypography>
            ),
            completion: (
              <MDBox width="8rem" textAlign="left">
                <MDProgress
                  value={Math.floor((views / maxViews) * 100)}
                  color="info"
                  variant="gradient"
                  label={false}
                />
              </MDBox>
            ),
            rawViews: views,
          };
        };

        const rows = posts.data
          .map(createRow)
          .sort((a, b) => b.rawViews - a.rawViews)
          .map(({ rawViews, ...rest }) => rest);

        const columns = [
          { Header: "Title", accessor: "companies", width: "45%", align: "left" },
          { Header: "Author", accessor: "members", width: "10%", align: "left" },
          { Header: "Views", accessor: "budget", align: "center" },
        ];

        setData({ columns, rows });
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return data;
}
