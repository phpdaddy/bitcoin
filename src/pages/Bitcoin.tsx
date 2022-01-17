import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { CurrentPrice } from '../types/CurrentPrice';
import axios from 'axios';
import { BackendUrl } from '../Constants';
import { Currency } from '../types/Currency';
import { History } from '../types/History';
import { Box, MenuItem, Paper, Select } from '@mui/material';
import { AreaSeries, ArgumentAxis, Chart, ValueAxis } from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';

const Root = styled('div')``;

interface ChartData {
    date: string;
    rate: number;
}

const Bitcoin = () => {
    const [currentPrice, setCurrentPrice] = useState<CurrentPrice>();
    const [currency, setCurrency] = useState<string>(Currency.USD);
    const [history, setHistory] = useState<History>();
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        const fetchCurrentPrice = async () => {
            const response = await axios.get(`${BackendUrl}/currentprice/${currency}.json`);
            setCurrentPrice(response.data);
        };
        fetchCurrentPrice();

        const fetchHistory = async () => {
            const response = await axios.get(`${BackendUrl}/historical/close.json?currency=${currency}`);
            setHistory(response.data);
        };
        fetchHistory();
    }, [currency]);

    useEffect(() => {
        if (history?.bpi) {
            setChartData(
                Object.keys(history.bpi).map((date) => ({
                    date,
                    rate: history.bpi[date as string],
                }))
            );
        }
    }, [history]);

    return (
        <Root>
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
                {currentPrice?.bpi[currency as string]?.rate}
            </Box>
            <Paper>
                <Chart data={chartData}>
                    <ArgumentAxis showLabels={false} />
                    <ValueAxis />

                    <AreaSeries name="History" valueField="rate" argumentField="date" />
                    <Animation />
                </Chart>
            </Paper>
        </Root>
    );
};

export default Bitcoin;
