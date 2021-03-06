import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Card, Row, Col } from 'react-bootstrap';
import StockCard from './StockCard';
import { fetchStockQuotes } from './stockActions';

export default function StockListings() {
    const dispatch = useDispatch();
    const {stocks, quotes} = useSelector(state => state.stock);
    const [lastTrade, setLastTrade] = useState({});

    useEffect(() => {
        if (stocks.length > 0) {
            const queries = stocks.map(stock => stock.ticker.toUpperCase());
            dispatch(fetchStockQuotes(queries.join()))
        }
    }, [stocks, dispatch])

    useEffect(() => {
        const socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.REACT_APP_FINNHUBB_API_KEY}`);

        socket.addEventListener('open', function (event) {
            stocks.forEach(stock => {
                if (stock.shares > 0) {
                    socket.send(JSON.stringify({'type':'subscribe', 'symbol': stock.ticker}))
                }
            })
        });

        const trades = {}

        socket.addEventListener('message', function (event) {
            const message = JSON.parse(event.data);
            if (message.type === 'trade') {
                trades[message.data[0].s] = message.data[0].p.toFixed(2)
            };
        });

        const interval = setInterval(() => {
            setLastTrade(prevState => ({
                ...prevState,
                ...trades
            }));
        }, 1000);

        return () => {
            stocks.forEach(stock => {
                socket.send(JSON.stringify({'type':'unsubscribe','symbol': stock.ticker}))
            })
            socket.close();
            clearInterval(interval);
        }
    }, [stocks]);

    const renderStocks = () => {
        const stocksWithShares = stocks.filter(stock => {
            return stock.shares > 0 ? true : false
        });

        const stocksArray = stocksWithShares.map(stock => {
            return <StockCard key={stock.id} {...quotes[stock.ticker]} lastTrade={lastTrade[stock.ticker]} {...stock} />
        });

        return stocksArray.length > 0 ? stocksArray : <h4>No current positions.</h4>
    }

    return (
        <Container className="mt-3">
            <Container className="pb-1">
                <Row>
                    <Col>
                        <h2>Positions</h2>
                    </Col>
                </Row>
                <hr/>
            </Container>
            <Card.Body>
                {renderStocks()}
            </Card.Body>
        </Container>
    )
}