import { render } from '@testing-library/react';
import SearchFunctions from './Search.functions';
import {shallow } from 'enzyme';
import Search from './Search';
import ErrorBox from './ErrorBox';
import App from './App';

const errors = require('./config/errors.json');

const axios = require('axios');

jest.mock('axios')

describe('History', () => {

    it('Should get a 400 validation error when an invalid URL is sent', async () => {
        
        const errorMessage = "L'URL que vous avez entré n'existe pas.";

        axios.post.mockImplementationOnce(() =>
            Promise.reject(new Error(errorMessage)),
        );

        await expect(SearchFunctions.fetchHttpHeaders('https://www.google.com')).rejects.toEqual(new Error(errorMessage));
    });

    it('Should fetch successfully data from API', async () => {
        const data = {
            plugged: true,
            statusCode: 200,
            fstrzFlags: [
                'optimisée',
                'cachée'
            ],
            cloudFrontStatus: 'MISS',
            cloudfrontPOP: 'Madrid'
        };

        axios.post.mockImplementationOnce(() => Promise.resolve(data));
        
        await expect(SearchFunctions.fetchHttpHeaders('http://wwww.fasterize.com')).resolves.toEqual(data);

        await expect(axios.post).toHaveBeenCalledWith("http://localhost:3000", {"url": "http://wwww.fasterize.com"});
    })

    it('Input must be empty after clicking "Launch Analysis"', async () => {
        
        const search = shallow(<Search></Search>);

        search.setState({
            url: 'http://www.fasterize.com'
        });

        await expect(search.state().url).toEqual('http://www.fasterize.com')

        const query = search.find('#Query');

        search.find('#Submit').simulate('click');
        
        await expect(query.text()).toEqual('');
    })

    it('Should not validate the url', () => {
        const url = "URL erronée";

        expect(SearchFunctions.validateURL(url)).toEqual(false);
    })

    it('Should not validate the url', () => {
        const url = "https://www.fasterize.com";

        expect(SearchFunctions.validateURL(url)).toEqual(true);
    })

    it('Should not validate the url', async () => {
          
        const errorMessage = errors['not-found'].message;

        axios.post.mockImplementationOnce(() =>
            Promise.reject(new Error(errorMessage))
        );

        await expect(SearchFunctions.fetchHttpHeaders('https://www.url-qui-n-existe-pas.com')).rejects.toEqual(new Error(errorMessage));
    })
});