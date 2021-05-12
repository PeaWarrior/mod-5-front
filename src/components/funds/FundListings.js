import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import FundCard from './FundCard';

export default function FundListings() {
    const { funds } = useSelector(state => state.portfolio.currentPortfolio);
    const [currentPage, setCurrentPage] = useState(1);

    const handleClickIncrementPage = event => {
        setCurrentPage(currentPage+1)
    };
    const handleClickDecrementPage = event => {
        setCurrentPage(currentPage-1)
    };


    const renderFunds = () => {
        if (funds && funds.length) {
            const currentFunds = funds.slice(((currentPage-1)*6), (currentPage*6))
            return (
                <Card>
                    <Card.Header>
                        <Row>
                            <Col>Date</Col>
                            <Col>Transaction</Col>
                            <Col>Change</Col>
                        </Row>
                    </Card.Header>
                    {currentFunds.map(fund => <FundCard key={fund.id} {...fund} /> )}
                </Card>
            )
        } else {
            return <>No transactions found</>
        }
    }

    return (
        <Container className="mt-3">
            <Container className="pb-1">
                <Row>
                    <Col>
                        <h2>Transfers</h2>
                    </Col>
                    <Button 
                        variant="link"
                        disabled={currentPage === 1 ? true : false}
                        onClick={handleClickDecrementPage}
                    >
                        {<i className="fas fa-chevron-left"></i>}
                    </Button>
                    <Button 
                        variant="link"
                        disabled={funds && funds.length <= currentPage * 6 ? true : false}
                        onClick={handleClickIncrementPage}
                        >
                        <i className="fas fa-chevron-right"></i>
                    </Button>
                </Row>
                <hr/>
                {renderFunds()}

            </Container>
        </Container>
    )
}