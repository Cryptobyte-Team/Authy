import * as argon2 from 'argon2';

export const passwordHash = async(plainPassword: string): Promise<string> => {
  return (await argon2.hash(plainPassword));
};

export const comparePassword = async(plainPassword: string, passwordHash: string): Promise<boolean> => {
  return (await argon2.verify(passwordHash,plainPassword));
};