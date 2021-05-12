import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';

export default function PortfolioChart() {
    const { stocks, cash } = useSelector(state => state.portfolio.currentPortfolio);
    const [data, setData] = useState({});

    useEffect(() => {
        if (stocks) {
            const colors = [randomColorGenerator()];
            const stocksData = {
                names: ['Cash'],
                prices: [cash]
            };
            stocks.forEach(stock => {
                if (stock.shares > 0) {
                    const costBasis = (Math.round(stock.costBasis*100)/100).toFixed(2);
                    colors.push(randomColorGenerator());
                    stocksData.names.push(stock.ticker);
                    stocksData.prices.push(costBasis);
                }
            });
            setData({
                labels: [
                    ...stocksData.names
                ],
                datasets: [{
                    data: [
                        ...stocksData.prices
                    ],
                    backgroundColor: [...colors]
                }]
            })
        }
    }, [cash, stocks]);

    const options = {
        aspectRatio: 1,
        legend: {
            display: true,
            labels: {
                usePointStyle: false,
                fontSize: 16,
            }
        },
    };


    return (
        <>
        <Col md={10}>
            <Doughnut style={{maxHeight: '300px'}} data={data} options={options} />
        </Col>
        </>
    )
};

const randomColorGenerator = () => {
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8)
}