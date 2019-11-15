import { OPERATIONS_IDS, constants } from 'echojs-lib';

export const OPERATION_ID_PREFIX = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.OPERATION_HISTORY}.`;
export const ASSET_TYPE = 'ASSET';
export const TOKEN_TYPE = 'TOKEN';

export const OPTION_TYPES = {
	ACCOUNT: 'account',
	CONTRACT: 'contract',
	ASSET: 'asset',
	NUMBER: 'number',
	STRING: 'string',
	ACCOUNT_ADDRESS: 'eth_address',
	CONTRACT_ADDRESS: 'eth_address',
	EETH_ASSET: 'eEth',
	ERC20_TOKEN: 'erc20_token',
	ECHO_ASSET: 'ECHO',
};

export const CONTRACT_TYPES = [
	OPERATIONS_IDS.CONTRACT_CREATE,
	OPERATIONS_IDS.CONTRACT_CALL,
];

export const ACCOUNT_TYPES = [
	OPERATIONS_IDS.ACCOUNT_CREATE,
	OPERATIONS_IDS.ACCOUNT_UPDATE,
];

export const CONTRACT_RESULT_TYPE_0 = 0;
export const CONTRACT_RESULT_TYPE_1 = 1;
export const CONTRACT_RESULT_EXCEPTED_NONE = 'None';

export const OPERATION_KEYS = {
	[OPERATIONS_IDS.BALANCE_FREEZE]: 'account',
	[OPERATIONS_IDS.CONTRACT_CALL]: 'registrar',
	[OPERATIONS_IDS.TRANSFER]: 'from',
};

export const OPERATIONS = {
	transfer: {
		value: OPERATIONS_IDS.TRANSFER,
		name: 'operations.transfer.title',
		options: {
			from: {
				field: 'from',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.transfer.from',
			},
			subject: {
				field: 'to',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.transfer.subject',
			},
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	transfer_to_address: {
		value: OPERATIONS_IDS.TRANSFER_TO_ADDRESS,
		name: 'operations.transfer_to_address.title',
		options: {
			from: {
				field: 'from',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.transfer_to_address.from',
			},
			subject: {
				field: 'to',
				type: OPTION_TYPES.ACCOUNT_ADDRESS,
				label: 'operations.transfer_to_address.subject',
			},
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	override_transfer: {
		value: OPERATIONS_IDS.OVERRIDE_TRANSFER,
		name: 'operations.override_transfer.title',
		options: {
			from: {
				field: 'from',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.override_transfer.from',
			},
			subject: {
				field: 'to',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.override_transfer.subject',
			},
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	account_create: {
		value: OPERATIONS_IDS.ACCOUNT_CREATE,
		name: 'operations.account_create.title',
		options: {
			from: {
				field: 'registrar',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_create.from',
			},
			subject: {
				field: 'name',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_create.subject',
			},
			amount: null,
			asset: null,
		},
	},
	account_update: {
		value: OPERATIONS_IDS.ACCOUNT_UPDATE,
		name: 'operations.account_update.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_update.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	account_whitelist: {
		value: OPERATIONS_IDS.ACCOUNT_WHITELIST,
		name: 'operations.account_whitelist.title',
		options: {
			from: {
				field: 'authorizing_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_whitelist.from',
			},
			subject: {
				field: 'account_to_list',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_whitelist.subject',
			},
			amount: null,
			asset: null,
		},
	},
	account_address_create: {
		value: OPERATIONS_IDS.ACCOUNT_ADDRESS_CREATE,
		name: 'operations.account_address_create.title',
		options: {
			from: {
				field: 'owner',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_address_create.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	asset_create: {
		value: OPERATIONS_IDS.ASSET_CREATE,
		name: 'operations.asset_create.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_create.from',
			},
			subject: {
				field: 'symbol',
				type: OPTION_TYPES.STRING,
				label: 'operations.asset_create.subject',
			},
			amount: null,
			asset: null,
		},
	},
	asset_update: {
		value: OPERATIONS_IDS.ASSET_UPDATE,
		name: 'operations.asset_update.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_update.from',
			},
			subject: {
				field: 'asset_to_update',
				type: OPTION_TYPES.ASSET,
				label: 'operations.asset_update.subject',
			},
			amount: null,
			asset: null,
		},
	},
	asset_update_bitasset: {
		value: OPERATIONS_IDS.ASSET_UPDATE_BITASSET,
		name: 'operations.asset_bitasset_update.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_bitasset_update.from',
			},
			subject: {
				field: 'asset_to_update',
				type: OPTION_TYPES.ASSET,
				label: 'operations.asset_bitasset_update.subject',
			},
			amount: null,
			asset: null,
		},
	},
	asset_update_feed_producers: {
		value: OPERATIONS_IDS.ASSET_UPDATE_FEED_PRODUCERS,
		name: 'operations.asset_update_feed_producers.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_update_feed_producers.from',
			},
			subject: {
				field: 'asset_to_update',
				type: OPTION_TYPES.ASSET,
				label: 'operations.asset_update_feed_producers.subject',
			},
			amount: null,
			asset: null,
		},
	},
	asset_issue: {
		value: OPERATIONS_IDS.ASSET_ISSUE,
		name: 'operations.asset_issue.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_issue.from',
			},
			subject: {
				field: 'issue_to_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_issue.subject',
			},
			amount: {
				field: 'asset_to_issue.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'asset_to_issue.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	asset_reserve: {
		value: OPERATIONS_IDS.ASSET_RESERVE,
		name: 'operations.asset_reserve.title',
		options: {
			from: {
				field: 'payer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_reserve.from',
			},
			subject: null,
			amount: {
				field: 'amount_to_reserve.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount_to_reserve.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	asset_fund_fee_pool: {
		value: OPERATIONS_IDS.ASSET_FUND_FEE_POOL,
		name: 'operations.asset_fund_fee_pool.title',
		options: {
			from: {
				field: 'from_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_fund_fee_pool.from',
			},
			subject: null,
			amount: {
				field: 'amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	asset_publish_feed: {
		value: OPERATIONS_IDS.ASSET_PUBLISH_FEED,
		name: 'operations.asset_publish_feed.title',
		options: {
			from: {
				field: 'publisher',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_publish_feed.from',
			},
			subject: {
				field: 'asset_id',
				type: OPTION_TYPES.ASSET,
				label: 'operations.asset_publish_feed.subject',
			},
			amount: {
				field: 'feed',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	asset_claim_fees: {
		value: OPERATIONS_IDS.ASSET_CLAIM_FEES,
		name: 'operations.asset_claim_fees.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_claim_fees.from',
			},
			subject: null,
			amount: {
				field: 'amount_to_claim.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount_to_claim.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	proposal_create: {
		value: OPERATIONS_IDS.PROPOSAL_CREATE,
		name: 'operations.proposal_create.title',
		options: {
			from: {
				field: 'fee_paying_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.proposal_create.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	proposal_update: {
		value: OPERATIONS_IDS.PROPOSAL_UPDATE,
		name: 'operations.proposal_update.title',
		options: {
			from: {
				field: 'fee_paying_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.proposal_update.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	proposal_delete: {
		value: OPERATIONS_IDS.PROPOSAL_DELETE,
		name: 'operations.proposal_delete.title',
		options: {
			from: {
				field: 'fee_paying_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.proposal_delete.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	committee_member_create: {
		value: OPERATIONS_IDS.COMMITTEE_MEMBER_CREATE,
		name: 'operations.committee_member_create.title',
		options: {
			from: {
				field: 'committee_member_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.committee_member_create.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	committee_member_update: {
		value: OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE,
		name: 'operations.committee_member_update.title',
		options: {
			from: {
				field: 'committee_member_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.committee_member_update.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	committee_member_update_global_parameters: {
		value: OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS,
		name: 'operations.committee_member_update_global_parameters.title',
		options: {
			from: null,
			subject: null,
			amount: null,
			asset: null,
		},
	},
	committee_member_activate: {
		value: OPERATIONS_IDS.COMMITTEE_MEMBER_ACTIVATE,
		name: 'operations.committee_member_activate.title',
		options: {
			from: null,
			subject: null,
			amount: null,
			asset: null,
		},
	},
	committee_member_deactivate: {
		value: OPERATIONS_IDS.COMMITTEE_MEMBER_DEACTIVATE,
		name: 'operations.committee_member_deactivate.title',
		options: {
			from: null,
			subject: null,
			amount: null,
			asset: null,
		},
	},
	committee_frozen_balance_deposit: {
		value: OPERATIONS_IDS.COMMITTEE_FROZEN_BALANCE_DEPOSIT,
		name: 'operations.committee_frozen_balance_deposit.title',
		options: {
			from: {
				field: 'committee_member_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.committee_frozen_balance_deposit.from',
			},
			subject: null,
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	committee_frozen_balance_withdraw: {
		value: OPERATIONS_IDS.COMMITTEE_FROZEN_BALANCE_WITHDRAW,
		name: 'operations.committee_frozen_balance_withdraw.title',
		options: {
			from: {
				field: 'committee_member_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.committee_frozen_balance_withdraw.from',
			},
			subject: null,
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	vesting_balance_create: {
		value: OPERATIONS_IDS.VESTING_BALANCE_CREATE,
		name: 'operations.vesting_balance_create.title',
		options: {
			from: {
				field: 'creator',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.vesting_balance_create.from',
			},
			subject: {
				field: 'owner',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.vesting_balance_create.subject',
			},
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	vesting_balance_withdraw: {
		value: OPERATIONS_IDS.VESTING_BALANCE_WITHDRAW,
		name: 'operations.vesting_balance_withdraw.title',
		options: {
			from: {
				field: 'owner',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.vesting_balance_withdraw.from',
			},
			subject: null,
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	balance_claim: {
		value: OPERATIONS_IDS.BALANCE_CLAIM,
		name: 'operations.balance_claim.title',
		options: {
			from: null,
			subject: {
				field: 'deposit_to_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.balance_claim.subject',
			},
			amount: null,
			asset: null,
		},
	},
	balance_freeze: {
		value: OPERATIONS_IDS.BALANCE_FREEZE,
		name: 'operations.balance_freeze.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.balance_freeze.from',
			},
			subject: null,
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	balance_unfreeze: {
		value: OPERATIONS_IDS.BALANCE_UNFREEZE,
		name: 'operations.balance_unfreeze.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.balance_unfreeze.from',
			},
			subject: null,
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	contract_create: {
		value: OPERATIONS_IDS.CONTRACT_CREATE,
		name: 'operations.contract_create.title',
		options: {
			from: {
				field: 'registrar',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.contract_create.from',
			},
			subject: null,
			amount: {
				field: 'value.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'value.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	contract_call: {
		value: OPERATIONS_IDS.CONTRACT_CALL,
		name: 'operations.contract_call.title',
		options: {
			from: {
				field: 'registrar',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.contract_call.from',
			},
			subject: {
				field: 'callee',
				type: OPTION_TYPES.CONTRACT,
				label: 'operations.contract_call.subject',
			},
			amount: {
				field: 'value.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'value.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	contract_internal_create: {
		value: OPERATIONS_IDS.CONTRACT_INTERNAL_CREATE,
		name: 'operations.contract_internal_create.title',
		options: {
			from: {
				field: 'caller',
				type: OPTION_TYPES.CONTRACT,
				label: 'operations.contract_internal_create.from',
			},
			subject: null,
			amount: {
				field: 'value.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'value.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	contract_internal_call: {
		value: OPERATIONS_IDS.CONTRACT_INTERNAL_CALL,
		name: 'operations.contract_internal_call.title',
		options: {
			from: {
				field: 'caller',
				type: OPTION_TYPES.CONTRACT,
				label: 'operations.contract_internal_call.from',
			},
			subject: null,
			amount: {
				field: 'value.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'value.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	contract_selfdestruct: {
		value: OPERATIONS_IDS.CONTRACT_SELFDESTRUCT,
		name: 'operations.contract_selfdestruct.title',
		options: {
			from: {
				field: 'contract',
				type: OPTION_TYPES.CONTRACT,
				label: 'operations.contract_selfdestruct.from',
			},
			subject: null,
			value: null,
			asset: null,
		},
	},
	contract_update: {
		value: OPERATIONS_IDS.CONTRACT_UPDATE,
		name: 'operations.contract_update.title',
		options: {
			from: {
				field: 'sender',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.contract_update.from',
			},
			subject: {
				field: 'contract',
				type: OPTION_TYPES.CONTRACT,
				label: 'operations.contract_update.subject',
			},
			amount: null,
			asset: null,
		},
	},
	contract_fund_pool: {
		value: OPERATIONS_IDS.CONTRACT_FUND_POOL,
		name: 'operations.contract_fund_pool.title',
		options: {
			from: {
				field: 'sender',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.contract_fund_pool.from',
			},
			subject: {
				field: 'contract',
				type: OPTION_TYPES.CONTRACT,
				label: 'operations.contract_fund_pool.subject',
			},
			amount: {
				field: 'value.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'value.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	contract_whitelist: {
		value: OPERATIONS_IDS.CONTRACT_WHITELIST,
		name: 'operations.contract_whitelist.title',
		options: {
			from: {
				field: 'sender',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.contract_whitelist.from',
			},
			subject: {
				field: 'contract',
				type: OPTION_TYPES.CONTRACT,
				label: 'operations.contract_whitelist.subject',
			},
			amount: null,
			asset: null,
		},
	},
	sidechain_eth_create_address: {
		value: OPERATIONS_IDS.SIDECHAIN_ETH_CREATE_ADDRESS,
		name: 'operations.sidechain_eth_create_address.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_eth_create_address.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	sidechain_eth_approve_address: {
		value: OPERATIONS_IDS.SIDECHAIN_ETH_APPROVE_ADDRESS,
		name: 'operations.sidechain_eth_approve_address.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_eth_approve_address.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	sidechain_eth_deposit: {
		value: OPERATIONS_IDS.SIDECHAIN_ETH_DEPOSIT,
		name: 'operations.sidechain_eth_deposit.title',
		options: {
			from: {
				field: 'committee_member_id',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_eth_deposit.from',
			},
			subject: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_eth_deposit.subject',
			},
			amount: {
				field: 'value',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				type: OPTION_TYPES.EETH_ASSET,
			},
		},
	},
	sidechain_eth_withdraw: {
		value: OPERATIONS_IDS.SIDECHAIN_ETH_WITHDRAW,
		name: 'operations.sidechain_eth_withdraw.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_eth_withdraw.from',
			},
			subject: {
				field: 'eth_addr',
				type: OPTION_TYPES.ACCOUNT_ADDRESS,
				label: 'operations.sidechain_eth_withdraw.subject',
			},
			amount: {
				field: 'value',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				type: OPTION_TYPES.EETH_ASSET,
			},
		},
	},
	sidechain_eth_approve_withdraw: {
		value: OPERATIONS_IDS.SIDECHAIN_ETH_APPROVE_WITHDRAW,
		name: 'operations.sidechain_eth_approve_withdraw.title',
		options: {
			from: {
				field: 'committee_member_id',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_eth_approve_withdraw.from',
			},
			subject: {
				field: 'withdraw_id',
				type: OPTION_TYPES.NUMBER,
				label: 'operations.sidechain_eth_approve_withdraw.subject',
			},
			amount: null,
			asset: null,
		},
	},
	sidechain_issue: {
		value: OPERATIONS_IDS.SIDECHAIN_ISSUE,
		name: 'operations.sidechain_issue.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_issue.from',
			},
			subject: {
				field: 'deposit_id',
				type: OPTION_TYPES.NUMBER,
				label: 'operations.sidechain_issue.subject',
			},
			amount: {
				field: 'value.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'value.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	sidechain_burn: {
		value: OPERATIONS_IDS.SIDECHAIN_BURN,
		name: 'operations.sidechain_burn.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_burn.from',
			},
			subject: {
				field: 'withdraw_id',
				type: OPTION_TYPES.NUMBER,
				label: 'operations.sidechain_burn.subject',
			},
			amount: {
				field: 'value.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'value.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	sidechain_erc20_register_token: {
		value: OPERATIONS_IDS.SIDECHAIN_ERC20_REGISTER_TOKEN,
		name: 'operations.sidechain_erc20_register_token.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_erc20_register_token.from',
			},
			subject: {
				field: 'eth_addr',
				type: OPTION_TYPES.CONTRACT_ADDRESS,
				label: 'operations.sidechain_erc20_register_token.subject',
			},
			amount: null,
			asset: null,
		},
	},
	sidechain_erc20_deposit_token: {
		value: OPERATIONS_IDS.SIDECHAIN_ERC20_DEPOSIT_TOKEN,
		name: 'operations.sidechain_erc20_deposit_token.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_erc20_deposit_token.from',
			},
			subject: {
				field: 'erc20_token_addr',
				type: OPTION_TYPES.CONTRACT_ADDRESS,
				label: 'operations.sidechain_erc20_deposit_token.subject',
			},
			amount: {
				field: 'value',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				type: OPTION_TYPES.ERC20_TOKEN,
			},
		},
	},
	sidechain_erc20_withdraw_token: {
		value: OPERATIONS_IDS.SIDECHAIN_ERC20_WITHDRAW_TOKEN,
		name: 'operations.sidechain_erc20_withdraw_token.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_erc20_withdraw_token.from',
			},
			subject: {
				field: 'to',
				type: OPTION_TYPES.ACCOUNT_ADDRESS,
				label: 'operations.sidechain_erc20_withdraw_token.subject',
			},
			amount: {
				field: 'value',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				type: OPTION_TYPES.ERC20_TOKEN,
			},
		},
	},
	sidechain_erc20_approve_token_withdraw: {
		value: OPERATIONS_IDS.SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW,
		name: 'operations.sidechain_erc20_approve_token_withdraw.title',
		options: {
			from: {
				field: 'committee_member_id',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_erc20_approve_token_withdraw.from',
			},
			subject: {
				field: 'to',
				type: OPTION_TYPES.ACCOUNT_ADDRESS,
				label: 'operations.sidechain_erc20_approve_token_withdraw.subject',
			},
			amount: {
				field: 'value',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				type: OPTION_TYPES.ERC20_TOKEN,
			},
		},
	},
	sidechain_erc20_issue: {
		value: OPERATIONS_IDS.SIDECHAIN_ERC20_ISSUE,
		name: 'operations.sidechain_erc20_issue.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_erc20_issue.from',
			},
			subject: {
				field: 'token',
				type: OPTION_TYPES.STRING,
				label: 'operations.sidechain_erc20_issue.subject',
			},
			amount: {
				field: 'amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: null,
		},
	},
	sidechain_erc20_burn: {
		value: OPERATIONS_IDS.SIDECHAIN_ERC20_BURN,
		name: 'operations.sidechain_erc20_burn.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_erc20_burn.from',
			},
			subject: {
				field: 'token',
				type: OPTION_TYPES.STRING,
				label: 'operations.sidechain_erc20_burn.subject',
			},
			amount: {
				field: 'amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: null,
		},
	},
	sidechain_btc_create_address: {
		value: OPERATIONS_IDS.SIDECHAIN_BTC_CREATE_ADDRESS,
		name: 'operations.sidechain_btc_create_address.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_btc_create_address.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	sidechain_btc_create_intermediate_deposit: {
		value: OPERATIONS_IDS.SIDECHAIN_BTC_CREATE_INTERMEDIATE_DEPOSIT,
		name: 'operations.sidechain_btc_create_intermediate_deposit.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_btc_create_intermediate_deposit.from',
			},
			subject: null,
			value: null,
			asset: null,
		},
	},
	sidechain_btc_intermediate_deposit: {
		value: OPERATIONS_IDS.SIDECHAIN_BTC_INTERMEDIATE_DEPOSIT,
		name: 'operations.sidechain_btc_intermediate_deposit.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_btc_intermediate_deposit.from',
			},
			subject: {
				field: 'intermediate_address',
				type: OPTION_TYPES.STRING,
				label: 'operations.sidechain_btc_intermediate_deposit.subject',
			},
			amount: null,
			asset: null,
		},
	},
	sidechain_btc_deposit: {
		value: OPERATIONS_IDS.SIDECHAIN_BTC_DEPOSIT,
		name: 'operations.sidechain_btc_deposit.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_btc_deposit.from',
			},
			subject: {
				field: 'intermediate_deposit_id',
				type: OPTION_TYPES.STRING,
				label: 'operations.sidechain_btc_deposit.subject',
			},
			amount: null,
			asset: null,
		},
	},
	sidechain_btc_withdraw: {
		value: OPERATIONS_IDS.SIDECHAIN_BTC_WITHDRAW,
		name: 'operations.sidechain_btc_withdraw.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_btc_withdraw.from',
			},
			subject: {
				field: 'btc_addr',
				type: OPTION_TYPES.STRING,
				label: 'operations.sidechain_btc_withdraw.subject',
			},
			amount: {
				field: 'value',
				type: OPTION_TYPES.NUMBER,
			},
			asset: null,
		},
	},
	sidechain_btc_aggregate: {
		value: OPERATIONS_IDS.SIDECHAIN_BTC_AGGREGATE,
		name: 'operations.sidechain_btc_aggregate.title',
		options: {
			from: null,
			subject: {
				field: 'transaction_id',
				type: OPTION_TYPES.STRING,
				label: 'operations.sidechain_btc_aggregate.subject',
			},
			amount: null,
			asset: null,
		},
	},
	sidechain_btc_approve_aggregate: {
		value: OPERATIONS_IDS.SIDECHAIN_BTC_APPROVE_AGGREGATE,
		name: 'operations.sidechain_btc_approve_aggregate.title',
		options: {
			from: {
				field: 'committee_member_id',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.sidechain_btc_approve_aggregate.from',
			},
			subject: {
				field: 'transaction_id',
				type: OPTION_TYPES.STRING,
				label: 'operations.sidechain_btc_approve_aggregate.subject',
			},
			amount: null,
			asset: null,
		},
	},
	block_reward: {
		value: OPERATIONS_IDS.BLOCK_REWARD,
		name: 'operations.block_reward.title',
		options: {
			from: null,
			subject: {
				field: 'reciever',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.block_reward.subject',
			},
			amount: {
				field: 'amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				type: OPTION_TYPES.ECHO_ASSET,
			},
		},
	},
};
