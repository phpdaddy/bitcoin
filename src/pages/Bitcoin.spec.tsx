import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Bitcoin from './Bitcoin';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@devexpress/dx-react-chart-material-ui', () => ({
    Chart: () => 'Chart',
    AreaSeries: () => 'AreaSeries',
    ValueAxis: () => 'ValueAxis',
    ArgumentAxis: () => 'ArgumentAxis',
}));

jest.mock('axios');

describe('Bitcoin', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    test('renders Bitcoin component with normal response', async () => {
        (mockedAxios.get as jest.Mock)
            .mockResolvedValueOnce({
                data: {
                    time: {
                        updated: 'Jan 17, 2022 23:34:00 UTC',
                        updatedISO: '2022-01-17T23:34:00+00:00',
                        updateduk: 'Jan 17, 2022 at 23:34 GMT',
                    },
                    disclaimer:
                        'This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org',
                    bpi: {
                        USD: {
                            code: 'USD',
                            rate: '42,169.0300',
                            description: 'United States Dollar',
                            rate_float: 42169.03,
                        },
                    },
                },
                status: 200,
            })
            .mockResolvedValueOnce({
                data: {
                    bpi: {
                        '2021-12-17': 46171.715,
                        '2021-12-18': 46863.7717,
                        '2021-12-19': 46695.385,
                        '2021-12-20': 46913.6417,
                        '2021-12-21': 48923.3067,
                        '2021-12-22': 48620.5417,
                        '2021-12-23': 50832.2517,
                        '2021-12-24': 50831.9433,
                        '2021-12-25': 50436.6433,
                        '2021-12-26': 50796.875,
                        '2021-12-27': 50696.565,
                        '2021-12-28': 47549.8233,
                        '2021-12-29': 46470.69,
                        '2021-12-30': 47138.0417,
                        '2021-12-31': 46206.1767,
                        '2022-01-01': 47742.995,
                        '2022-01-02': 47310.9233,
                        '2022-01-03': 46448.0367,
                        '2022-01-04': 45837.3333,
                        '2022-01-05': 43430.7067,
                        '2022-01-06': 43098.685,
                        '2022-01-07': 41541.2233,
                        '2022-01-08': 41689.195,
                        '2022-01-09': 41864.1067,
                        '2022-01-10': 41838.4617,
                        '2022-01-11': 42744.29,
                        '2022-01-12': 43921.2833,
                        '2022-01-13': 42577.1583,
                        '2022-01-14': 43095.525,
                        '2022-01-15': 43096.105,
                        '2022-01-16': 43091.2567,
                    },
                    disclaimer:
                        'This data was produced from the CoinDesk Bitcoin Price Index. BPI value data returned as USD.',
                    time: {
                        updated: 'Jan 17, 2022 00:03:00 UTC',
                        updatedISO: '2022-01-17T00:03:00+00:00',
                    },
                },
                status: 200,
            });

        render(<Bitcoin />);

        //check what's rendered in the row
        await waitFor(() => {
            const currentPrice = screen.getByTestId('currentPrice' as any);
            expect(currentPrice.textContent).toBe('42,169.0300');

            const alert = screen.queryByTestId('alert' as any);
            expect(alert).not.toBeInTheDocument();
        });
    });

    test('renders Bitcoin component with error', async () => {
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({
                status: 500,
            })
            .mockResolvedValueOnce({
                status: 500,
            });

        render(<Bitcoin />);

        //check what's rendered in the row
        await waitFor(() => {
            const alert = screen.queryByTestId('alert' as any);
            expect(alert).toBeInTheDocument();
        });
    });
});
