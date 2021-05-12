import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chart, Line } from 'react-chartjs-2';
import { Row, Container, Button } from 'react-bootstrap';
import moment from 'moment';
import { calculateChange } from './stockActions';
import { setIntradayChart, setWeekChart, setHistoricalChart, setPrices, setBorderColor, verticleLinePlugin } from './stockChartActions';
import StockPriceAnimation from './StockPriceAnimation';


export default function StockChart({ ticker, openPrice, lastPrice }) {
    const { date, graphData } = useSelector(state => state.stockChart);
    const dispatch = useDispatch();
    
    const [option, setOption] = useState('intraday');
    const [lastTrade, setLastTrade] = useState({
        price: lastPrice,
        time: moment().format('hh:mm A')
    });
    
    const [currentChange, setCurrentChange] = useState({});
    const [display, setDisplay] = useState({
        date: null,
        time: null,
        price: null
    });
    const ws = useRef(null);


    useEffect(() => {
        if (ticker) {
            switch (option) {
                case 'intraday':
                    dispatch(setIntradayChart(ticker, openPrice));
                    break;
                case 'week':
                    dispatch(setWeekChart(ticker));
                    break;
                case 'month':
                    dispatch(setHistoricalChart(ticker, 'month'));
                    break;
                case '3month':
                    dispatch(setHistoricalChart(ticker, 'month', 3));
                    break;
                case 'year':
                    dispatch(setHistoricalChart(ticker, 'year'));
                    break;
                case '5year':
                    dispatch(setHistoricalChart(ticker, 'year', 5));
                    break;
                default:
                    break;
            }
        }
    }, [option, ticker, openPrice, dispatch]);

    useEffect(() => {
        // const currentTime = moment().unix();
        // const openTime = moment().hour(9).minute(30).unix();
        // const closeTime = moment().hour(16).minute(0).unix();
        // && currentTime > openTime && currentTime > closeTime
        if (ticker) {
            ws.current = new WebSocket(`wss://ws.finnhub.io?token=${process.env.REACT_APP_FINNHUBB_API_KEY}`);

            ws.current.addEventListener('open', function (event) {
                ws.current.send(JSON.stringify({'type':'subscribe', 'symbol': ticker}))
            });
            
            return () => {
                ws.current.close();
            }
        }
    }, [ticker, dispatch]);

    useEffect(() => {
        if (ws.current) {
            let mostRecentTrade;
            ws.current.addEventListener('message', function (event) {
                const message = JSON.parse(event.data);
                if (message.type === 'trade') {
                    mostRecentTrade = {
                        price: message.data[0].p.toFixed(2),
                        time: moment(message.data[0].t).format('hh:mm A')
                    }
                }
            });

            const interval = setInterval(() => {
                console.log('hi')
                if (mostRecentTrade) {
                    setLastTrade(mostRecentTrade);
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            }
        }
    }, [])

    useEffect(() => {
        setLastTrade(prevState => ({
            price: lastPrice,
            time: moment().hour() <= 16 ? moment().format('hh:mm A') : '04:00 PM'
        }));
        setCurrentChange(dispatch(calculateChange(lastPrice, openPrice)));
    }, [ticker, lastPrice, openPrice, dispatch])

    useEffect(() => {
        const prices = [...graphData.datasets[0].data];
        if (option === 'intraday' && prices[prices.length-1] !== lastTrade.price) {
            prices[prices.length-1] = lastTrade.price;
            dispatch(setPrices(prices));
        }

        const borderColor = lastTrade.price > openPrice ? '#00ad00' : 'red';
        if (graphData.datasets[0].borderColor !== borderColor) {
            dispatch(setBorderColor(borderColor));
        }

    }, [option, lastTrade.price, openPrice, dispatch]);

    useEffect(() => {
        if (option === 'intraday' && graphData.datasets[0].data.length) {
            const updatedPrices = [...graphData.datasets[0].data, lastTrade.price]
            dispatch(setPrices(updatedPrices));
            setDisplay(prevState => ({
                ...prevState,
                time: moment().format('hh:mm A')
            }));
        }
    }, [lastTrade.time, lastTrade.price, option, dispatch])

    useEffect(() => {
        const price = display.price ? display.price : lastTrade.price;
        setCurrentChange(dispatch(calculateChange(price, graphData.datasets[0].data[0])));
    }, [display.price, lastTrade.price, graphData.datasets, dispatch]);

    useEffect(() => {
        const plugin = dispatch(verticleLinePlugin());
        Chart.pluginService.register(plugin);
        return () => {
            Chart.pluginService.unregister(plugin);
        }
    }, [dispatch])

    const graphOptions = {
        animation: false,
        legend: {display: false},
        maintainAspectRatio: true,
        aspectRatio: 2,
        responsive: true,
        responsiveAnimationDuration: 0,
        tooltips: {
            enabled: false,
            mode: 'index',
            intersect: false,
            custom: function(tooltipModel) {
                if (tooltipModel.body === undefined || tooltipModel.opacity === 0) {
                    const currentTime = moment()
                    const timeToDisplay = currentTime.hour() <= 16 && currentTime.hour() > 8 ? currentTime.format('hh:mm A') : '04:00 PM'
                    setDisplay({
                        date: null,
                        time: timeToDisplay,
                        price: null
                    });
                } else {
                    const price = (Math.round(tooltipModel.dataPoints[0].value*100)/100).toFixed(2);
                    const candle = tooltipModel.dataPoints[0].label.split(' - ');
                    if (!(moment(tooltipModel.dataPoints[0].label, "hh:mm A").format('mm') % 5)) {
                        setDisplay({
                            date: candle[1],
                            time: candle[0],
                            price: price
                        });
                    }
                }
            }
        },
        hover: {
            mode: 'x'
        },
        scales: {
            yAxes: [{
                ticks: {
                    display: false,
                },
                gridLines: {
                    display: false,
                    drawTicks: false,
                    drawOnChartArea: false,
                }
            }],
            xAxes: [{
                ticks: {
                    display: false,
                },
                gridLines: {
                    lineWidth: 3,
                    drawTicks: false,
                    drawOnChartArea: false
                }
            }]
        }
    }

    const handleClick = event => {
        setOption(event.target.value);
    };

    return (
        <>
            <Container>
                <Row>
                    <small>{display.date ? display.date : date}</small>
                </Row>
                <Row>
                    <StockPriceAnimation 
                        color={currentChange.type === '+' ? 'green' : 'red'}
                        price={display.price ? display.price : lastTrade.price} 
                    />
                </Row>
                <Row>
                    <small className={currentChange.type === '+' ? 'pos' : 'neg'}>
                        {currentChange.message}
                    </small>
                    <small className='ml-1'>
                        {display.time ? display.time : lastTrade.time}
                    </small>
                </Row>
            </Container>
                <Line
                    data={graphData}
                    options={graphOptions}
                />
                <Row>
                    <Button onClick={handleClick} variant='link' className={option === 'intraday' ? 'active-chart' : null} value="intraday">1D</Button>
                    <Button onClick={handleClick} variant='link' className={option === 'week' ? 'active-chart' : null} value="week">1W</Button>
                    <Button onClick={handleClick} variant='link' className={option === 'month' ? 'active-chart' : null} value="month">1M</Button>
                    <Button onClick={handleClick} variant='link' className={option === '3month' ? 'active-chart' : null} value="3month">3M</Button>
                    <Button onClick={handleClick} variant='link' className={option === 'year' ? 'active-chart' : null} value="year">1Y</Button>
                    <Button onClick={handleClick} variant='link' className={option === '5year' ? 'active-chart' : null} value="5year">5Y</Button>
                </Row>
        </>
    )
}