export const NETWORKS = {
	remote: {
		name: 'Remote node',
		url: 'wss://testnet.echo-dev.io/ws',
	},
	local: {
		name: 'Local node',
		url: 'ws://127.0.0.1:8090', // there must be a local node
	},
};

export const DISCONNECT_STATUS = 'disconnect';
export const CONNECT_STATUS = 'connect';

export const REMOTE_NODE = 'remote';
export const LOCAL_NODE = 'local';

export const RANDOM_SIZE = 2048;
export const ECHORANDKEY_SIZE = 47;

export const KEY_CODE_ENTER = 13;
export const NAME_MIN_LENGTH = 1;
export const NAME_MAX_LENGTH = 63;

export const CONNECTION_TIMEOUT = 5000;
export const MAX_RETRIES = 999999999;
export const PING_TIMEOUT = 7000;
export const PING_INTERVAL = 7000;

export const EN_LOCALE = 'en';
export const RU_LOCALE = 'ru';
