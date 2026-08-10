// Supabase Auth Integration

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://wumdbpyhpblvgjttsbpv.supabase.co'
const supabaseAnonKey = 'sb_publishable_xLqKY9N62MXb6ELG-5trig_RlJs_n-l'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session.user.email)
    // Update UI elements across the site
    document.querySelectorAll('.auth-hidden').forEach(el => el.style.display = 'none')
    document.querySelectorAll('.auth-visible').forEach(el => el.style.display = 'block')
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out')
    document.querySelectorAll('.auth-hidden').forEach(el => el.style.display = 'block')
    document.querySelectorAll('.auth-visible').forEach(el => el.style.display = 'none')
  }
})

// Utility functions
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  })
  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/index.html' // Adjust callback as needed
    }
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  window.location.href = '/index.html'
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function signInWithPhone(phone) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phone,
  })
  if (error) throw error
  return data
}

export async function verifyPhoneOtp(phone, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })
  if (error) throw error
  return data
}