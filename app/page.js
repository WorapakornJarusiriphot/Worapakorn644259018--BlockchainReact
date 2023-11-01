"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { formatEther, parseUnits } from "@ethersproject/units";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ethers } from "ethers";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

import abi from "./abi.json";

const [metaMask, hooks] = initializeConnector(
  (actions) => new MetaMask({ actions })
);
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
  hooks;
const contractChain = 1115511;
const contractAddress = "0x3483cB2b04999A5197C89Ffe0df87ED136cCbB57";

export default function Page() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActive = useIsActive();
  const provider = useProvider();

  const [error, setError] = useState(undefined);

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to metamask");
    });
  }, []);

  const handleConnect = () => {
    metaMask.activate(contractChain);
  };

  const handleDisconnect = () => {
    metaMask.resetState();
  };

  const [balance, setBalance] = useState("");
  useEffect(() => {
    const fetchBalance = async () => {
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const myBalance = await smartContract.balanceOf(accounts[0]);
      console.log(formatEther(myBalance));
      setBalance(formatEther(myBalance));
    };
    if (isActive) {
      fetchBalance();
    }
  }, [isActive]);

  const [WOJAValue, setWOJAValue] = useState(0);

  const handleSetWOJAValue = (event) => {
    setWOJAValue(event.target.value);
  };

  const handleBuy = async () => {
    try {
      // ตรวจสอบว่าผู้ใช้กรอกจำนวน ether ที่ต้องการซื้อหรือไม่
      if (WOJAValue <= 0) {
        alert("กรุณากรอกจำนวน ether ที่ต้องการซื้อ");
        return;
      }

      // สร้าง instance ของ smart contract โดยใช้ ethers.js
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);

      // แปลงค่าที่ผู้ใช้กรอกใน input field เป็น wei (หน่วยที่เล็กที่สุดของ ether)
      // const buyValue = ethers.utils.parseUnits(WOJAValue.toString(), "ether");
      const buyValue = parseUnits(WOJAValue.toString(), "ether");

      // เรียกใช้ฟังก์ชัน buy ใน smart contract
      const tx = await smartContract.buy({
        value: buyValue.toString(),
      });

      console.log("Transaction hash:", tx.hash);
      alert("ธุรกรรมถูกส่งเรียบร้อยแล้ว, กรุณาตรวจสอบใน MetaMask ของคุณ");
    } catch (err) {
      console.error("Error:", err);
      alert("เกิดข้อผิดพลาด: " + err.message);
    }
  };

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect  to metamask");
    });
  }, []);

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              WOJA Token Exchange
            </Typography>
            {isActive ? (
              <Stack direction="row" spacing={1}>
                <Chip label={accounts ? accounts[0] : ""} />
                <Button
                  color="inherit"
                  onClick={handleDisconnect}
                  value={"Disconnect"}
                >
                  Disconnect Wallet{""}
                </Button>
              </Stack>
            ) : (
              <Button color="inherit" onClick={handleConnect} value={"Connect"}>
                Connect Wallet{""}
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <br />

      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 30 }}
                color="text.secondary"
                gutterBottom
              >
                My wallet balance
              </Typography>

              <FormControl
                className={styles.nonInteractive}
                fullWidth
                sx={{ m: 1 }}
              >
                <InputLabel htmlFor="outlined-adornment-amount">
                  Accounts
                </InputLabel>
                <OutlinedInput
                  readOnly
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      <span className={styles.darkText}>
                        {accounts ? accounts[0] : ""}
                      </span>
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>

              <FormControl
                className={styles.nonInteractive}
                fullWidth
                sx={{ m: 1 }}
              >
                <InputLabel htmlFor="outlined-adornment-amount">
                  WOJA Balance
                </InputLabel>
                <OutlinedInput
                  readOnly
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      <span className={styles.darkText}>{balance}</span>
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>

              <Typography
                sx={{ fontSize: 30 }}
                color="text.secondary"
                gutterBottom
              >
                Buy WOJA Token
              </Typography>

              <TextField
                //className={styles.spacing}
                style={{
                  marginBottom: '1rem',
                }}
                fullWidth
                label="Enter amount of Ether you want to buy WOJA Token *"
                id="Enter amount of Ether you want to buy WOJA Token *"
                value={WOJAValue}
                onChange={handleSetWOJAValue}
              />

              <Button
                className={styles.fullWidthButton}
                variant="contained"
                onClick={handleBuy}
              >
                Buy WOJA Token
              </Button>
            </CardContent>
            <CardActions></CardActions>
          </Card>
        </Container>
      </React.Fragment>
    </div>
  );
}
