"use client"
import React,{useState,useEffect} from "react";

import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { ethers } from "ethers";
import { formatEther } from "@ethersproject/units";

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

// import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

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
      setBalance(myBalance)
    };
    if (isActive) {
      fetchBalance();
    }
  }, [isActive] );

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
            WOJA
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
    </Box>

    <br/>

      {/* <p>chainId: { chainId }</p>
      <p>isActive: { isActive.toString() }</p>
      <p>accounts: { accounts ? accounts[0] : '' }</p> */}

      <Stack spacing={2}>
        <Item>chainId: { chainId }</Item>
        <Item>isActive: { isActive.toString() }</Item>
        <Item>accounts: { accounts ? accounts[0] : '' }</Item>
      </Stack>
    </div>
  )
}
