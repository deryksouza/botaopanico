import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTitle = styled(Typography)({
  flexGrow: 1,
});

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <StyledTitle variant="h6">
          Sistema de Segurança Bancária
        </StyledTitle>
      </Toolbar>
    </AppBar>
  );
}

export default Header;