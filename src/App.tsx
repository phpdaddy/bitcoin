import React from 'react';
import styled from 'styled-components';
import Bitcoin from './pages/Bitcoin';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';

const Root = styled('div')``;

const App = () => {
    return (
        <Root>
            <Container maxWidth="md">
                <Routes>
                    <Route path="/" element={<Navigate to="/bitcoin" />} />
                    <Route path="/bitcoin" element={<Bitcoin />} />
                </Routes>
            </Container>
        </Root>
    );
};

export default App;
