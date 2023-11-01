"use client"
import React,{useState,useEffect} from "react";

//import styles from './globals.css';
import styles from './page.module.css';

import { formatEther, parseUnits } from "@ethersproject/units";

import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

//import { ethers } from "ethers";
import { ethers } from "ethers";
//import { formatEther } from "@ethersproject/units";
//import { formatEther, parseUnits } from "@ethersproject/units";

//import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
//import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

// import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

//import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
//import Button from '@mui/material/Button';
//import Typography from '@mui/material/Typography';

//import * as React from 'react';
//import Box from '@mui/material/Box';
//import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

//import { ethers } from 'ethers';
//import { formatEther , parseUnits} from '@ethersproject/units';
import abi from './abi.json'

const [metaMask, hooks] = initializeConnector((actions) => new MetaMask({ actions }))
const { useChainId, useAccounts, useIsActivating, useIsActive , useProvider } = hooks
const contractChain = 1115511
const contractAddress = "0x3483cB2b04999A5197C89Ffe0df87ED136cCbB57"

// const [WOJAValue , setWOJAValue] = useState(0);
// const handleSetWOJAValue = event => {
//   setWOJAValue(event.target.value);
// };

// const handleBuy = async () => {

// }

export default function Page() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActive = useIsActive()
  const provider = useProvider()
  
  const [error, setError] = useState(undefined)

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, [])

  const handleConnect = () => {
    metaMask.activate(contractChain)
  }

  const handleDisconnect = () => {
    metaMask.resetState()
  }

  const [ balance , setBalance ] = useState("");
  useEffect(() => {
    const fetchBalance = async () => {
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi , signer)
      const myBalance = await smartContract.balanceOf(accounts[0])
      console.log(formatEther(myBalance));
      //setBalance(myBalance)
      setBalance(formatEther(myBalance))
    };
    if (isActive) {
      fetchBalance();
    }
  // }, [isActive , isLoad] );
  }, [isActive] );



  // const [WOJAValue, setWOJAValue] = useState(0);
  //   const handleSetWOJAValue = event => {
  //   _________________(event.target.value);
  //   };
  //   const handleBuy = async() => {
  //   try {
  //   if (WOJAValue<=0) {
  //   }
  //   return;

  //   const signer = provider.____________;
  //   const smartContract = new _____________ ;
  //   const buyValue = parseUnits(__________.toString(), "ether");
  //   const tx = await smartContract_________({
  //   value: buyValue.toString(),
  //   });
  //   smartContract.on("______" , (from, to, tokens) => {
  //     console.log(from, to, tokens, tx);
  //     setIsLoading(true);
  //   });
  //   console.log("Transaction hash:", tx.hash);
  //   } catch(err) {
  //   console.log(err);
  //   }
  // };

  const [WOJAValue, setWOJAValue] = useState(0);

  const handleSetWOJAValue = event => {
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

        //console.log(parseUnits);

        // เรียกใช้ฟังก์ชัน buy ใน smart contract
        const tx = await smartContract.buy({
            value: buyValue.toString()
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

  // const handleConnect = () => {
  //   metaMask.activate(contractChain);
  // };

  // const handleDisconnect = () => {
  //   metaMask.resetState();
  // };


return (
    <div>
       {/* <Box sx={{ flexGrow: 1 }}> */}
       <Box sx={{ width: '100%' }}>
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
          { isActive ?(

          <Stack direction="row" spacing={1}>
          <Chip label={ accounts ? accounts[0] : '' } />
          
          {/* <Chip label="Chip Outlined" variant="outlined" /> */}
          

            <Button color="inherit" onClick={handleDisconnect} value={'Disconnect'}>Disconnect Wallet{""}</Button>
            {/* <input type='button' onClick={handleDisconnect} value={'Disconnect'} /> */}
          </Stack>)
          :
            (
            <Button color="inherit" onClick={handleConnect} value={'Connect'}>Connect Wallet{""}</Button>
            // <input type='button' onClick={handleConnect} value={'Connect'} />
            )
          }
          {/* <Button color="inherit">Connect Wallet</Button> */}
        </Toolbar>
      </AppBar>
      {/* { isActive && <div>balance = { balance } </div>} */}
    </Box>

    <br/>

      {/* <p>chainId: { chainId }</p>
      <p>isActive: { isActive.toString() }</p>
      <p>accounts: { accounts ? accounts[0] : '' }</p> */}

      {/* <Stack spacing={2}>
        <Item>chainId: { chainId }</Item>
        <Item>isActive: { isActive.toString() }</Item>
        <Item>accounts: { accounts ? accounts[0] : '' }</Item>
        <Item>balance: { balance }</Item>
      </Stack> */}

      <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">

      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 30 }} color="text.secondary" gutterBottom>
          My wallet balance
        </Typography>

        {/* <FormControl className={styles.nonInteractive} fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">chainId</InputLabel>
          <OutlinedInput readOnly
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment className={styles.darkText} position="start">{ chainId }</InputAdornment>}
            label="Amount"
          />
        </FormControl>

        <FormControl className={styles.nonInteractive} fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">isActive</InputLabel>
          <OutlinedInput readOnly
            id="outlined-adornment-amount"
            startAdornment={
              <InputAdornment position="start">
                <span className={styles.darkText}>{ isActive.toString() }</span>
              </InputAdornment>
            }
            label="Amount"
          />
        </FormControl> */}

        <FormControl className={styles.nonInteractive} fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Accounts</InputLabel>
          <OutlinedInput readOnly
            id="outlined-adornment-amount"
            startAdornment={
              <InputAdornment position="start">
                <span className={styles.darkText}>{ accounts ? accounts[0] : '' }</span>
              </InputAdornment>
            }            
            label="Amount"
          />
        </FormControl>

        <FormControl className={styles.nonInteractive} fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">WOJA Balance</InputLabel>
          <OutlinedInput readOnly
            id="outlined-adornment-amount"
            startAdornment={
              <InputAdornment position="start">
                <span className={styles.darkText}>{ balance }</span>
              </InputAdornment>
            }
            label="Amount"
          />
        </FormControl>

        {/* <Typography variant="h5" component="div">
          be{bull}nev{bull}o{bull}lent
        </Typography> */}

        <Typography sx={{ fontSize: 30 }} color="text.secondary" gutterBottom>
          Buy WOJA Token
        </Typography>

        {/* <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Enter amount of Ether you want to buy WOJA Token *</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">Enter amount of Ether you want to buy WOJA Token *</InputAdornment>}
            label="Amount"
          />
        </FormControl> */}

        <TextField 
          className={styles.spacing}
          fullWidth 
          label="Enter amount of Ether you want to buy WOJA Token *" 
          id="Enter amount of Ether you want to buy WOJA Token *" 
          value={WOJAValue}
          onChange={handleSetWOJAValue}
        />

        {/* <Button variant="contained" disableElevation>
          Buy WOJA Token
        </Button> */}

        <Button className={styles.fullWidthButton} variant="contained" onClick={handleBuy}>
          Buy WOJA Token
        </Button>

        {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
      </CardContent>
      <CardActions>
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>

      {/* <Stack spacing={2}>
        <Item>chainId: { chainId }</Item>
        <Item>isActive: { isActive.toString() }</Item>
        <Item>accounts: { accounts ? accounts[0] : '' }</Item>
        <Item>balance: { balance }</Item>
      </Stack> */}
        {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} /> */}
      </Container>
    </React.Fragment>
    </div>
  )
}
