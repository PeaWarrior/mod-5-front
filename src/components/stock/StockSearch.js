import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { fetchStockData } from './stockActions';

export default function StockSearch() {
    const dispatch = useDispatch();
    const { stockSymbols } = useSelector(state => state.stock)
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleChange = event => {
        setQuery(event.target.value);
    };

    useEffect(() => {
        if (query.length > 0) {
            const regexS = `^${query.toUpperCase()}+`;
            const regex = new RegExp(regexS);

            const suggestedSymbols = stockSymbols.filter(stock => {
                const description = stock.description.split(' ');
                const symbol = stock.symbol;

                if (symbol.match(regex)) {
                    return true
                }

                return description.some(word => word.match(regex));
            })

            setSuggestions(suggestedSymbols);
        }
    }, [stockSymbols, query])

    const handleSubmit = event => {
        event.preventDefault();
        dispatch(fetchStockData(query));
    };

    const renderSuggestions = () => {
        return suggestions.slice(0, 4).map(suggestion => {
            return <option value={suggestion.symbol} key={suggestion.symbol}>{suggestion.description}</option>
        })
    };
    
    return (
        <Form onSubmit={handleSubmit}>
            <InputGroup>
                <input 
                    onChange={handleChange} 
                    value={query} 
                    placeholder="Search symbol" 
                    list="suggestions"
                    className="search"
                />
                <datalist id="suggestions">
                    {renderSuggestions()}
                </datalist>
                <InputGroup.Append>
                    <Button variant="outline-secondary" type="submit"><i className="fas fa-search"></i></Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    )
}