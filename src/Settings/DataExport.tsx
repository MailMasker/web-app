import { Alert, Button, Space, Typography } from "antd";
import React, { useState } from "react";

import ErrorAlert from "../lib/ErrorAlert";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { useExportDataLazyQuery } from "./generated/ExportData";

const { Title } = Typography;

const DataExport: React.FC<{}> = () => {
  const [
    exportDataQuery,
    {
      data: exportDataData,
      loading: exportDataLoading,
      error: exportDataError,
    },
  ] = useExportDataLazyQuery();

  const [debouncedWait, setDebouncedWait] = useState(false);

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <Title level={3}>Export Data</Title>
      <ul>
        <li>You can export all your data at any time for any reason.</li>
        <li>
          The format is JSON, and it's only for informational purposes – we
          don't plan to support a feature to allow you to re-import your data
          later.
        </li>
        <li>
          For a summary of what is exportable, see{" "}
          <Link to="/settings/data-privacy">Privacy</Link>.
        </li>
      </ul>
      <div>
        {exportDataData && !debouncedWait ? (
          <Alert
            message="Your data has been exported is ready for download..."
            description={
              <Button
                style={{ marginTop: "12px" }}
                onClick={() => {
                  var blob = new Blob([exportDataData.exportData], {
                    type: "text/json;charset=utf-8",
                  });
                  saveAs(
                    blob,
                    `Mail-Masker-Export-${dayjs().toISOString()}.json`
                  );
                }}
              >
                Download Data
              </Button>
            }
            type="success"
            showIcon
          />
        ) : exportDataError ? (
          <ErrorAlert error={exportDataError} />
        ) : (
          <Button
            onClick={() => {
              setDebouncedWait(true);
              setTimeout(() => setDebouncedWait(false), 2000);
              exportDataQuery();
            }}
            type="primary"
            loading={exportDataLoading || debouncedWait}
            disabled={exportDataLoading || debouncedWait}
          >
            {exportDataLoading || debouncedWait
              ? "Preparing Data..."
              : "Begin Data Export"}
          </Button>
        )}
      </div>
    </Space>
  );
};

export default DataExport;
