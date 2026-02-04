import { ImageSourcePropType } from 'react-native';

export const partySymbolMap: Record<string, ImageSourcePropType> = {
  'aap': require('../../assets/images/party-symbols/aap.jpg'),
  'agp': require('../../assets/images/party-symbols/agp.jpg'),
  'aiadmk': require('../../assets/images/party-symbols/aiadmk.jpg'),
  'ajsu': require('../../assets/images/party-symbols/ajsu.jpg'),
  'bjd': require('../../assets/images/party-symbols/bjd.jpg'),
  'bjp': require('../../assets/images/party-symbols/bjp.jpg'),
  'brs': require('../../assets/images/party-symbols/brs.jpg'),
  'bsp': require('../../assets/images/party-symbols/bsp.jpg'),
  'cpi': require('../../assets/images/party-symbols/cpi.jpg'),
  'cpim': require('../../assets/images/party-symbols/cpim.jpg'),
  'dmk': require('../../assets/images/party-symbols/dmk.png'),
  'inc': require('../../assets/images/party-symbols/inc.jpg'),
  'iuml': require('../../assets/images/party-symbols/iuml.jpg'),
  'jds': require('../../assets/images/party-symbols/jds.png'),
  'jdu': require('../../assets/images/party-symbols/jdu.jpg'),
  'jmm': require('../../assets/images/party-symbols/jmm.jpg'),
  'ljp': require('../../assets/images/party-symbols/ljp.jpg'),
  'mnf': require('../../assets/images/party-symbols/mnf.jpg'),
  'ncp-sp': require('../../assets/images/party-symbols/ncp-sp.jpg'),
  'ncp': require('../../assets/images/party-symbols/ncp.jpg'),
  'ndpp': require('../../assets/images/party-symbols/ndpp.png'),
  'npf': require('../../assets/images/party-symbols/npf.png'),
  'npp': require('../../assets/images/party-symbols/npp.jpg'),
  'rjd': require('../../assets/images/party-symbols/rjd.jpg'),
  'rld': require('../../assets/images/party-symbols/rld.jpg'),
  'sad': require('../../assets/images/party-symbols/sad.jpg'),
  'skm': require('../../assets/images/party-symbols/skm.jpg'),
  'sp': require('../../assets/images/party-symbols/sp.jpg'),
  'ss-ubt': require('../../assets/images/party-symbols/ss-ubt.jpeg'),
  'ss': require('../../assets/images/party-symbols/ss.jpg'),
  'tdp': require('../../assets/images/party-symbols/tdp.jpg'),
  'tmc': require('../../assets/images/party-symbols/tmc.jpg'),
  'ysrcp': require('../../assets/images/party-symbols/ysrcp.jpg'),
  'zpm': require('../../assets/images/party-symbols/zpm.jpg'),
};

export function getPartySymbol(partyId: string): ImageSourcePropType | null {
  const normalizedId = partyId.toLowerCase().replace(/[()\s]/g, '');

  if (normalizedId in partySymbolMap) {
    return partySymbolMap[normalizedId];
  }

  const withoutDash = normalizedId.replace(/-/g, '');
  if (withoutDash in partySymbolMap) {
    return partySymbolMap[withoutDash];
  }

  for (const key of Object.keys(partySymbolMap)) {
    if (key.includes(normalizedId) || normalizedId.includes(key)) {
      return partySymbolMap[key];
    }
  }

  return null;
}

export function hasPartySymbol(partyId: string): boolean {
  return getPartySymbol(partyId) !== null;
}

export const totalPartySymbols = 34;
