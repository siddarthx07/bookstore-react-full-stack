import { OrderDetails } from "../types";

export const OrderDetailsTypes = {
    UPDATE: 'UPDATE',
    CLEAR: 'CLEAR'
};

type UpdateAction = {
    type: typeof OrderDetailsTypes.UPDATE;
    payload: OrderDetails;
};

type ClearAction = {
    type: typeof OrderDetailsTypes.CLEAR;
};

type OrderDetailsAction = UpdateAction | ClearAction;

export const initialOrderDetailsState: OrderDetails | null = null;

export const orderDetailsReducer = (state: OrderDetails | null, action: OrderDetailsAction): OrderDetails | null => {
    console.log('OrderDetailsReducer: Current state:', state);
    console.log('OrderDetailsReducer: Action:', action);

    switch (action.type) {
        case OrderDetailsTypes.UPDATE:
            const updateAction = action as UpdateAction;
            console.log('OrderDetailsReducer: Updating order details:', updateAction.payload);
            return updateAction.payload;
        case OrderDetailsTypes.CLEAR:
            console.log('OrderDetailsReducer: Clearing order details');
            return null;
        default:
            throw new Error(`Invalid action type ${(action as any).type}`);
    }
};
