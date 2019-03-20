/* eslint import/prefer-default-export: off */
/* eslint-disable no-undef */
import { ClientFunction } from 'testcafe';

export const getPageUrl = ClientFunction(() => window.location.href);
