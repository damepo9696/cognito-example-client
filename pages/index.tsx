import React from "react";
import {
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Container,
} from "@mui/material";
import type { NextPage } from "next";
import { Fetch } from "../services/fetch";
import { SignUpRequestBody } from "./api/users";
import { ConfirmSignUpRequestBody } from "./api/users/confirm";
import { useRouter } from "next/router";
import { Path } from "../constants";
import Link from "next/link";

type SignUpStep = "SIGNUP" | "CONFIRM_SIGNUP";

const Home: NextPage = () => {
  const [step, setStep] = React.useState<SignUpStep>("SIGNUP");
  const [email, setEmail] = React.useState("");
  return (
    <Container maxWidth="sm">
      {step === "SIGNUP" && (
        <SignUp email={email} setEmail={setEmail} setStep={setStep} />
      )}
      {step === "CONFIRM_SIGNUP" && (
        <ConfirmSignUp email={email} setEmail={setEmail} setStep={setStep} />
      )}
    </Container>
  );
};

const SignUp = (params: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<SignUpStep>>;
}) => {
  const { email, setEmail, setStep } = params;
  const [password, setPassword] = React.useState("");
  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        const body: SignUpRequestBody = {
          email,
          password,
        };
        Fetch.post({
          url: "/api/users",
          body: JSON.stringify(body),
        }).then(() => setStep("CONFIRM_SIGNUP"));
      }}
    >
      <Stack flexDirection="column">
        <Typography>アカウント作成</Typography>
        <TextField
          label="メールアドレス"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="パスワード"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Stack
          flexDirection="row"
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Link href={Path.SignIn}>
            <MuiLink>ログイン</MuiLink>
          </Link>
          <Button type="submit">次へ</Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

const ConfirmSignUp = (params: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<SignUpStep>>;
}) => {
  const { email, setEmail, setStep } = params;
  const [confirmationCode, setConfirmationCode] = React.useState("");
  const router = useRouter();
  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        const body: ConfirmSignUpRequestBody = {
          email,
          confirmationCode,
        };
        Fetch.post({
          url: "/api/users/confirm",
          body: JSON.stringify(body),
        }).then(() => {
          setStep("SIGNUP");
          setEmail("");
          router.push(Path.SignIn);
        });
      }}
    >
      <Stack flexDirection="column">
        <Typography>メールアドレスの検証</Typography>
        <TextField
          label="検証コード"
          required
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
        <Stack flexDirection="row" alignItems="baseline" justifyContent="end">
          <Button type="submit">検証</Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Home;
