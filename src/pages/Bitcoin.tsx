import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { CurrentPrice } from '../types/CurrentPrice';
import axios from 'axios';
import { BackendUrl } from '../Constants';
import { Currency } from '../types/Currency';
import { History } from '../types/History';
import { Alert, Box, MenuItem, Paper, Select, Snackbar } from '@mui/material';
import { AreaSeries, ArgumentAxis, Chart, ValueAxis } from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';

const Root = styled('div')``;

interface ChartData {
    day: string;
    rate: number;
}

const Bitcoin = () => {
    const [currentPrice, setCurrentPrice] = useState<CurrentPrice>();
    const [currency, setCurrency] = useState<string>(Currency.USD);
    const [history, setHistory] = useState<History>();
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setError(null);
    };

    useEffect(() => {
        const fetchCurrentPrice = async () => {
            const response = await axios.get(`${BackendUrl}/currentprice/${currency}.json`);
            if (response.status !== 200) {
                setError('Invalid response!');
            } else {
                setCurrentPrice(response.data);
            }
        };
        fetchCurrentPrice();

        const fetchHistory = async () => {
            const response = await axios.get(`${BackendUrl}/historical/close.json?currency=${currency}`);
            if (response.status !== 200) {
                setError('Invalid response!');
            } else {
                setHistory(response.data);
            }
        };
        fetchHistory();
    }, [currency]);

    useEffect(() => {
        if (history?.bpi) {
            setChartData(
                Object.keys(history.bpi).map((date, index) => ({
                    day: (index + 1).toString(),
                    rate: history.bpi[date as string],
                }))
            );
        }
    }, [history]);

    return (
        <Root>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} data-testid="alert">
                    {error}
                </Alert>
            </Snackbar>
            <Box sx={{ mb: '20px', mt: '20px' }}>
                <Select
                    sx={{ mr: '20px' }}
                    value={currency}
                    onChange={(e: SelectChangeEvent) => {
                        setCurrency(e.target.value);
                    }}>
                    {Object.keys(Currency).map((currency: string) => {
                        const value = Currency[currency as keyof typeof Currency];
                        return (
                            <MenuItem key={value} value={value}>
                                {value}
                            </MenuItem>
                        );
                    })}
                </Select>
                <span data-testid="currentPrice">{currentPrice?.bpi[currency as string]?.rate}</span>
            </Box>
            <Paper>
                <Chart data={chartData}>
                    <ArgumentAxis showLabels={true} />
                    <ValueAxis />

                    <AreaSeries name="History" valueField="rate" argumentField="day" />
                    <Animation />
                </Chart>
            </Paper>
        </Root>
    );
};

export default Bitcoin;
