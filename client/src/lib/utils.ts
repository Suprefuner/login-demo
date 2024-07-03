import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import validator from 'validator';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const isValidateEmail = (email: string): boolean => validator.isEmail(email)

const isValidatePassword = (password: string): boolean => password.length >= 4

const setLocalStorage = (name: string, value: any) => {
  localStorage.setItem(name, JSON.stringify(value))
}

const getLocalStorage = (name: string): string | null => {
  const value = localStorage.getItem(name)
  return value ? JSON.parse(value) : null
}

export {
  cn, 
  isValidateEmail, 
  isValidatePassword, 
  setLocalStorage, 
  getLocalStorage
}