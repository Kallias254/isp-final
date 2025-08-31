import { Endpoint } from 'payload/config';

const workOrdersEndpoint: Endpoint = {
  path: '/work-orders-test',
  method: 'get',
  handler: (req, res) => {
    console.log('Work orders test endpoint called');
    res.json({ message: 'Work orders test endpoint called' });
  },
};

export default workOrdersEndpoint;
