import { useUserInfo } from '@/components/useUserInfo/useUserInfo';
import React, { useState } from 'react';

export function useGlobalVars() {
  const [userInfo] = useUserInfo();
  return { loginUserInfo: userInfo };
}
