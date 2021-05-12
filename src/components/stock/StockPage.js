import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Card } from 'react-bootstrap';
import StockSearch from './StockSearch';
import StockDash from './StockDash';
import StockFundamental from './StockFundamental';
import StockNewsListings from './StockNewsListings';
import { fetchStockSymbols } from './stockActions';

export default function StockPage() {
    const dispatch = useDispatch();
    const { stock, stockSymbols } = useSelector(state => state.stock);

    useEffect(() => {
        if (stockSymbols.length <= 0) {
            dispatch(fetchStockSymbols());
        }
    }, [dispatch, stockSymbols])

    return (
        <Container>
            <br/>
            <div className="d-flex justify-content-center">
                <StockSearch />
            </div>
            <br/>
            {stock.ticker ?
            <Card>
                <Card.Header>
                    <StockDash {...stock} />
                </Card.Header>
                <StockFundamental />
                <StockNewsListings news={stock.news} />
            </Card>
            :
            null
            }
        </Container>
    )
}