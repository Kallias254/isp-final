import { Endpoint } from 'payload/config';

const helloEndpoint: Endpoint = {
  path: '/hello',
  method: 'get',
  handler: (req, res) => {
    res.status(200).send('Hello World!');
  },
};

export default helloEndpoint;
