import React from 'react';
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Button from '../components/button';
import {GET_LAUNCH} from './cart-item';
import * as GetCartItemTypes from '../pages/__generated__/GetCartItems';
import * as BookTripsTypes from './__generated__/BookTrips';

interface BookTripsProps extends GetCartItemTypes.GetCartItems {}

const BookTrips: React.FC<BookTripsProps> = ({cartItems}) => {
    const [bookTrips, {data}] = useMutation<BookTripsTypes.BookTrips, BookTripsTypes.BookTripsVariables>(
        BOOK_TRIPS,
        {
            variables: {launchIds: cartItems},
            refetchQueries: cartItems.map(launchId => ({
                query: GET_LAUNCH,
                variables: { launchId },
            })),
            update(cache) {
                cache.writeData({data: {cartItems: []}})
            }
        }
    )
    return data && data.bookTrips && !data.bookTrips.success
    ? <p data-testid="message">{data.bookTrips.message}</p>
    : (
        <Button onClick={() => bookTrips()} data-tesid="book-button">
            Book All
        </Button>
    )
}

export const BOOK_TRIPS = gql`
    mutation BookTrips($launchids: [ID]!) {
        bookTrips(launchIds: $launchids) {
            success
            message
            launches {
                id
                isBooked
            }
        }
    }
`;

export default BookTrips;
