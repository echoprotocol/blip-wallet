export const AUTHORIZATION = '/authorization';
export const ACCOUNT_CREATED = '/account-created';
export const ACCOUNT_IMPORTED = '/account-imported';
export const CREATE_PASSWORD = '/create-password';
export const RESTORE_PASSWORD = '/restore-password';
export const WALLET = '/wallet';
export const HISTORY = '/history';
export const SEND = '/send';
export const UNLOCK = 'unlock';
export const PAGE404 = '/page404';
export const INDEX_ROUTE = '/';
export const MANAGE_ACCOUNTS = '/manage-accounts';
export const RECEIVE = '/receive';

export const PUBLIC_ROUTES = [
	ACCOUNT_CREATED, AUTHORIZATION,
	ACCOUNT_IMPORTED, CREATE_PASSWORD,
	RESTORE_PASSWORD, PAGE404,
];

export const LOCKED_ROUTES = [
	ACCOUNT_CREATED, AUTHORIZATION,
	ACCOUNT_IMPORTED, WALLET, SEND,
	MANAGE_ACCOUNTS, HISTORY, RECEIVE,
];


export const SIDE_MENU_ROUTES = [WALLET, SEND, MANAGE_ACCOUNTS, HISTORY, RECEIVE];
