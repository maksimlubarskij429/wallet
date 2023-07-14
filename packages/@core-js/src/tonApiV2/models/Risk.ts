/* tslint:disable */
/* eslint-disable */
/**
 * REST api to TON blockchain explorer
 * Provide access to indexed TON blockchain
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: support@tonkeeper.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { JettonQuantity } from './JettonQuantity';
import {
    JettonQuantityFromJSON,
    JettonQuantityFromJSONTyped,
    JettonQuantityToJSON,
} from './JettonQuantity';
import type { NftItem } from './NftItem';
import {
    NftItemFromJSON,
    NftItemFromJSONTyped,
    NftItemToJSON,
} from './NftItem';

/**
 * Risk specifies assets that could be lost if a message would be sent to a malicious smart contract. It makes sense to understand the risk BEFORE sending a message to the blockchain.
 * @export
 * @interface Risk
 */
export interface Risk {
    /**
     * transfer all the remaining balance of the wallet.
     * @type {boolean}
     * @memberof Risk
     */
    transferAllRemainingBalance: boolean;
    /**
     * 
     * @type {number}
     * @memberof Risk
     */
    ton: number;
    /**
     * 
     * @type {Array<JettonQuantity>}
     * @memberof Risk
     */
    jettons: Array<JettonQuantity>;
    /**
     * 
     * @type {Array<NftItem>}
     * @memberof Risk
     */
    nfts: Array<NftItem>;
}

/**
 * Check if a given object implements the Risk interface.
 */
export function instanceOfRisk(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "transferAllRemainingBalance" in value;
    isInstance = isInstance && "ton" in value;
    isInstance = isInstance && "jettons" in value;
    isInstance = isInstance && "nfts" in value;

    return isInstance;
}

export function RiskFromJSON(json: any): Risk {
    return RiskFromJSONTyped(json, false);
}

export function RiskFromJSONTyped(json: any, ignoreDiscriminator: boolean): Risk {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'transferAllRemainingBalance': json['transfer_all_remaining_balance'],
        'ton': json['ton'],
        'jettons': ((json['jettons'] as Array<any>).map(JettonQuantityFromJSON)),
        'nfts': ((json['nfts'] as Array<any>).map(NftItemFromJSON)),
    };
}

export function RiskToJSON(value?: Risk | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'transfer_all_remaining_balance': value.transferAllRemainingBalance,
        'ton': value.ton,
        'jettons': ((value.jettons as Array<any>).map(JettonQuantityToJSON)),
        'nfts': ((value.nfts as Array<any>).map(NftItemToJSON)),
    };
}
