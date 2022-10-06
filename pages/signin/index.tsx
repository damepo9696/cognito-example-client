import React from "react";
import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import { Fetch } from "../../services/fetch";

const SignIn: NextPage = () => {
  return (
    <Container maxWidth="sm">
      <Paper>
        <Stack>
          <Typography>ログイン</Typography>
          <Button
            color="primary"
            onClick={async () => {
              const response = await (
                await Fetch.get({ url: "/api/signin" })
              ).json();
              window.location.href = response.authorize_uri;
            }}
          >
            ログイン画面へ
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SignIn;
