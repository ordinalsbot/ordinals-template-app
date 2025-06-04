import { Ordinalsbot } from 'ordinalsbot';

import { NETWORK } from '../constants';

const ordinalsbotObj = new Ordinalsbot(process.env.ORDINALSBOT_API_KEY, NETWORK || 'mainnet');

export default ordinalsbotObj;
