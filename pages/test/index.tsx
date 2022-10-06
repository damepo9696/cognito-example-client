import React from "react";
import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import { Fetch } from "../../services/fetch";

const Test: NextPage = () => {
  return (
    <Container maxWidth="sm">
      <Paper>
        <Stack>
          <Typography>保護対象リソースへのアクセス</Typography>
          <Button
            color="primary"
            onClick={() => {
              Fetch.get({ url: "/api/test" });
            }}
          >
            APIを実行
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Test;
