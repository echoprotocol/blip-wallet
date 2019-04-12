export const DB_NAME = 'keyval-store';
export const STORE = 'keyval';
export const ENCRYPTED_DB_NAME = 'db';
export const ALGORITHM = 'aes-256-cbc';
export const SCRYPT_ALGORITHM_PARAMS = {
	N: 2 ** 14,
	r: 8,
	p: 1,
	l: 32,
	SALT_BYTES_LENGTH: 256,
};
export const ALGORITHM_IV_BYTES_LENGTH = 16;

export const NETWORKS = {
	testnet: {
		remote: {
			name: 'Remote node',
			url: 'wss://testnet.echo-dev.io/ws',
		},
		local: {
			name: 'Local node',
			url: 'ws://127.0.0.1:8090', // there must be a local node
		},
	},
};

export const DISCONNECT_STATUS = 'disconnect';
export const CONNECT_STATUS = 'connect';
export const ACTIVE_KEY = 'active';

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

export const LOCK_TIMEOUT = 3 * 60 * 1000; // 3 min
export const LOCK_TIMER_EVENTS = [
	// 'mousemove',
	'keydown',
	'wheel',
	'DOMMouseScroll',
	'mouseWheel',
	'mousedown',
	'touchstart',
	'touchmove',
	'MSPointerDown',
	'MSPointerMove',
];
